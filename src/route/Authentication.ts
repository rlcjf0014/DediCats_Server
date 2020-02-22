/* eslint-disable no-unused-vars */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
import express from "express";
import { UpdateResult } from "typeorm";
import jwt from "jsonwebtoken";
import { User } from "../model";
import { UserService } from "../service";
import { getUserIdbyRefreshToken, generateAccessToken, generateRefeshToken } from "../library/jwt";
import { getEncryPw } from "../library/crypto";
import { helper } from "../library/errorHelper";

require("dotenv").config();

const router:express.Router = express.Router();


router.post("/signin", helper(async (req:express.Request, res:express.Response) => {
    const { email, password }:{email:string, password:string} = req.body;
    if (!email || !password) return res.status(409).send("Email and Password both required");


    const user:User|undefined = await UserService.getUserByEmail(email);
    if (!user) return res.status(401).send("Invalid Email");


    // ? 암호화 후 비교
    const encryPassword:string = await getEncryPw(password, user.salt);
    if (encryPassword !== user.password) return res.status(401).send("Incorrect Password.");

    // ! 토큰 발급 및 업데이트
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefeshToken(user.id);
    const result:UpdateResult = await UserService.updateToken(user.id, refreshToken);

    if (result.raw.affectedRows === 0) return res.status(409).send("Failed to insert Token");

    res.clearCookie("refreshToken");
    res.cookie("accessToken", accessToken, { maxAge: 1000 * 60 * 60 * 24, signed: true });
    res.cookie("refreshToken", refreshToken, { maxAge: 1000 * 60 * 60 * 24 * 100, signed: true });

    return res.status(201).send("success");
}));

router.post("/signout", helper(async (req:express.Request, res:express.Response) => {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    return res.status(201).send("Signout Success!");
}));

// ! requestToekn으로 accessToken새로 요청
router.post("/token", helper(async (req:express.Request, res:express.Response, next:express.NextFunction) => {
    const { refreshToken } = req.signedCookies;
    const userId:number = getUserIdbyRefreshToken(refreshToken);

    const user:User|undefined = await UserService.getUserById(userId);

    // ? 요청받은 refreshToken과 다른경우
    if (!user?.refreshToken || user?.refreshToken !== refreshToken) { return res.status(401).send("Invalid Request Token"); }

    const accessToken = generateAccessToken(user);
    res.cookie("accessToken", accessToken, { maxAge: 1000 * 60 * 60 * 24, signed: true });
    const {
        id, nickname, photoPath, createAt, email,
    } = user;

    return res.status(200).json({
        accessToken,
        user: {
            id, nickname, photoPath, createAt, email,
        },
    });
}));

export default router;
