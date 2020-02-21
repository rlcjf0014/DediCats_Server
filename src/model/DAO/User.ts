/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import {
    UpdateResult, getConnection, getRepository, InsertResult,
} from "typeorm";
import User from "../entity/User";
import { UserStatus } from "../../types/index";

const getUserById = async (id:number):Promise<User|undefined> => {
    const user:User|undefined = await getConnection().createQueryBuilder()
        .select("user")
        .from(User, "user")
        .where("user.id = :id", { id })
        .getOne();

    return user;
};

const updateUserPw = async (password:string, id:number):Promise<UpdateResult> => {
    const updateResult:UpdateResult = await getConnection().createQueryBuilder()
        .update(User)
        .set({ password })
        .where({ id })
        .execute();

    return updateResult;
};

const getUserByEmail = async (email:string):Promise<User|undefined> => {
    const user:User|undefined = await getConnection().createQueryBuilder()
        .select("user")
        .from(User, "user")
        .where("user.email = :email", { email })
        .getOne();

    return user;
};

const updateToken = async (id:number, refreshToken:string|null):Promise<UpdateResult> => {
    const updateResult:UpdateResult = await getConnection().createQueryBuilder()
        .update(User).set({ refreshToken })
        .where({ id })
        .execute();

    return updateResult;
};

const getCatList = async (userId: number):Promise<Array<object>> => {
    const getCat1:Array<object> = await getRepository(User).createQueryBuilder("user")
        .where("user.id = :id", { id: userId })
        .leftJoinAndSelect("user.cats", "cat")
        .select(["user.id", "user.nickname", "user.photoPath", "user.createAt",
            "cat.id", "cat.description", "cat.address", "cat.nickname", "cat.species"])
        .leftJoinAndSelect("cat.photos", "photo", "photo.isProfile = :isProfile", { isProfile: "Y" })
        .select(["user.id", "user.nickname", "user.photoPath", "user.createAt",
            "cat.id", "cat.description", "cat.address", "cat.nickname", "cat.species",
            "photo.path"])
        .getMany();
    return getCat1;
};

const insertUser = async (nickname:string, email:string, password:string, salt:string):Promise<InsertResult> => {
    const result:InsertResult = await getConnection().createQueryBuilder().insert().into(User)
        .values({
            nickname, email, password, salt, status: UserStatus.Active,
        })
        .execute();

    return result;
};

export {
    getUserById, updateUserPw, getUserByEmail, updateToken, getCatList, insertUser,
};
