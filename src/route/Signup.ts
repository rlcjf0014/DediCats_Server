/* eslint-disable no-unused-vars */
/* eslint-disable import/no-unresolved */
import express from "express";
import { InsertResult, UpdateResult } from "typeorm";
import { User } from "../model";
import { UserService } from "../service";
import { getEncryPw, getRandomByte } from "../library/crypto";
import sendMail from "../library/email";
import { helper } from "../library/errorHelper";

require("dotenv").config();

const router:express.Router = express.Router();

router.post("/email", helper(async (req:express.Request, res:express.Response) => {
    const { nickname, email } = req.body;
    // ! 유저 체크
    const checkEmail:User|undefined = await UserService.getUserByEmail(email);
    if (checkEmail) {
        res.status(401).send("User already exists.");
        return;
    }

    const secretCode = await sendMail(nickname, email, "signIn");
    res.status(201).send(secretCode);
}));

router.post("/findpw", helper(async (req:express.Request, res:express.Response) => {
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
}));

router.post("/", helper(async (req:express.Request, res:express.Response) => {
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
}));

export default router;
