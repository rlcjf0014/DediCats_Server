/* eslint-disable import/no-unresolved */
import express from "express";
import util from "util";
import {
    getConnection, InsertResult,
} from "typeorm";
import crypto from "crypto";
import nodemailer from "nodemailer";
import smtpTransport from "nodemailer-smtp-transport";

import User from "../data/entity/User";

require("dotenv").config();

const router:express.Router = express.Router();

router.post("/email", async (req:express.Request, res:express.Response) => {
    const { nickname, email } = req.body;

    // ! 유저 체크
    const checkEmail:number = await User.count({ where: { email } });
    if (checkEmail) {
        res.status(401).send("User already exists.");
        return;
    }

    const signupCode = Math.random().toString(36).slice(2);

    const transporter = nodemailer.createTransport(smtpTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        auth: {
            user: process.env.DEVMAIL,
            pass: process.env.DEVMAILPW,
        },
    }));

    const mailOptions = {
        from: "\"DediCats\" <dediCats16@gmail.com>",
        to: email,
        subject: "Email Verification for Dedicats",
        html: `
        <div style="text-align : center">
        <img style="display : inline" src="https://lh3.google.com/u/0/d/1TqLpc4xvwkUTeLrRASDc2Y0c4nme8t3g=w1870-h975-iv1"/>
        </div>
        <p>Annyung Haseyo! ${nickname}!</p>
        <p>Thanks for joining Dedicats! We really appreciate it. Please insert this code into email verfication to verify your account</p>
        <h1>Your code is  <br><span style="text-decoration:underline">${signupCode}<span></h1>
        <h2>This code will only be valid for 1hour.</h2>
        <p>if you have any problems, please contack us : dediCats16@gmail.com</p>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("Failed to send email");
            res.status(409).send("Failed to send email");
        } else {
            console.log(`Email sent: ${info.response}`);
            // res.cookie("signupCode", signupCode, { maxAge: 1000 * 60 * 10, signed: true });
            res.status(201).send(signupCode);
        }
    });
});

router.post("", async (req:express.Request, res:express.Response) => {
    const { email, password, nickname }:{email:string, password:string, nickname:string} = req.body;
    // console.log(email, password, nickname);
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

export default router;
