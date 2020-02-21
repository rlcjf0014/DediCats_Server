/* eslint-disable max-len */
import { UpdateResult, InsertResult, DeleteResult } from "typeorm";
import Post from "../model/entity/Post";
import * as PostDAO from "../model/DAO/Post";

const insertPost = (userId:number, catId:number, content:string):Promise<InsertResult> => PostDAO.insertPost(userId, catId, content);
const deletePost = (postId:number):Promise<DeleteResult> => PostDAO.deletePost(postId);
const updatePost = (postId:number, content:string) : Promise<UpdateResult> => PostDAO.updatePost(postId, content);
const updateState = (postId:number): Promise<UpdateResult> => PostDAO.updateState(postId);

export {
    insertPost, deletePost, updatePost, updateState,
};
