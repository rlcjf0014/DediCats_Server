/* eslint-disable no-unused-vars */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
/* eslint-disable max-len */
import { UpdateResult, InsertResult } from "typeorm";
import User from "../model/entity/User";
import * as UserDAO from "../model/DAO/User";

const getUserById = (id:number):Promise<User|undefined> => UserDAO.getUserById(id);
const updateUserPw = (password:string, id:number) :Promise<UpdateResult> => UserDAO.updateUserPw(password, id);
const getUserByEmail = (email:string):Promise<User|undefined> => UserDAO.getUserByEmail(email);
const updateToken = (id:number, refreshToken:string|null):Promise<UpdateResult> => UserDAO.updateToken(id, refreshToken);
const getCatList = (userId:number):Promise<Array<object>> => UserDAO.getCatList(userId);
const insertUser = (nickname:string, email:string, password:string, salt:string):Promise<InsertResult> => UserDAO.insertUser(nickname, email, password, salt);

export {
    getUserById, updateUserPw, getUserByEmail, updateToken, getCatList, insertUser,
};
