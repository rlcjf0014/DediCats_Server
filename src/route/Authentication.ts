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
    if (!email || !password) {
        res.status(409).send("Email and Password both required");
        return;
    }

    const user:User|undefined = await UserService.getUserByEmail(email);
    // ! 유효하지 않은 이메일
    if (!user) {
        res.status(401).send("Invalid Email");
        return;
    }

    // ? 암호화 후 비교
    const encryPassword:string = await getEncryPw(password, user.salt);
    if (encryPassword !== user.password) {
        res.status(401).send("Incorrect Password.");
        return;
    }
    // ! 토큰 발급 및 업데이트
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefeshToken(user.id);
    const result:UpdateResult = await UserService.updateToken(user.id, refreshToken);

    if (result.raw.affectedRows === 0) {
        res.status(409).send("Failed to insert Token");
        return;
    }

    // * token을 어디에 저장할것인가? -> cookie
    res.clearCookie("refreshToken");
    res.cookie("accessToken", accessToken, { maxAge: 1000 * 60 * 60 * 24, signed: true });
    res.cookie("refreshToken", refreshToken, { maxAge: 1000 * 60 * 60 * 24 * 30, signed: true });

    res.status(201).send("success");
}));

// ! 로그인 이외부분 refresh Token만료 먼저 확인 -> 만료시 DB : refreshToken을 지움
router.post("/*", async (req:express.Request, res:express.Response, next:express.NextFunction) => {
    const { refreshToken } = req.signedCookies;
    console.log("들어왔어요~ 들렸다갑니다~");
    try {
        const refreshKey:any = process.env.JWT_SECRET_REFRESH;
        jwt.verify(refreshToken, refreshKey);
        next();
    } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e);
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        res.status(401).send("refreshToken is invalid");
    }
});

// ! requestToekn으로 accessToken새로 요청
router.post("/token", helper(async (req:express.Request, res:express.Response, next:express.NextFunction) => {
    console.log("토큰받으러 왔어요~");
    const { refreshToken } = req.signedCookies;
    const userId:number = getUserIdbyRefreshToken(refreshToken);

    const user:User|undefined = await UserService.getUserById(userId);

    // ? 요청받은 refreshToken과 다른경우
    if (!user?.refreshToken || user?.refreshToken !== refreshToken) return res.status(409).send("Invalid Request Token");

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

router.post("/signout", helper(async (req:express.Request, res:express.Response) => {
    const { refreshToken }:{refreshToken:string} = req.signedCookies;

    const userId = getUserIdbyRefreshToken(refreshToken);

    const user:User|undefined = await UserService.getUserById(userId);
    if (!user || !user.refreshToken) return res.status(401).send("Invalid Refresh Token");
    const userRefreshToken:string = user.refreshToken;
    if (userRefreshToken !== refreshToken) return res.status(401).send("Invalid Refresh Token");

    const updateRefreshToken:UpdateResult = await UserService.updateToken(userId, null);
    if (updateRefreshToken.raw.changedRows === 0) return res.status(400).send("Failed to delete Refresh Token");

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    return res.status(201).send("Signout Success!");
}));

export default router;
