/* eslint-disable import/no-unresolved */
import express from "express";
import util from "util";
import {
    getConnection, UpdateResult,
} from "typeorm";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import smtpTransport from "nodemailer-smtp-transport";

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


router.post("/findpw", async (req:express.Request, res:express.Response) => {
    const { email } :{email:string} = req.body;

    const user:User|undefined = await getConnection()
        .createQueryBuilder()
        .select("user")
        .from(User, "user")
        .where("user.email = :email", { email })
        .getOne();

    if (!user) {
        res.status(401).send("invalid email");
        return;
    }

    const SecurityCode:string = Math.random().toString(36).slice(6);

    const transporter = nodemailer.createTransport(smtpTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        auth: {
            user: process.env.DEVMAIL,
            pass: process.env.DEVMAILPW,
        },
    }));

    // ! 메일 확인 작문좀...다시 해주시겠읍니까..ㅠㅠ
    const mailOptions = {
        from: "\"DediCats\" <dediCats16@gmail.com>",
        to: email,
        subject: "Email Verification for Dedicats",
        html: `
        <div style="text-align : center">
        <img style="display : inline" src="https://lh3.google.com/u/0/d/1TqLpc4xvwkUTeLrRASDc2Y0c4nme8t3g=w1870-h975-iv1"/>
        </div>
        <p>Annyung Haseyo! ${user.nickname}!</p>
        <p>Thanks for joining Dedicats! We really appreciate it. Please insert this code into email verfication to verify your account</p>
        <h1>Your code is  <br><span style="text-decoration:underline">${SecurityCode}<span></h1>
        <h2>This code will only be valid for 1hour.</h2>
        <p>if you have any problems, please contack us : dediCats16@gmail.com</p>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("Failed to send email");
            res.status(409).send("Failed to send email");
        } else {
            console.log(`Email sent: ${info.response}`);
            // res.status(201).send(signupCode);
        }
    });

    const pdkdf2Promise:Function = util.promisify(crypto.pbkdf2);
    const key:Buffer = await pdkdf2Promise(SecurityCode, user.salt, 105123, 64, "sha512");
    const encryPassword:string = key.toString("base64");

    const result:UpdateResult = await getConnection().createQueryBuilder()
        .update(User).set({ password: encryPassword })
        .where({ id: user.id })
        .execute();
    if (result.raw.changedRows) {
        res.status(201).send("password successfully changed");
        return;
    }
    res.status(409).send("Failed to change user password");
});

export default router;
