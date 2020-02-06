import express from "express";
import {
    getConnection, UpdateResult, InsertResult, getRepository,
} from "typeorm";
import wkx from "wkx";
import CatTag from "../data/entity/CatTag";
import Cat from "../data/entity/Cat";
import Tag from "../data/entity/Tag";
import Photo from "../data/entity/Photo";
import User from "../data/entity/User";
// import storage from "../data/storage";

const router:express.Router = express.Router();

// delete tag
router.post("/deleteTag", async (req:express.Request, res:express.Response) => {
    const { tagId, catId, userId }:{tagId:number, catId:number, userId:number } = req.body;
    try {
        const deleteTag:any = await getConnection().createQueryBuilder()
            .update(CatTag).set({ status: "D", deleteUser: userId })
            .where({ tag: tagId, cat: catId })
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
// ? 캣 태그, 사진 같이 보내줘야 함.
router.get("/:catId", async (req:express.Request, res:express.Response) => {
    const { catId }:{catId?: string} = req.params;
    try {
        const getCat:any = await getConnection()
            .createQueryBuilder()
            .select("cat")
            .from(Cat, "cat")
            .where("cat.id = :id", { id: catId })
            .getOne();
        if (!getCat) {
            res.status(404).send("Cat not found");
            return;
        }
        const getTag:any = await getRepository(CatTag)
            .createQueryBuilder("cat_tag")
            .where({ cat: catId, status: "Y" })
            .leftJoinAndSelect("cat_tag.tag", "tag")
            .select(["cat_tag.id", "tag.content"])
            .getMany();
        if (!getTag) {
            res.status(404).send("Cat not found");
            return;
        }
        const getPhoto:any = await getConnection()
            .createQueryBuilder()
            .select("photo")
            .from(Photo, "photo")
            .where("photo.cat = :cat", { cat: catId, isProfile: "Y" })
            .select(["photo.path"])
            .getOne();
        if (!getPhoto) {
            res.status(404).send("Cat not found");
            return;
        }
        res.status(200).send([getCat, getTag, getPhoto]);
    } catch (e) {
        res.status(409).send(e);
    }
});
// update cat rainbow
router.post("/rainbow", async (req:express.Request, res:express.Response) => {
    const { catId, rainbow }:{catId:number, rainbow:{Y:number, YDate:string|null, N:number, NDate:string|null}} = req.body;

    try {
        const selectedRainbow:Cat|undefined = await getConnection()
            .createQueryBuilder()
            .select("cat.rainbow")
            .from(Cat, "cat")
            .where({ id: catId })
            .getOne();

        if (!selectedRainbow) {
            res.status(500).send("cat이 조회되지 않습니다.");
            return;
        }

        const objSelectedRainbow:{Y:number, YDate:string|null, N:number, NDate:string|null} = JSON.parse(selectedRainbow.rainbow);

        // Y업데이트 일때!
        if (rainbow.YDate) {
            objSelectedRainbow.Y += rainbow.Y;
            objSelectedRainbow.YDate = rainbow.YDate;
        } else {
            objSelectedRainbow.N += rainbow.N;
            objSelectedRainbow.NDate = rainbow.NDate;
        }

        const strRainbow = JSON.stringify(objSelectedRainbow);

        const updateResult:UpdateResult = await getConnection()
            .createQueryBuilder()
            .update(Cat)
            .set({ rainbow: strRainbow })
            .where({ id: catId })
            .execute();

        if (updateResult.raw.changedRows) {
            const updatedCat:Cat|undefined = await getConnection()
                .createQueryBuilder()
                .select("cat.rainbow")
                .from(Cat, "cat")
                .where({ id: catId })
                .getOne();
            res.status(200).send(updatedCat);
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
        const getFollower:Array<object> = await getRepository(Cat).createQueryBuilder("cat")
            .where("cat.id = :id", { id: Number(catId) })
            .leftJoinAndSelect("cat.users", "user")
            .select(["cat.id", "user.id", "user.nickname", "user.photoPath"])
            .getMany();

        res.status(200).send(getFollower);
    } catch (e) {
        res.status(500).send("{'message': 'Unable to find followers'}");
    }
});

// Cat's Today Status
router.post("/addcatToday", async (req:express.Request, res:express.Response) => {
    const { catId, catToday }:{catId:number, catToday:string} = req.body;
    try {
        const now = Date();
        const updateToday:any = await getConnection().createQueryBuilder()
            .update(Cat).set({ today: catToday, todayTime: now })
            .where("cat.id= :id", { id: catId })
            .execute();
        if (!updateToday) {
            res.status(404).send("오늘의 상태 업데이트가 실패했습니다");
            return;
        }
        const result = `{'cat_today': ${catToday}, 'cat_today_time': ${now}}`;
        res.status(200).send(result);
    } catch (e) {
        res.status(409).send(e);
    }
    /*
    {
  "cat_today" : "기운이 넘침",
  "cat_today_time": 2020-01-30
}

    */
});

// Catcut
router.post("/cut", async (req:express.Request, res:express.Response) => {
    const { catId, catCut }:{catId:number, catCut:string} = req.body;
    try {
        const updateCut:UpdateResult = await getConnection().createQueryBuilder()
            .update(Cat).set({ cut: catCut })
            .where("cat.id= :id", { id: catId })
            .execute();
        if (!updateCut) {
            res.status(404).send("땅콩 업데이트가 실패했습니다");
        }
        if (updateCut.raw.changedRows) {
            res.status(200).send(catCut);
            return;
        }
        res.status(407).send("{'message': 'Could not update catcut'}");
    } catch (e) {
        res.status(409).send(e);
    }
    /*
{ Y : 0 , N : 0 , unknown : 0}

    */
});

// update Tag
router.post("/updateTag", async (req:express.Request, res:express.Response) => {
    const { userId, catId, catTag }:{userId: number, catId:number, catTag:string} = req.body;
    try {
        const checkTag:any = await getConnection()
            .createQueryBuilder()
            .select("tag").from(Tag, "tag")
            .where("tag.content = :content", { content: catTag })
            .select(["tag.id"])
            .getOne();
        if (checkTag) {
            const updateTag:any = await getConnection()
                .createQueryBuilder()
                .insert()
                .into("cat_tag")
                .values([{
                    user: userId, cat: catId, tag: checkTag.id, status: "Y",
                }])
                .execute();
            if (!updateTag) {
                res.status(404).send("오류로 인해 태그 업데이트가 실패했습니다");
            }
            const result = `{"message": "Tag updated successfully", "catTag": ${catTag}}`;
            res.status(200).send(result);
        } else {
            const newTag:InsertResult = await getConnection()
                .createQueryBuilder()
                .insert()
                .into("tag")
                .values([
                    {
                        content: catTag,
                    },
                ])
                .execute();
            if (!newTag) {
                res.status(404).send("오류로 인해 태그 업데이트가 실패했습니다");
                return;
            }
            const updateTag:any = await getConnection()
                .createQueryBuilder()
                .insert()
                .into("cat_tag")
                .values([{
                    user: userId, cat: catId, tag: newTag.identifiers[0].id, status: "Y",
                }])
                .execute();
            if (!updateTag) {
                res.status(404).send("오류로 인해 태그 업데이트가 실패했습니다");
            }
            const result = `{"message": "Tag updated successfully", "catTag": ${catTag}}`;
            res.status(200).send(result);
        }
    } catch (e) {
        res.status(409).send(e);
    }

    /*
{ "messge" : "Tag Add Successfully", "catTag": [뚱땡] }
    */
});

// Add Cat
//! new wkx.Point(1, 2).toWkt()
router.post("/addcat", async (req:express.Request, res:express.Response) => {
    // const {
    //     catTag, catNickname, location, catDescription, catSpecies, photoPath, cut, rainbow
    // }:{ catTag:Array<string>, catNickname:string, location:Array<number>, catDescription:string,
    //     catSpecies?:string, photoPath:string } = req.body;
    // const coordinate = new wkx.Point(location[0], location[1]).toWkt();

    // const addCat:InsertResult = await getConnection()
    // .createQueryBuilder()
    // .insert()
    // .into("cat")
    // .values([
    //   {
    //       description: catDescription, location: coordinate, nickname: catNickname,
    //   }
    //     ])

});

// Unfollow Cat
router.post("/unfollow", async (req:express.Request, res:express.Response) => {
    const { userId, catId }:{userId?:number, catId?:number} = req.body;
    try {
        const updateFollow:any = await getConnection()
            .createQueryBuilder()
            .delete()
            .from("following_cat")
            .where({ catId, userId })
            .execute();
        if (!updateFollow) {
            res.status(404).send("오류로 인해 팔로우 취소가 실패했습니다");
        }
        res.status(200).send("User unfollowed this cat");
    } catch (e) {
        res.status(404).send(e);
    }
    // response
    // {"message": "Unfollowed this cat"}
});

// This endpoint allows you to get the list of cats you follow.
router.get("/catlist/:userId", async (req:express.Request, res:express.Response) => {
    const { userId }:{userId?:string} = req.params;
    try {
        const getCat:Array<object> = await getRepository(User).createQueryBuilder("user")
            .where("user.id = :id", { id: Number(userId) })
            .leftJoinAndSelect("user.cats", "cat")
            .select(["user.id", "user.nickname", "user.photoPath", "user.createAt",
                "cat.id", "cat.description", "cat.location", "cat.nickname", "cat.species"])
            .leftJoinAndSelect("cat.photos", "photo", "photo.isProfile = :isProfile", { isProfile: "Y" })
            .select(["user.id", "user.nickname", "user.photoPath", "user.createAt",
                "cat.id", "cat.description", "cat.location", "cat.nickname", "cat.species",
                "photo.path"])
            .getMany();
        if (!getCat) {
            res.status(404).send("{'message': 'User's list not found'}");
        }
        res.status(200).send(getCat);
    } catch (e) {
        res.status(409).send(e);
    }
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
