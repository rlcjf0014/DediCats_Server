/* eslint-disable no-await-in-loop */
import express from "express";
import {
    getConnection, UpdateResult, InsertResult, getRepository, QueryBuilder, DeleteResult,
} from "typeorm";
import wkx from "wkx";
import CatTag from "../data/entity/CatTag";
import Cat from "../data/entity/Cat";
import Tag from "../data/entity/Tag";
import Photo from "../data/entity/Photo";
import User from "../data/entity/User";

const router:express.Router = express.Router();

// delete tag
router.post("/deleteTag", async (req:express.Request, res:express.Response) => {
    const { tagId, catId, userId }:{tagId:number, catId:number, userId:number } = req.body;
    try {
        const deleteTag:UpdateResult = await getConnection().createQueryBuilder()
            .update(CatTag).set({ status: "D", deleteUser: userId })
            .where({ tag: tagId, cat: catId })
            .execute();
        if (deleteTag.raw.changedRows === 0) {
            res.status(409).send("Failed to delete tag");
            return;
        }
        res.status(201).send("Successfully deleted tag");
    } catch (e) {
        res.status(400).send(e);
    }
});

// This endpoint updates the user's following information.
router.post("/follow", async (req:express.Request, res:express.Response) => {
    const { catId, userId }:{catId:number, userId:number} = req.body;

    try {
        const updateFollow:InsertResult = await getConnection()
            .createQueryBuilder()
            .insert()
            .into("following_cat")
            .values([
                { catId, userId },
            ])
            .execute();
        if (updateFollow.raw.affectedRows === 0) {
            res.status(409).send("Failed to follow this cat");
        }
        res.status(201).send("User now follows this cat");
    } catch (e) {
        res.status(400).send(e);
    }
});

// This endpoint provides you with the information of the selected cat.
// ? 캣 태그, 사진 같이 보내줘야 함.
router.get("/:catId", async (req:express.Request, res:express.Response) => {
    const { catId }:{catId?: string} = req.params;
    try {
        const connection = await getConnection().createQueryBuilder();
        const getCat:Cat|undefined = await connection
            .select("cat")
            .from(Cat, "cat")
            .where("cat.id = :id", { id: catId })
            .getOne();
        if (!getCat) {
            res.status(409).send("Cat not found");
            return;
        }
        const getTag:Array<object> = await getRepository(CatTag)
            .createQueryBuilder("cat_tag")
            .where({ cat: catId, status: "Y" })
            .leftJoinAndSelect("cat_tag.tag", "tag")
            .select(["cat_tag.id", "tag.content"])
            .getMany();
        if (!getTag) {
            res.status(409).send("Cat found, but tag not found");
            return;
        }
        const getPhoto:Photo|undefined = await connection
            .select("photo")
            .from(Photo, "photo")
            .where("photo.cat = :cat", { cat: catId, isProfile: "Y" })
            .select(["photo.path"])
            .getOne();
        if (!getPhoto) {
            res.status(409).send("Cat and tag found, but photo not found");
            return;
        }
        res.status(200).send([getCat, getTag, getPhoto]);
    } catch (e) {
        res.status(400).send(e);
    }
});

