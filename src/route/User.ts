/* eslint-disable import/no-unresolved */
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
            res.status(402).send("Incorrect Password.");
            return;
        }

        const newkey:Buffer = await pdkdf2Promise(newPassword, user.salt, 105123, 64, "sha512");
        const encryNewPassword:string = newkey.toString("base64");


        const result:UpdateResult = await queryBuilder
            .update(User).set({ password: encryNewPassword })
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


export default router;
