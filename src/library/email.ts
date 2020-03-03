/* eslint-disable no-console */
import nodemailer from "nodemailer";
import smtpTransport from "nodemailer-smtp-transport";

const makeHtml = (nickname:string, secretCode:string, option:string):string => {
    if (option === "signIn") {
        return `
        <div style="text-align : center">
        <img style="display : inline" src="https://dedicatsimage.s3.ap-northeast-2.amazonaws.com/email+image.png"/>
        </div>
        <p style="font-size: large">Annyung Haseyo! ${nickname}!</p>
        <p style="font-size: medium">Thanks for joining Dedicats! We really appreciate it. Please insert this code into email verfication to verify your account</p>
        <h1>Your code is  <br><span style="text-decoration:underline">${secretCode}<span></h1>
        <h2>This code will only be valid for 1 hour.</h2>
        <p style="font-size: 0.9rem">if you have any problems, please contact us : dediCats16@gmail.com</p>`;
    }
    // (option === "pwInitialization")
    return `
        <div style="text-align : center">
        <img style="display : inline" src="https://dedicatsimage.s3.ap-northeast-2.amazonaws.com/email+image.png"/>
        </div>
        <p style="font-size: large">Annyung Haseyo! ${nickname}!</p>
        <p style="font-size: medium">Thanks for using Dedicats! We really appreciate it. Please insert this temporary password to log in and reset your password. Make sure to change your temporary password in MyPage! </p>
        <h1>Your code is  <br><span style="text-decoration:underline">${secretCode}<span></h1>
        <h2>This code will only be valid for 1 hour.</h2>
        <p style="font-size: 0.9rem">if you have any problems, please contact us: dediCats16@gmail.com</p>`;
};

const sendMail = async (nickname:string, email:string, option:string):Promise<string> => {
    const secretCode = Math.random().toString(36).slice(6);

    const transporter = nodemailer.createTransport(smtpTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        auth: {
            user: process.env.DEVMAIL,
            pass: process.env.DEVMAILPW,
        },
    }));

    const html:string = makeHtml(nickname, secretCode, option);
    const mailOptions = {
        from: "\"DediCats\" <dediCats16@gmail.com>",
        to: email,
        subject: "Email Verification for Dedicats",
        html,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("Failed to send email");
            throw error;
        }
        console.log(`Email sent: ${info.response}`);
    });

    return secretCode;
};

export default sendMail;
