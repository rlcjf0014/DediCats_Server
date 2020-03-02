/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
/* eslint-disable no-await-in-loop */
import express from "express";
import {
    UpdateResult, InsertResult, DeleteResult,
} from "typeorm";
import wkx from "wkx";
import { Cat, Tag, Photo } from "../model";
import {
    CatService, CatTagService, PhotoService, UserService,
} from "../service";
import uploadFile from "../library/ImageFunction/imgupload";
import { getUserIdbyAccessToken } from "../library/jwt";
import { formatRainbow, formatCut } from "../library/formatCatOptions";
import { helper } from "../library/Error/errorHelper";
import CustomError from "../library/Error/customError";
import { getCatsBylocation } from "../service/Cat";


// delete tag
const deletetag = helper(async (req:express.Request, res:express.Response) => {
    const { tagId, catId }:{tagId:number, catId:number } = req.body;
    const { accessToken }:{accessToken:string} = req.signedCookies;
    const userId = getUserIdbyAccessToken(accessToken);

    const deleteTag:UpdateResult = await CatTagService.deleteTag(tagId, catId, userId);
    if (deleteTag.raw.changedRows === 0) throw new CustomError("DAO_Exception", 409, "Failed to delete tag");

    res.status(201).send("Successfully deleted tag");
});

// This endpoint updates the user's following information.
const follow = helper(async (req:express.Request, res:express.Response) => {
    const { catId }:{catId:number} = req.body;
    const { accessToken }:{accessToken:string} = req.signedCookies;
    const userId = getUserIdbyAccessToken(accessToken);

    const updateFollow:InsertResult = await CatService.insertFollow(catId, userId);
    if (updateFollow.raw.affectedRows === 0) throw new CustomError("DAO_Exception", 409, "Failed to follow this cat");

    res.status(201).send("User now follows this cat");
});


// update cat rainbow
const updateRainbow = helper(async (req:express.Request, res:express.Response) => {
    const { catId, rainbow }:{catId:number, rainbow:{Y:number, YDate:string|null, N:number, NDate:string|null}} = req.body;

    const selectedRainbow:Cat|undefined = await CatService.selectCat(catId);
    if (!selectedRainbow) {
        res.status(206).send("Cat ID does not exist.");
        return;
    }

    const strRainbow:string = formatRainbow(selectedRainbow, rainbow);

    const updateResult:UpdateResult = await CatService.updateCatRainbow(catId, strRainbow);

    if (updateResult.raw.changedRows) {
        const changedRainbow:Cat|undefined = await CatService.selectCat(catId);
        res.status(200).send({ rainbow: changedRainbow?.rainbow });
        return;
    }

    throw new CustomError("DAO_Exception", 409, "Could not update rainbow");
});

// Followers Tab
const follower = helper(async (req:express.Request, res:express.Response) => {
    const { catId }:{catId?: string} = req.params;
    const getFollower:Array<object> = await CatService.getCatFollower(catId);

    res.status(200).send(getFollower);
});

// Cat's Today Status
const addcatToday = helper(async (req:express.Request, res:express.Response) => {
    const { catId, catToday }:{catId:number, catToday:string} = req.body;
    const now = `${new Date().toISOString().slice(0, 23)}Z`;
    const updateToday:UpdateResult = await CatService.addCatToday(catId, catToday, now);

    if (updateToday.raw.changedRows === 0) throw new CustomError("DAO_Exception", 409, "Cat's today update failed");

    const result = { cat_today: catToday, cat_today_time: now };
    res.status(201).send(result);
});

// Catcut
const updatecut = helper(async (req:express.Request, res:express.Response) => {
    const { catId, catCut }:{catId:number, catCut:{Y:number, N:number, unknown:number}} = req.body;

    const selectedCut:Cat|undefined = await CatService.selectCat(catId);

    if (!selectedCut) {
        res.status(206).send("Cat ID does not exist.");
        return;
    }

    const objSelectedCut:string = formatCut(selectedCut, catCut);

    const updateCut:UpdateResult = await CatService.updateCatCut(catId, objSelectedCut);

    if (updateCut.raw.changedRows) {
        const updatedCat:Cat|undefined = await CatService.selectCat(catId);
        res.status(201).send({ cut: updatedCat?.cut });
        return;
    }

    throw new CustomError("DAO_Exception", 409, "Failed to update peanuts.");
});

// update Tag
const updatetag = helper(async (req:express.Request, res:express.Response) => {
    const { catId, catTag }:{catId:number, catTag:string } = req.body;
    const { accessToken }:{accessToken:string} = req.signedCookies;

    const userId = getUserIdbyAccessToken(accessToken);

    const checkTag:Tag|undefined = await CatTagService.checkTag(catTag);
    if (checkTag) {
        const updateTag:InsertResult = await CatTagService.updateTag(userId, catId, checkTag.id);

        if (updateTag.raw.affectedRows === 0) throw new CustomError("DAO_Exception", 409, "Tag update failed");

        const result = {
            id: checkTag.id,
            tag: {
                content: catTag,
            },
        };

        res.status(201).send(result);
    } else {
        const newTag:InsertResult = await CatTagService.newTag(catTag);
        const tagId:number = newTag.identifiers[0].id;
        const updateTag:InsertResult = await CatTagService.updateTag(userId, catId, tagId);

        if (updateTag.raw.affectedRows === 0 || newTag.raw.affectedRows === 0) {
            throw new CustomError("DAO_Exception", 409, "Tag update failed");
        }

        const result = {
            id: tagId,
            tag: {
                content: catTag,
            },
        };

        res.status(201).send(result);
    }
});

