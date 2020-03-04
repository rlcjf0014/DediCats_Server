/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
import express from "express";
import { UpdateResult, InsertResult } from "typeorm";
import { User } from "../model";
import { UserService } from "../service";
import {
    getUserIdbyRefreshToken, generateAccessToken, generateRefeshToken, getUserIdbyAccessToken,
} from "../library/jwt";
import { getEncryPw, getRandomByte } from "../library/crypto";
import { helper } from "../library/Error/errorHelper";
import sendMail from "../library/email";
import CustomError from "../library/Error/customError";


require("dotenv").config();


const signin = helper(async (req:express.Request, res:express.Response) => {
    const { email, password }:{email:string, password:string} = req.body;
    if (!email || !password) throw new CustomError("Body Parameters Exception", 409, "Email and Password both required");

    const user:User|undefined = await UserService.getUserByEmail(email);
    if (!user) return res.status(401).send("Invalid Email");

    // ? 암호화 후 비교
    const encryPassword:string = await getEncryPw(password, user.salt);
    if (encryPassword !== user.password) return res.status(401).send("Incorrect Password.");

    // ! 토큰 발급 및 업데이트
    const refreshToken = generateRefeshToken(user.id);
    const result:UpdateResult = await UserService.updateToken(user.id, refreshToken);
    if (result.raw.affectedRows === 0) throw new CustomError("DAO_Exception", 409, "Failed to insert Token");

    return res.status(201).send({ refreshToken });
});

const signout = helper(async (req:express.Request, res:express.Response) => {
    const { refreshToken } = req.body;
    const userId:number = getUserIdbyRefreshToken(refreshToken);
    const result:UpdateResult = await UserService.updateToken(userId, "");

    if (result.raw.affectedRows === 0) throw new CustomError("DAO_Exception", 201, "Failed to delete token but signout!");

    return res.status(201).send("Signout Success!");
});

const token = helper(async (req:express.Request, res:express.Response, next:express.NextFunction) => {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).send("logout");

    const userId:number = getUserIdbyRefreshToken(refreshToken);
    const user:User|undefined = await UserService.getUserById(userId);

    // ? 요청받은 refreshToken과 다른경우
    if (!user?.refreshToken || user?.refreshToken !== refreshToken) throw new CustomError("JWT_Exception", 401, "Invalid Request Token");

    const accessToken = generateAccessToken(user);

    const {
        id, nickname, photoPath, createAt, email,
    } = user;
    return res.status(200).json({
        accessToken,
        user: {
            id, nickname, photoPath, createAt, email,
        },
    });
});

const changepw = helper(async (req:express.Request, res:express.Response) => {
    const { password, newPassword }:{password:string, newPassword:string } = req.body;
    const { authorization } = req.headers;
    const userId = getUserIdbyAccessToken(authorization);

    const user:User|undefined = await UserService.getUserById(userId);
    if (!user) throw new CustomError("DAO_Exception", 401, "Fail to get User");

    // ? 암호화 후 비교
    const encryPassword:string = await getEncryPw(password, user.salt);
    if (encryPassword !== user.password) {
        res.status(402).send("Incorrect Password.");
        return;
    }
    // ? 새로운 Password 암호화
    const encryNewPassword:string = await getEncryPw(newPassword, user.salt);
    const result:UpdateResult = await UserService.updateUserPw(encryNewPassword, userId);

    if (result.raw.changedRows) {
        res.status(201).send("password successfully changed");
        return;
    }
    throw new CustomError("DAO_Exception", 409, "Failed to change user password");
});

const sendemail = helper(async (req:express.Request, res:express.Response) => {
    const { nickname, email } = req.body;
    // ! 유저 체크
    const checkEmail:User|undefined = await UserService.getUserByEmail(email);
    if (checkEmail) {
        res.status(401).send("User already exists.");
        return;
    }

    const secretCode = await sendMail(nickname, email, "signIn");
    res.status(201).send(secretCode);
});

const findpw = helper(async (req:express.Request, res:express.Response) => {
    const { email } :{email:string} = req.body;

    const user:User|undefined = await UserService.getUserByEmail(email);

    if (!user) {
        res.status(401).send("invalid email");
        return;
    }
    const secretCode:string = await sendMail(user.nickname, email, "pwInitialization");
    const encryPassword:string = await getEncryPw(secretCode, user.salt);
    const result:UpdateResult = await UserService.updateUserPw(encryPassword, user.id);

    if (result.raw.changedRows) {
        res.status(201).send("password successfully changed");
        return;
    }
    res.status(409).send("Failed to change user password");
});

const signup = helper(async (req:express.Request, res:express.Response) => {
    const { email, password, nickname }:{email:string, password:string, nickname:string} = req.body;
    // ! 유저 체크
    const checkEmail:User|undefined = await UserService.getUserByEmail(email);

    if (checkEmail) {
        res.status(409).send("User already exists.");
        return;
    }
    // ! 암호화부분
    const salt:string = await getRandomByte();
    const encryPassword:string = await getEncryPw(password, salt);

    // ! insert
    const result:InsertResult = await UserService.insertUser(nickname, email, encryPassword, salt);

    if (result.raw.affectedRows) {
        res.status(201).json({ userId: result.identifiers[0].id, email, nickname });
        return;
    }
    res.status(409).send("User creation failed");
});


export {
    signin,
    signout,
    token,
    changepw,
    sendemail,
    findpw,
    signup,
};
