import jwt from "jsonwebtoken";
import User from "model/entity/User";

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
}, accessKey, { expiresIn: "1d" });

const generateRefeshToken = (id:number):string => jwt.sign({ id }, refresKey, { expiresIn: "30d" });

export {
    getUserIdbyAccessToken, getUserIdbyRefreshToken, generateAccessToken, generateRefeshToken,
};