// Add Cat
//! new wkx.Point(1, 2).toWkt()
const addcat = helper(async (req:express.Request, res:express.Response) => {
    const {
        catNickname, location, address, catDescription, catSpecies, photoPath, cut,
    }:{ catNickname:string, location:{latitude:number, longitude:number}, address:string, catDescription:string,
        catSpecies:string, photoPath:string, cut:object, } = req.body;
    const { accessToken }:{accessToken:string} = req.signedCookies;

    const userId = getUserIdbyAccessToken(accessToken);
    const coordinate = new wkx.Point(location.latitude, location.longitude).toWkt();
    const addCat: InsertResult = await CatService.addCat(catNickname, coordinate, address, catDescription, catSpecies, userId, cut);

    if (addCat.raw.affectedRows === 0) throw new CustomError("DAO_Exception", 409, "Failed to add cat");

    const imagepath:string | boolean = await uploadFile(`CAT #${addCat.identifiers[0].id}`, photoPath);
    if (imagepath === false) {
        const deleteCat: DeleteResult = await CatService.deleteCat(addCat.identifiers[0].id);
        if (deleteCat.raw.affectedRows === 0) {
            throw new CustomError("DAO_Exception", 409, "Failed to delete cat without posted picture, contact admin");
        }
        throw new CustomError("DAO_Exception", 409, "Added cat, but failed to add its photo");
    }

    const addPhoto:InsertResult = await PhotoService.addCatPhoto(imagepath, addCat.identifiers[0].id);
    if (addPhoto.raw.affectedRows === 0) {
        const deleteCat: DeleteResult = await CatService.deleteCat(addCat.identifiers[0].id);
        if (deleteCat.raw.affectedRows === 0) {
            throw new CustomError("DAO_Exception", 409, "Failed to delete cat without posted picture, contact admin");
        }
        throw new CustomError("DAO_Exception", 409, "Added cat, but failed to add its photo");
    }

    res.status(201).send("Successfully added cat");
});

// Unfollow Cat
const unfollow = helper(async (req:express.Request, res:express.Response) => {
    const { catId }:{catId:number} = req.body;
    const { accessToken }:{accessToken:string} = req.signedCookies;
    const userId = getUserIdbyAccessToken(accessToken);

    const updateFollow:DeleteResult = await CatService.deleteFollow(catId, userId);
    if (updateFollow.raw.affectedRows === 0) throw new CustomError("DAO_Exception", 409, "Failed to unfollow cat");

    res.status(201).send("User unfollowed this cat");
});


// This endpoint allows you to get the list of cats you follow.
const catlist = helper(async (req:express.Request, res:express.Response) => {
    const { accessToken }:{accessToken:string} = req.signedCookies;
    const userId = getUserIdbyAccessToken(accessToken);

    const getCats:Array<object> = await UserService.getCatList(userId);
    if (!getCats) throw new CustomError("DAO_Exception", 409, "User's list not found");

    res.status(200).send(getCats);
});


// This endpoint provides you with the information of the selected cat.
// ? 캣 태그, 사진 같이 보내줘야 함.
const selectedCat = helper(async (req:express.Request, res:express.Response) => {
    const { catId }:{catId?: string } = req.params;
    const { accessToken }:{accessToken:string} = req.signedCookies;

    const userId = getUserIdbyAccessToken(accessToken);
    const getCat:Cat|undefined = await CatService.getCat(catId);

    if (!getCat) throw new CustomError("DAO_Exception", 409, "Cat not found");

    const checkFollow:Array<{count: string}> = await CatService.checkFollow(Number(catId), userId);
    const followcount:object = checkFollow[0].count === "1" ? { isFollowing: true } : { isFollowing: false };

    const getTag: Array<object> = await CatTagService.getTag(catId);
    if (!getTag) throw new CustomError("DAO_Exception", 409, "Cat found, but tag not found");

    const getPhoto:Photo|undefined = await PhotoService.getCatPhoto(catId);
    if (!getPhoto) throw new CustomError("DAO_Exception", 409, "Cat and tag found, but photo not found");

    res.status(200).send([getCat, followcount, getTag, getPhoto]);
});

const mapCats = helper(async (req:express.Request, res:express.Response, next:express.NextFunction) => {
    const { location } : {location:{ NElatitude : number, NElongitude : number, SWlatitude : number, SWlongitude : number }} = req.body;
    const { accessToken }:{accessToken:string} = req.signedCookies;
    const userId = getUserIdbyAccessToken(accessToken);
    const result:Array<object> = await getCatsBylocation(location, userId);
    res.status(200).send(result);
});


export {
    selectedCat,
    deletetag,
    follow,
    updateRainbow,
    follower,
    addcatToday,
    updatecut,
    updatetag,
    addcat,
    unfollow,
    catlist,
    mapCats,
};
