/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import express, { NextFunction } from "express";
import util from "util";
import {
    getConnection, InsertResult, UpdateResult,
} from "typeorm";
import crypto from "crypto";
import jwt from "jsonwebtoken";

import User from "../data/entity/User";

require("dotenv").config();

const router:express.Router = express.Router();


function generateAccessToken(user:{id: number, nickname:string, email:string}) {
    const accessKey:any = process.env.JWT_SECRET_ACCESS;
    return jwt.sign(user, accessKey, { expiresIn: "15s" });
}
router.post("/signin", async (req:express.Request, res:express.Response) => {
    const { email, password }:{email:string, password:string} = req.body;
    if (!email) {
        res.status(409).send("email is required!");
        return;
    }
    if (!password) {
        res.status(409).send("password is required!");
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
            res.status(409).send("Invalid Email");
            return;
        }
        // ? 암호화 후 비교
        const pdkdf2Promise:Function = util.promisify(crypto.pbkdf2);
        const key:Buffer = await pdkdf2Promise(password, user.salt, 105123, 64, "sha512");
        const encryPassword:string = key.toString("base64");
        if (encryPassword !== user.password) {
            res.status(409).send("Incorrect password.");
            return;
        }
        // ! 토큰 발급
        const payload:{id:number, nickname:string, email:string} = {
            id: user.id,
            nickname: user.nickname,
            email: user.email,
        };
        // const accessKey:any = process.env.JWT_SECRET_ACCESS;
        const refreshKey:any = process.env.JWT_SECRET_REFRESH;
        // const options:{expiresIn:number} = { expiresIn: 60 * 60 * 24 };
        const accessToken:string = generateAccessToken(payload);
        const refreshToken:string = jwt.sign(payload, refreshKey); 
        res.json({ accessToken, refreshToken });
    } catch (e) {
        console.log(e);
        res.status(400).send(e);
    }
});


// function authenticateToken (req:express.Request, res:express.Response, next:NextFunction) {
//     const authHeader = req.headers.authorization;
//     const token:any = authHeader && authHeader.split(" ")[1];
//     if (token === null) return res.sendStatus(401);
//     const accessKey:any = process.env.JWT_SECRET_ACCESS;
//     // eslint-disable-next-line consistent-return
//     jwt.verify(token, accessKey, (err:Error, user:any) => {
//         if (err) return res.send(403);
//         req.user = user;
//         next();
//     });
// }

// ! 비밀번호 확인단계필요 ( 비밀번호 보안 필요함! )
router.post("/signout", (req:express.Request, res:express.Response) => {
    const { userId }:{userId:number} = req.body;
    // response
    // {"message": "Successfully signed out!"}
});
export default router;
