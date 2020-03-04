/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
import express from "express";
import { UpdateResult } from "typeorm";
import { getUserIdbyAccessToken } from "../library/jwt";
import { User } from "../model";
import { PhotoService, UserService } from "../service";
import uploadFile from "../library/ImageFunction/imgupload";
import deleteFile from "../library/ImageFunction/imgdelete";
import { helper } from "../library/Error/errorHelper";
import CustomError from "../library/Error/customError";


const catAlbum = helper(async (req:express.Request, res:express.Response) => {
    const { catId }:{catId?: string} = req.params;
    const getPhoto:Array<object> = await PhotoService.getCatAlbum(catId);
    if (!getPhoto) throw new CustomError("Body Parameters Exception", 409, "Photo not found");

    res.status(200).send(getPhoto);
});

const deleteProfile = helper(async (req: express.Request, res:express.Response) => {
    const { authorization } = req.headers;
    const userId = getUserIdbyAccessToken(authorization);

    const updatePic:UpdateResult = await PhotoService.deleteProfile(userId);
    if (updatePic.raw.changedRows === 0) throw new CustomError("DAO_Exception", 409, "Failed to delete profile picture");

    const findkey:User|undefined = await UserService.getUserById(userId);
    if (!findkey?.photoName || !findkey) throw new CustomError("DAO_Exception", 409, "Failed to update profile picture");

    const check:boolean|unknown = await deleteFile(findkey.photoName);
    if (check === false) throw new CustomError("S3_Exception", 409, "Failed to delete picture from image bucket");

    res.status(201).send("Successfully deleted profile picture");
});

const profilePic = helper(async (req:express.Request, res:express.Response) => {
    const { photoPath }:{ photoPath:string} = req.body;
    const { authorization } = req.headers;
    const userId = getUserIdbyAccessToken(authorization);

    const getProfile:User | undefined = await UserService.getUserById(userId);
    if (!getProfile) throw new CustomError("DAO_Exception", 409, "Failed to update profile picture");

    if (getProfile?.photoPath === null) {
        const secretCode = Math.random().toString(36).slice(4);
        const photoName = secretCode + userId;
        const imagepath:string|boolean = await uploadFile(photoName, photoPath);
        if (typeof (imagepath) === "boolean") throw new CustomError("S3_Exception", 409, "Failed to update profile picture");

        const updatePic:UpdateResult = await PhotoService.updateProfile(userId, imagepath, photoName);
        if (updatePic.raw.changedRows === 0) throw new CustomError("DAO_Exception", 409, "Failed to update profile picture");

        res.status(201).send({ photoPath: imagepath });
    } else {
        const findkey:User|undefined = await UserService.getUserById(userId);
        if (!findkey?.photoName || !findkey) throw new CustomError("DAO_Exception", 409, "Failed to update profile picture");

        const check:boolean|unknown = await deleteFile(findkey.photoName);
        if (!check) throw new CustomError("DAO_Exception", 409, "Failed to update profile picture");

        const secretCode = Math.random().toString(36).slice(4);
        const photoName = secretCode + userId;
        const imagepath:string|boolean = await uploadFile(photoName, photoPath);
        if (typeof (imagepath) === "boolean") throw new CustomError("DAO_Exception", 409, "Failed to update profile picture");

        const updatePic:UpdateResult = await PhotoService.updateProfile(userId, imagepath, photoName);
        if (updatePic.raw.changedRows === 0) throw new CustomError("DAO_Exception", 409, "Failed to update profile picture");

        res.status(201).send({ photoPath: imagepath });
    }
});

//! S3에 데이터 저장 후 그 주소를 받아와 데이터베이스에 저장 및 클라이언트에 보내줘야 함.


export {
    profilePic,
    deleteProfile,
    catAlbum,
};
