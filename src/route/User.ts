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
        const accessKey:any = process.env.JWT_SECRET_ACCESS;
        const options:{expiresIn:number} = { expiresIn: 60 * 60 * 24 };
        const accessToken = jwt.sign(payload, accessKey, options);
        res.json({ accessToken });
    } catch (e) {
        console.log(e);
        res.status(400).send(e);
    }
});
function authenticationToken (req:express.Request, res:express.Response, next:NextFunction) {
    const authHeader = req.headers.authorization;
    const token:string|undefined = authHeader && authHeader.split(" ")[1];
    if (token === null) return res.sendStatus(401);
    const accessKey:any = process.env.JWT_SECRET_ACCESS;
    jwt.verify(token, accessKey, (err, user) => {
        if (err) return res.send(403);
        req.user = user;
        next();
    });
}
router.post("/signup", async (req:express.Request, res:express.Response) => {
    const { email, password, nickname }:{email:string, password:string, nickname:string} = req.body;
    try {
        // ! 유저 체크
        const checkEmail:number = await User.count({ where: { email } });
        if (checkEmail) {
            res.status(409).send("User already exists.");
            return;
        }
        // ! 암호화부분
        const randomBytesPromise:Function = util.promisify(crypto.randomBytes);
        const pdkdf2Promise:Function = util.promisify(crypto.pbkdf2);
        const buf:Buffer = await randomBytesPromise(64);
        const salt:string = buf.toString("base64");
        const key:Buffer = await pdkdf2Promise(password, salt, 105123, 64, "sha512");
        const encryPassword:string = key.toString("base64");
        // ! insert
        const result:InsertResult = await getConnection().createQueryBuilder().insert().into(User)
            .values({
                nickname, email, password: encryPassword, salt, status: "Y",
            })
            .execute();
        if (result.raw.affectedRows) {
            const returnmessage:object = { userId: result.identifiers[0].id, email, nickname };
            res.status(201).send(JSON.stringify(returnmessage));
            return;
        }
        res.status(409).send("User creation failed");
    } catch (e) {
        // eslint-disable-next-line no-console
        res.status(400).send(e);
    }
});
// ! 비밀번호 확인단계필요 ( 비밀번호 보안 필요함! )
router.patch("/changepw", async (req:express.Request, res:express.Response) => {
    try {
        const { userId, password, newPassword }:{userId:number, password:string, newPassword:string } = req.body;
        const result:UpdateResult = await getConnection().createQueryBuilder().update(User).set({ password: newPassword })
            .where({ id: userId })
            .execute();
        if (result.raw.changedRows) {
            res.status(201).send("password successfully changed");
            return;
        }
        res.status(409).send("Failed to change user password");
    } catch (e) {
        res.status(400).send(e);
    }
});
// Sign out
router.post("/signout", (req:express.Request, res:express.Response) => {
    const { userId }:{userId:number} = req.body;
    // response
    // {"message": "Successfully signed out!"}
});
export default router;
