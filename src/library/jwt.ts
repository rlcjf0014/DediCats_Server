/* eslint-disable no-unused-vars */
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { User } from "../model";
import { UserService } from "../service";


require("dotenv").config();

const accessKey:any = process.env.JWT_SECRET_ACCESS;
const refresKey:any = process.env.JWT_SECRET_REFRESH;

const getUserIdbyAccessToken = (accessToken:string):number => {
    const decode:any = jwt.verify(accessToken, accessKey);
    const userId = decode.id;

    return userId;
};

const getUserIdbyRefreshToken = (refreshToken:string):number => {
    const decode:any = jwt.verify(refreshToken, refresKey);
    const userId = decode.id;

    return userId;
};

const generateAccessToken = (user:User):string => jwt.sign({
    id: user.id,
    nickname: user.nickname,
    email: user.email,
    createAt:
    user.createAt,
}, accessKey, { expiresIn: "20s" });

const generateRefeshToken = (id:number):string => jwt.sign({ id }, refresKey, { expiresIn: "60s" });

const reissueAccessToken = async (req:Request, res:Response, next:NextFunction) => {
    const { refreshToken } = req.signedCookies;
    let userId:number|undefined;
    try {
        userId = getUserIdbyRefreshToken(refreshToken);
    } catch (e) {
        next(e);
    }
    if (userId === undefined) return res.status(401).send("Invalid Request Token");
    const user:User|undefined = await UserService.getUserById(userId);

    if (!user?.refreshToken || user?.refreshToken !== refreshToken) return res.status(401).send("Invalid Request Token");
    const accessToken:any = generateAccessToken(user);
    res.cookie("accessToken", accessToken, { maxAge: 1000 * 60 * 60 * 24, signed: true });
    const {
        id, nickname, photoPath, createAt, email,
    } = user;
    return {
        accessToken,
        user: {
            id, nickname, photoPath, createAt, email,
        },
    };
};


export {
    getUserIdbyAccessToken, getUserIdbyRefreshToken, generateAccessToken, generateRefeshToken, reissueAccessToken,
};
