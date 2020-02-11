import express from "express";
import util from "util";
import {
    getConnection, UpdateResult,
} from "typeorm";
import crypto from "crypto";
import jwt from "jsonwebtoken";

import User from "../data/entity/User";

require("dotenv").config();

const router:express.Router = express.Router();
const refresKey:any = process.env.JWT_SECRET_REFRESH;

const generateAccessToken = (payload:{id:number, nickname:string, email:string}) => {
    const accessKey:any = process.env.JWT_SECRET_ACCESS;
    const options:{expiresIn:string} = { expiresIn: "1d" };
    return jwt.sign(payload, accessKey, options);
};


// ! requestToekn으로 accessToken새로 요청
router.post("/token", async (req:express.Request, res:express.Response) => {
    const { refreshToken } = req.signedCookies;

    if (!refreshToken) {
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        return res.status(401).send("Refresh Token does not exist");
    }

    // const refresKey:any = process.env.JWT_SECRET_REFRESH;
    const decodeReq:any = jwt.verify(refreshToken, refresKey);
    if (!decodeReq) {
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        return res.status(401).send("Refresh token has expired.");
    }

    const queryManager = getConnection().createQueryBuilder();
    const user:User|undefined = await queryManager
        .select("user")
        .from(User, "user")
        .where({ id: decodeReq.id })
        .getOne();

    // ? db에 refreshTokens가 없는경우
    if (!user?.refreshToken) return res.status(403).send("Refresh Token does not exist");
    // ? 요청받은 refreshToken과 다른경우
    if (user?.refreshToken !== refreshToken) return res.status(409).send("Invalid Request Token");

    jwt.verify(refreshToken, refresKey, (err:Error, decode:any):void => {
        if (err) {
            res.sendStatus(403);
            return;
        }
        if (decode) {
            const accessToken = generateAccessToken({ id: user.id, nickname: user.nickname, email: user.email });
            res.cookie("accessToken", accessToken, { maxAge: 1000 * 60 * 60 * 24, signed: true });
            res.status(200).json({ accessToken });
        } else {
            res.clearCookie("accessToken");
            res.clearCookie("refreshToken");
            res.status(401).send("The Requst Token has expired.");
        }
    });
});


router.post("/signin", async (req:express.Request, res:express.Response) => {
    const { email, password }:{email:string, password:string} = req.body;
    if (!email) {
        res.status(409).send("Email is required");
        return;
    }
    if (!password) {
        res.status(409).send("Password is required");
        return;
    }
    try {
        const user:User|undefined = await getConnection()
            .createQueryBuilder()
            .select("user")
            .from(User, "user")
            .where("user.email = :email", { email })
            .getOne();
        // ! 유효하지 않은 이메일
        if (!user) {
            res.status(401).send("Invalid Email");
            return;
        }

        // ? 암호화 후 비교
        const pdkdf2Promise:Function = util.promisify(crypto.pbkdf2);
        const key:Buffer = await pdkdf2Promise(password, user.salt, 105123, 64, "sha512");
        const encryPassword:string = key.toString("base64");
        if (encryPassword !== user.password) {
            res.status(401).send("Incorrect Password.");
            return;
        }
        // ! 토큰 발급
        const payload:{id:number, nickname:string, email:string} = {
            id: user.id,
            nickname: user.nickname,
            email: user.email,
        };

        // ? accessToken
        const accessToken = generateAccessToken(payload);

        // ? refresh Token
        // const refresKey:any = process.env.JWT_SECRET_REFRESH;
        const refreshToken = jwt.sign({ id: user.id }, refresKey, { expiresIn: "30d" });

        const result:UpdateResult = await getConnection().createQueryBuilder()
            .update(User).set({ refreshToken })
            .where({ id: user.id })
            .execute();

        if (result.raw.affectedRows === 0) {
            res.status(409).send("Failed to insert Token");
            return;
        }

        // * token을 어디에 저장할것인가?
        // * -> 일단 cookie
        res.clearCookie("refreshToken");
        res.cookie("accessToken", accessToken, { maxAge: 1000 * 60 * 60 * 24, signed: true });
        res.cookie("refreshToken", refreshToken, { maxAge: 1000 * 60 * 60 * 24 * 30, signed: true });

        res.status(201).send("User signed in");
    } catch (e) {
        console.log(e);
        res.status(400).send(e);
    }
});


router.post("/signout", async (req:express.Request, res:express.Response) => {
    const { refreshToken }:{refreshToken:string} = req.signedCookies;

    if (!refreshToken) return res.status(409).send("Refresh Token is not defined");

    const decode:any = jwt.verify(refreshToken, refresKey);
    if (!decode) return res.status(403).send("Refresh Token has already expired");

    const queryManager = getConnection().createQueryBuilder();
    const userRefreshToken:User|undefined = await queryManager
        .select("user.refreshToken")
        .from(User, "user")
        .where({ id: decode.id })
        .getOne();

    if (userRefreshToken?.refreshToken !== refreshToken) return res.status(401).send("Invalid Refresh Token");

    const updateRefreshToken:UpdateResult = await queryManager
        .update(User).set({ refreshToken: null })
        .where({ id: decode.id })
        .execute();

    if (updateRefreshToken.raw.changedRows === 0) return res.status(400).send("Failed to delete Refresh Token");

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.status(201).send("Signout Success!");
});

export default router;
