/* eslint-disable no-unused-vars */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
/* eslint-disable max-len */
import { UpdateResult } from "typeorm";
import User from "../model/entity/User";
import * as UserDAO from "../model/DAO/User";

const getUserById = (id:number):Promise<User|undefined> => UserDAO.getUserById(id);
const updateUserPw = (password:string, id:number) :Promise<UpdateResult> => UserDAO.updateUserPw(password, id);

export { getUserById, updateUserPw };
