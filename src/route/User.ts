import express from "express";
import util from "util";
import {
    getConnection, InsertResult, UpdateResult,
} from "typeorm";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import User from "../data/entity/User";

require("dotenv").config();

const router:express.Router = express.Router();

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
    const { password, newPassword }:{password:string, newPassword:string } = req.body;
    const { accessToken }:{accessToken:string} = req.signedCookies;
    const accessKey:any = process.env.JWT_SECRET_ACCESS;
    try {
        const decode:any = jwt.verify(accessToken, accessKey);
        const userId = decode.id;

        const queryBuilder = getConnection().createQueryBuilder();

        const user:User|undefined = await queryBuilder
            .select("user")
            .from(User, "user")
            .where("user.id = :id", { id: userId })
            .getOne();

        if (!user) {
            res.status(401).send("Fail to get User");
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

        const result:UpdateResult = await queryBuilder
            .update(User).set({ password: newPassword })
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

export default router;
