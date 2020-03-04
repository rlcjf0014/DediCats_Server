/* eslint-disable no-unused-vars */
import jwt from "jsonwebtoken";
import { User } from "../model";
import CustomError from "./Error/customError";

require("dotenv").config();

const accessKey:any = process.env.JWT_SECRET_ACCESS;
const refresKey:any = process.env.JWT_SECRET_REFRESH;

const getUserIdbyAccessToken = (authorization:string|undefined) => {
    const accessToken:string|undefined = authorization && authorization.split(" ")[1];
    if (!accessToken) throw new CustomError("Token is required", 401, "Fail to get accessToken in header");

    const decode:any = jwt.verify(accessToken, accessKey);
    const userId = decode.id;

    return userId;
};

const getUserIdbyRefreshToken = (refreshToken:string) => {
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
}, accessKey, { expiresIn: "1d" });

const generateRefeshToken = (id:number):string => jwt.sign({ id }, refresKey, { expiresIn: "90d" });

export {
    getUserIdbyAccessToken, getUserIdbyRefreshToken, generateAccessToken, generateRefeshToken,
};
