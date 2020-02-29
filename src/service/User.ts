/* eslint-disable no-unused-vars */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
/* eslint-disable max-len */
import { UpdateResult, InsertResult, getCustomRepository } from "typeorm";
import User from "../model/entity/User";
import UserRepository from "../model/DAO/User";

const userRepository = getCustomRepository(UserRepository);

const getUserById = (id:number):Promise<User|undefined> => userRepository.getUserById(id);
const updateUserPw = (password:string, id:number) :Promise<UpdateResult> => userRepository.updateUserPw(password, id);
const getUserByEmail = (email:string):Promise<User|undefined> => userRepository.getUserByEmail(email);
const updateToken = (id:number, refreshToken:string|null):Promise<UpdateResult> => userRepository.updateToken(id, refreshToken);
const getCatList = (userId:number):Promise<Array<object>> => userRepository.getCatList(userId);
const insertUser = (nickname:string, email:string, password:string, salt:string):Promise<InsertResult> => userRepository.insertUser(nickname, email, password, salt);

export {
    getUserById, updateUserPw, getUserByEmail, updateToken, getCatList, insertUser,
};
