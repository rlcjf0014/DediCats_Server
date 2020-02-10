import jwt from "jsonwebtoken";
import { getConnection } from "typeorm";
import User from "./data/entity/User";

export const createTokens = async (user:User, secret:any, secret2:any) => {
    const createToken = jwt.sign(
        { user: { id: user.id, email: user.email, nickname: user.nickname } },
        secret,
        { expiresIn: "1d" },
    );

    const createRefreshToken = jwt.sign(
        { user: { id: user.id } },
        secret2,
        { expiresIn: "30d" },
    );

    return Promise.all([createToken, createRefreshToken]);
};

export const refreshTokens:Function = async (token:string, refreshToken:string, models:any, SECRET:string, SECRET_2:string) => {
    let userId = -1;
    try {
        const { user: { id } }:any = jwt.decode(refreshToken);
        userId = id;
    } catch (err) {
        return {};
    }

    if (!userId) return {};

    const user:User|undefined = await getConnection()
        .createQueryBuilder()
        .select("user")
        .from(User, "user")
        .where("user.id = :id", { userId })
        .getOne();

    if (!user) return {};

    const refreshSecret = SECRET_2 + user.password;

    try {
        jwt.verify(refreshToken, refreshSecret);
    } catch (err) {
        return {};
    }

    const [newToken, newRefreshToken] = await createTokens(user, SECRET, refreshSecret);
    return {
        token: newToken,
        refreshToken: newRefreshToken,
        user,
    };
};

/*
export const tryLogin = async (email:string, password:string, models:any, SECRET:string, SECRET_2:string) => {
    const user = await models.User.findOne({ where: { email }, raw: true });
    if (!user) throw new Error("Invalid login");


    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error("Invalid login");


    const [token, refreshToken] = await createTokens(user, SECRET, SECRET_2 + user.password);

    return {
        token,
        refreshToken,
    };
};
*/