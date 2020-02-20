/* eslint-disable no-await-in-loop */
import express from "express";
import {
    getConnection, UpdateResult, InsertResult, getRepository, QueryBuilder, DeleteResult,
} from "typeorm";
import wkx from "wkx";
import CatTag from "../model/entity/CatTag";
import Cat from "../model/entity/Cat"
import Tag from "../model/entity/Tag";
import Photo from "../model/entity/Photo";
import User from "../model/entity/User";

import uploadFile from "../library/ImageFunction/imgupload";
import { getUserIdbyAccessToken } from "../library/jwt";

import * as CatService from "../Service/Cat";
import * as CatTagService from "../Service/CatTag";

const router:express.Router = express.Router();

// delete tag
router.post("/deleteTag", async (req:express.Request, res:express.Response) => {
    const { tagId, catId }:{tagId:number, catId:number } = req.body;
    const { accessToken }:{accessToken:string} = req.signedCookies;
    try {
        const userId = getUserIdbyAccessToken(accessToken);

        const deleteTag:UpdateResult = await CatTagService.deleteTag(tagId, catId, userId);
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
    const { catId }:{catId:number} = req.body;
    const { accessToken }:{accessToken:string} = req.signedCookies;
    try {
        const userId = getUserIdbyAccessToken(accessToken);

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


// update cat rainbow
router.post("/rainbow", async (req:express.Request, res:express.Response) => {
    const { catId, rainbow }:{catId:number, rainbow:{Y:number, YDate:string|null, N:number, NDate:string|null}} = req.body;

    try {
        const selectedRainbow:Cat|undefined = await CatService.selectCat(catId);
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

        const updateResult:UpdateResult = await CatService.updateCatRainbow(catId, strRainbow);

        if (updateResult.raw.changedRows) {
            const changedRainbow:Cat|undefined = await CatService.selectCat(catId);
            res.status(200).send(changedRainbow?.rainbow);
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
        const getFollower:Array<object> = await CatService.getCatFollower(catId);

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
        const now = `${new Date().toISOString().slice(0, 23)}Z`;
        const updateToday:UpdateResult = await CatService.addCatToday(catId, catToday, now);

        if (updateToday.raw.changedRows === 0) {
            res.status(409).send("Cat's today update failed");
            return;
        }
        const result = { cat_today: catToday, cat_today_time: now };
        res.status(201).send(result);
    } catch (e) {
        res.status(400).send(e);
    }
});

// Catcut
router.post("/cut", async (req:express.Request, res:express.Response) => {
    const { catId, catCut }:{catId:number, catCut:{Y:number, N:number, unknown:number}} = req.body;
    try {

        const selectedCut:Cat|undefined = await CatService.selectCat(catId);

        if (!selectedCut) {
            res.status(206).send("Cat ID does not exist.");
            return;
        }

        const objSelectedCut:{Y:number, N:number, unknown:number} = JSON.parse(selectedCut.cut);
        objSelectedCut.Y += catCut.Y;
        objSelectedCut.N += catCut.N;
        objSelectedCut.unknown += catCut.unknown;

        const updateCut:UpdateResult = await CatService.updateCatCut(catId, JSON.stringify(objSelectedCut));

        if (!updateCut) {
            res.status(409).send("Failed to update peanuts.");
        }
        if (updateCut.raw.changedRows) {

            const updatedCat:Cat|undefined = await CatService.selectCat(catId);
            res.status(201).send(updatedCat?.cut);
            return;
        }
        res.status(409).send("Could not update catcut");
    } catch (e) {
        res.status(400).send(e);
    }
});

// update Tag
router.post("/updateTag", async (req:express.Request, res:express.Response) => {
    const { catId, catTag }:{catId:number, catTag:string } = req.body;
    const { accessToken }:{accessToken:string} = req.signedCookies;
    try {
        const userId = getUserIdbyAccessToken(accessToken);

        const checkTag:Tag|undefined = await CatTagService.checkTag(catTag);
        if (checkTag) {
            const updateTag:InsertResult = await CatTagService.updateTag(userId, catId, checkTag.id);
            if (updateTag.raw.affectedRows === 0) {
                res.status(409).send("Tag update failed");
            }
            const result = {
                id: checkTag.id,
                tag: {
                    content: catTag,
                },
            };

            res.status(201).send(result);
        } else {
            const newTag:InsertResult = await CatTagService.newTag(catTag);
            if (newTag.raw.affectedRows === 0) {
                res.status(409).send("Tag update failed");
                return;
            }
            const updateTag:InsertResult = await CatTagService.updateTag(userId, catId, newTag.identifiers[0].id)
            if (updateTag.raw.affectedRows === 0) {
                res.status(409).send("Tag update failed");
            }
            const result = {
                id: newTag.identifiers[0].tag,
                tag: {
                    content: catTag,
                },
            };

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
        catNickname, location, address, catDescription, catSpecies, photoPath, cut,
    }:{ catNickname:string, location:{latitude:number, longitude:number}, address:string, catDescription:string,
        catSpecies:string, photoPath:string, cut:object, } = req.body;
    const { accessToken }:{accessToken:string} = req.signedCookies;
    try {
        const userId = getUserIdbyAccessToken(accessToken);

        const coordinate = new wkx.Point(location.latitude, location.longitude).toWkt();
        const addCat: InsertResult = await CatService.addCat(catNickname, coordinate, address, catDescription, catSpecies, userId, cut);

        if (addCat.raw.affectedRows === 0) {
            res.status(409).send("Failed to add cat");
            return;
        }
        const imagepath:string|unknown = await uploadFile(`CAT #${addCat.identifiers[0].id}`, photoPath);
        if (!imagepath) {
            const deleteCat:DeleteResult = await getConnection()
                .createQueryBuilder()
                .delete()
                .from("cat")
                .where({ id: addCat.identifiers[0].id })
                .execute();
            if (deleteCat.raw.affectedRows === 0) {
                res.status(409).send("Failed to delete cat without posted picture, contact admin");
                return;
            }
            res.status(409).send("Added cat, but failed to add its photo");
            return;
        }
        const addPhoto:InsertResult = await await getConnection().createQueryBuilder()
            .insert()
            .into("photo")
            .values([
                {
                    path: imagepath, cat: addCat.identifiers[0].id, status: "Y", isProfile: "Y",
                },
            ])
            .execute();
        if (addPhoto.raw.affectedRows === 0) {
            const deleteCat:DeleteResult = await getConnection()
                .createQueryBuilder()
                .delete()
                .from("cat")
                .where({ id: addCat.identifiers[0].id })
                .execute();
            if (deleteCat.raw.affectedRows === 0) {
                res.status(409).send("Failed to delete cat without posted picture, contact admin");
                return;
            }
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
    const { catId }:{catId:number} = req.body;
    const { accessToken }:{accessToken:string} = req.signedCookies;
    try {
        const userId = getUserIdbyAccessToken(accessToken);

        const updateFollow:DeleteResult = await getConnection()
            .createQueryBuilder()
            .delete()
            .from("following_cat")
            .where({ catId, userId })
            .execute();
        if (updateFollow.raw.affectedRows === 0) {
            res.status(409).send("Failed to unfollow cat");
        }
        res.status(201).send("User unfollowed this cat");
    } catch (e) {
        res.status(400).send(e);
    }
});

// This endpoint allows you to get the list of cats you follow.
router.get("/catlist", async (req:express.Request, res:express.Response) => {
    const { accessToken }:{accessToken:string} = req.signedCookies;
    try {
        const userId = getUserIdbyAccessToken(accessToken);

        const getCat1:Array<object> = await getRepository(User).createQueryBuilder("user")
            .where("user.id = :id", { id: Number(userId) })
            .leftJoinAndSelect("user.cats", "cat")
            .select(["user.id", "user.nickname", "user.photoPath", "user.createAt",
                "cat.id", "cat.description", "cat.address", "cat.nickname", "cat.species"])
            .leftJoinAndSelect("cat.photos", "photo", "photo.isProfile = :isProfile", { isProfile: "Y" })
            .select(["user.id", "user.nickname", "user.photoPath", "user.createAt",
                "cat.id", "cat.description", "cat.address", "cat.nickname", "cat.species",
                "photo.path"])
            .getMany();
        if (!getCat1) {
            res.status(409).send("User's list not found");
        }
        res.status(200).send(getCat1);
    } catch (e) {
        res.status(400).send(e);
    }
});

// This endpoint provides you with the information of the selected cat.
// ? 캣 태그, 사진 같이 보내줘야 함.
router.get("/:catId", async (req:express.Request, res:express.Response) => {
    const { catId }:{catId?: string } = req.params;
    const { accessToken }:{accessToken:string} = req.signedCookies;
    try {
        const userId = getUserIdbyAccessToken(accessToken);
        const getCat:Cat|undefined = await CatService.getCat(catId);

        if (!getCat) {
            res.status(409).send("Cat not found");
            return;
        }
        const checkFollow:Array<{count: string}> = await getConnection()
            .query("select count(*) as `count` from following_cat where userId = ? and catId = ?;", [userId, catId]);
        const follow:object = checkFollow[0].count === "1" ? { isFollowing: true } : { isFollowing: false };
        
        const getTag: Array<object> = await CatTagService.getTag(catId);
        if (!getTag) {
            res.status(409).send("Cat found, but tag not found");
            return;
        }
        const getPhoto:Photo|undefined = await getConnection().createQueryBuilder()
            .select("photo")
            .from(Photo, "photo")
            .where("photo.cat = :cat", { cat: catId, isProfile: "Y" })
            .select(["photo.path"])
            .getOne();
        if (!getPhoto) {
            res.status(409).send("Cat and tag found, but photo not found");
            return;
        }
        res.status(200).send([getCat, follow, getTag, getPhoto]);
    } catch (e) {
        res.status(400).send(e);
    }
});


export default router;
