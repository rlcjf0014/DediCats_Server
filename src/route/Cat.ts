import express from "express";
import { getConnection, UpdateResult } from "typeorm";
import CatTag from "../data/entity/CatTag";
import Cat from "../data/entity/Cat";
// import storage from "../data/storage";

const router:express.Router = express.Router();

// delete tag
router.post("/deleteTag", async (req:express.Request, res:express.Response) => {
    const { catTagId, userId }:{tagId:number, catTagId:number, userId:number } = req.body;
    try {
        const deleteTag:any = await getConnection().createQueryBuilder()
            .update(CatTag).set({ status: "D", deleteUser: userId })
            .where("cat_tag.id= id", { id: catTagId })
            .execute();
        if (!deleteTag) {
            res.status(404).send("오류로 인해 태그 삭제가 실패했습니다");
            return;
        }
        res.status(200).send("Successfully deleted tag");
    } catch (e) {
        res.status(404).send(e);
    }
});

// This endpoint updates the user's following information.
router.post("/follow", async (req:express.Request, res:express.Response) => {
    const { catId, userId }:{catId?:number, userId?:number} = req.body;

    try {
        const updateFollow:any = await getConnection()
            .createQueryBuilder()
            .insert()
            .into("following_cat")
            .values([
                { catId, userId },
            ])
            .execute();
        if (!updateFollow) {
            res.status(404).send("오류로 인해 팔로우가 실패했습니다");
        }
        res.status(200).send("User now follows this cat");
    } catch (e) {
        res.status(404).send(e);
    }
});

// This endpoint provides you with the information of the selected cat.
router.get("/:catId", async (req:express.Request, res:express.Response) => {
    const { catId }:{catId?: string} = req.params;
    try {
        const getCat = await getConnection()
            .createQueryBuilder()
            .select("cat")
            .from(Cat, "cat")
            .where("cat.id = :id", { id: catId })
            .getOne();
        if (!getCat) {
            res.status(404).send("Cat not found");
            return;
        }
        res.status(200).send(getCat);
    } catch (e) {
        res.status(409).send(e);
    }
});
// update cat rainbow
router.post("/rainbow", async (req:express.Request, res:express.Response) => {
    const { catId, rainbow }:{catId:number, rainbow:object} = req.body;

    try {
        const updateCat:UpdateResult = await getConnection()
            .createQueryBuilder()
            .update(Cat)
            .set({ rainbow })
            .where({ id: catId })
            .execute();

        if (updateCat.raw.changedRows) {
            const returnObj:Cat|undefined = await getConnection()
                .createQueryBuilder()
                .select(["cat.id", "cat.rainbow"])
                .from(Cat, "cat")
                .where("cat.id = :id", { id: catId })
                .getOne();
            res.status(200).send(returnObj);
            return;
        }
        res.status(407).send("{'message': 'Could not update rainbow'}");
    } catch (e) {
        res.status(409).send(e);
    }
});

// Followers Tab
router.get("/follower/:catId", async (req:express.Request, res:express.Response) => {
    const { catId }:{catId?: string} = req.params;
    try {
        const getFollower:Array<object> = await getConnection().createQueryBuilder(Cat, "cat")
            .leftJoinAndSelect("cat.user", "user")
            .where({ catId })
            .select(["cat.id", "user.id", "user.nickname", "user.photoPath"])
            .getMany();

        res.status(200).send(getFollower);
    } catch (e) {
        console.log(e);
        res.status(500).send("{'message': 'Unable to find followers'}");
    }
});

// Cat's Today Status
router.post("/addcatTody", (req:express.Request, res:express.Response) => {
    const { catId, catToday }:{catId?:number, catToday?:string} = req.body;

    /*
    {
  "cat_today" : "기운이 넘침",
  "cat_today_time": 2020-01-30
}

    */
});

// Catcut
router.post("/cut", (req:express.Request, res:express.Response) => {
    const { catId, catCut }:{catId?:number, catCut?:object} = req.body;

    /*
{ Y : 0 , N : 0 , unknown : 0}

    */
});

// update Tag
router.post("/updateTag", (req:express.Request, res:express.Response) => {
    const { catId, catTag }:{catId?:number, catTag?:string} = req.body;

    /*
{ "messge" : "Tag Add Successfully", "catTag": [뚱땡] }
    */
});

// Add Cat
router.post("/addcat", (req:express.Request, res:express.Response) => {
    const {
        catTag, catNickname, location, catDescription, catSpecies, catCut, photoPath,
    }:{ catTag?:Array<number>, catNickname?:string, location?:string, catDescription?:string, catSpecies?:string, catCut?:object, photoPath?:string } = req.body;

    /*
    {
  "cat_today" : "기운이 넘침",
  "cat_today_time": 2020-01-30
}

    */
});

// Unfollow Cat
router.post("/unfollow", (req:express.Request, res:express.Response) => {
    const { userId, catId }:{userId?:number, catId?:number} = req.body;

    // response
    // {"message": "Unfollowed this cat"}
});

// Unfollow Cat
router.get("/catlist/:userId", (req:express.Request, res:express.Response) => {
    const { userId }:{userId?:string} = req.params;

    // response
    /*
      {
  cat_id: 1,
  location: "Point (10 3)",
  cat_nickname: "돼냥이",
  cat_photo: binary data,
  },
  {
  cat_id: 2,
  location: "Point (13 5)",
  cat_nickname: "냥이",
  cat_photo: binary data,
  }
]
    */
});

export default router;
