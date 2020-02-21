import express from "express";
import {
    getConnection, UpdateResult, getRepository, QueryBuilder, InsertResult,
} from "typeorm";

import { getUserIdbyAccessToken } from "../library/jwt";

import User from "../model/entity/User";
import Photo from "../model/entity/Photo";
import uploadFile from "../library/ImageFunction/imgupload";
import deleteFile from "../library/ImageFunction/imgdelete";

import * as PhotoService from "../Service/Photo";
import * as UserService from "../Service/User";

const router:express.Router = express.Router();

router.get("/album/:catId", async (req:express.Request, res:express.Response) => {
    const { catId }:{catId?: string} = req.params;
    try {
        const getPhoto:Array<object> = await PhotoService.getCatAlbum(catId);
        if (!getPhoto) {
            res.status(409).send("Photo not found");
        }
        res.status(200).send(getPhoto);
    } catch (e) {
        res.status(400).send(e);
    }
});

router.post("/profile/delete", async (req: express.Request, res:express.Response) => {
    // const { userId }:{userId:number} = req.body;
    const { accessToken }:{accessToken:string} = req.signedCookies;

    try {
        const userId = getUserIdbyAccessToken(accessToken);

        const updatePic:UpdateResult = await PhotoService.deleteProfile(userId);
        if (updatePic.raw.changedRows === 0) {
            res.status(409).send("Failed to delete profile picture");
            return;
        }
        await deleteFile(`USER #${userId}`);
        res.status(201).send("Successfully deleted profile picture");
    } catch (e) {
        res.status(400).send(e);
    }
});

//! S3에 데이터 저장 후 그 주소를 받아와 데이터베이스에 저장 및 클라이언트에 보내줘야 함.
router.post("/profile", async (req:express.Request, res:express.Response) => {
    const { photoPath }:{ photoPath:string} = req.body;
    const { accessToken }:{accessToken:string} = req.signedCookies;
    try {
        const userId = getUserIdbyAccessToken(accessToken);

        const getProfile:User | undefined = await UserService.getUserById(userId);
        if (!getProfile) {
            res.status(409).send("Failed to update profile picture");
            return;
        }
        if (getProfile?.photoPath === null) {
            const key = `USER #${userId}`;
            const imagepath:string|boolean = await uploadFile(key, photoPath);
            if (typeof (imagepath) === "boolean") {
                res.status(409).send("Failed to update profile picture");
                return;
            }
            const updatePic:UpdateResult = await PhotoService.updateProfile(userId, imagepath);
            if (updatePic.raw.changedRows === 0) {
                res.status(409).send("Failed to update profile picture");
                return;
            }
            res.status(201).send({ photoPath: imagepath });
        } else {
            const check:boolean|unknown = await deleteFile(`USER #${userId}`);
            if (!check) {
                res.status(409).send("Failed to update profile picture");
                return;
            }
            const key = `USER #${userId}`;
            const imagepath:string|boolean = await uploadFile(key, photoPath);
            if (typeof (imagepath) === "boolean") {
                res.status(409).send("Failed to update profile picture");
                return;
            }
            const updatePic:UpdateResult = await PhotoService.updateProfile(userId, imagepath);
            if (updatePic.raw.changedRows === 0) {
                res.status(409).send("Failed to update profile picture");
                return;
            }
            res.status(201).send({ photoPath: imagepath });
        }
    } catch (e) {
        res.status(400).send(e);
    }
});

export default router;