// update cat rainbow
router.post("/rainbow", async (req:express.Request, res:express.Response) => {
    const { catId, rainbow }:{catId:number, rainbow:{Y:number, YDate:string|null, N:number, NDate:string|null}} = req.body;

    try {
        const queryManager = getConnection().createQueryBuilder();

        const selectedRainbow:Cat|undefined = await queryManager
            .select("cat.rainbow")
            .from(Cat, "cat")
            .where({ id: catId })
            .getOne();

        if (!selectedRainbow) {
            res.status(206).send("Cat ID does not exist.");
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
        const updateResult:UpdateResult = await queryManager
            .update(Cat)
            .set({ rainbow: strRainbow })
            .where({ id: catId })
            .execute();

        if (updateResult.raw.changedRows) {
            const changedRainbow:Cat|undefined = await getConnection().createQueryBuilder()
                .select("cat.rainbow")
                .from(Cat, "cat")
                .where({ id: catId })
                .getOne();
            res.status(200).send(changedRainbow);
            return;
        }
        res.status(409).send("Could not update rainbow");
    } catch (e) {
        res.status(400).send(e);
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
        if (!getFollower) {
            res.status(409).send("Followers not found");
        }
        res.status(200).send(getFollower);
    } catch (e) {
        res.status(400).send(e);
    }
});

// Cat's Today Status
router.post("/addcatToday", async (req:express.Request, res:express.Response) => {
    const { catId, catToday }:{catId:number, catToday:string} = req.body;
    try {
        const now = Date();
        const updateToday:UpdateResult = await getConnection().createQueryBuilder()
            .update(Cat).set({ today: catToday, todayTime: now })
            .where("cat.id= :id", { id: catId })
            .execute();
        if (updateToday.raw.changedRows === 0) {
            res.status(409).send("Cat's today update failed");
            return;
        }
        const result = `{'cat_today': ${catToday}, 'cat_today_time': ${now}}`;
        res.status(201).send(result);
    } catch (e) {
        res.status(400).send(e);
    }
});

// Catcut
router.post("/cut", async (req:express.Request, res:express.Response) => {
    const { catId, catCut }:{catId:number, catCut:{Y:number, N:number, unknown:number}} = req.body;
    try {
        const queryManager = getConnection().createQueryBuilder();
        const selectedCut:Cat|undefined = await queryManager
            .select("cat.cut")
            .from(Cat, "cat")
            .where({ id: catId })
            .getOne();

        if (!selectedCut) {
            res.status(206).send("Cat ID does not exist.");
            return;
        }

        const objSelectedCut:{Y:number, N:number, unknown:number} = JSON.parse(selectedCut.cut);
        objSelectedCut.Y += catCut.Y;
        objSelectedCut.N += catCut.N;
        objSelectedCut.unknown += catCut.unknown;

        const updateCut:UpdateResult = await queryManager
            .update(Cat).set({ cut: JSON.stringify(objSelectedCut) })
            .where("cat.id= :id", { id: catId })
            .execute();
        if (!updateCut) {
            res.status(409).send("Failed to update peanuts.");
        }
        if (updateCut.raw.changedRows) {
            const updatedCat:Cat|undefined = await getConnection()
                .createQueryBuilder()
                .select("cat.cut")
                .from(Cat, "cat")
                .where({ id: catId })
                .getOne();
            res.status(201).send(updatedCat);
            return;
        }
        res.status(409).send("Could not update catcut");
    } catch (e) {
        res.status(400).send(e);
    }
});

// update Tag
router.post("/updateTag", async (req:express.Request, res:express.Response) => {
    const { userId, catId, catTag }:{userId: number, catId:number, catTag:string} = req.body;
    try {
        const connection:QueryBuilder<any> = await getConnection().createQueryBuilder();
        const checkTag:Tag|undefined = await connection
            .select("tag").from(Tag, "tag")
            .where("tag.content = :content", { content: catTag })
            .select(["tag.id"])
            .getOne();
        if (checkTag) {
            const updateTag:InsertResult = await connection
                .insert()
                .into("cat_tag")
                .values([{
                    user: userId, cat: catId, tag: checkTag.id, status: "Y",
                }])
                .execute();
            if (updateTag.raw.affectedRows === 0) {
                res.status(409).send("Tag update failed");
            }
            const result = `{"message": "Tag updated successfully", "addedcatTag": ${catTag}}`;
            res.status(200).send(result);
        } else {
            const newTag:InsertResult = await connection
                .insert()
                .into("tag")
                .values([
                    {
                        content: catTag,
                    },
                ])
                .execute();
            if (newTag.raw.affectedRows === 0) {
                res.status(409).send("Tag update failed");
                return;
            }
            const updateTag:InsertResult = await connection
                .insert()
                .into("cat_tag")
                .values([{
                    user: userId, cat: catId, tag: newTag.identifiers[0].id, status: "Y",
                }])
                .execute();
            if (updateTag.raw.affectedRows === 0) {
                res.status(409).send("Tag update failed");
            }
            const result = `{"message": "Tag updated successfully", "addedcatTag": ${catTag}}`;
            res.status(201).send(result);
        }
    } catch (e) {
        res.status(400).send(e);
    }
});

// Add Cat
//! new wkx.Point(1, 2).toWkt()
router.post("/addcat", async (req:express.Request, res:express.Response) => {
    const {
        catNickname, location, catDescription, catSpecies, photoPath, cut,
        // rainbow 제거!
    }:{ catNickname:string, location:Array<number>, catDescription:string,
        catSpecies:string, photoPath:string, cut:object } = req.body;
        // , rainbow:object
    try {
        const coordinate = new wkx.Point(location[0], location[1]).toWkt();
        const connection:QueryBuilder<any> = await getConnection().createQueryBuilder();
        const addCat:InsertResult = await connection
            .insert()
            .into("cat")
            .values([
                {
                    description: catDescription,
                    location: coordinate,
                    nickname: catNickname,
                    species: catSpecies,
                    cut: JSON.stringify(cut),
                    rainbow: JSON.stringify({
                        Y: 0, YDate: "", N: 0, NDate: "",
                    }),
                    status: "Y",
                },
            ])
            .execute();
        if (addCat.raw.affectedRows === 0) {
            res.status(409).send("Failed to add cat");
            return;
        }
        const addPhoto:InsertResult = await connection
            .insert()
            .into("photo")
            .values([
                {
                    path: photoPath, cat: addCat.identifiers[0].id, status: "Y", isProfile: "Y",
                },
            ])
            .execute();
        if (addPhoto.raw.affectedRows === 0) {
            res.status(409).send("Added cat, but failed to add its photo");
            return;
        }
        res.status(201).send("Successfully added cat");
    } catch (e) {
        res.status(400).send(e);
    }
});

// Unfollow Cat
router.post("/unfollow", async (req:express.Request, res:express.Response) => {
    const { userId, catId }:{userId:number, catId:number} = req.body;
    try {
        const updateFollow:DeleteResult = await getConnection()
            .createQueryBuilder()
            .delete()
            .from("following_cat")
            .where({ catId, userId })
            .execute();
        console.log(updateFollow);
        if (updateFollow.raw.affectedRows === 0) {
            res.status(409).send("Failed to unfollow cat");
        }
        res.status(201).send("User unfollowed this cat");
    } catch (e) {
        res.status(400).send(e);
    }
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
            res.status(409).send("User's list not found");
        }
        res.status(200).send(getCat);
    } catch (e) {
        res.status(400).send(e);
    }
});

export default router;
