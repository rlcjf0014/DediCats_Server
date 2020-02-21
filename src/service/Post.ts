/* eslint-disable max-len */
import { UpdateResult, InsertResult, DeleteResult } from "typeorm";
import * as PostDAO from "../model/DAO/Post";

const insertPost = (userId:number, catId:number, content:string):Promise<InsertResult> => PostDAO.insertPost(userId, catId, content);
const deletePost = (postId:number):Promise<DeleteResult> => PostDAO.deletePost(postId);
const updatePost = (postId:number, content:string) : Promise<UpdateResult> => PostDAO.updatePost(postId, content);
const updateState = (postId:number): Promise<UpdateResult> => PostDAO.updateState(postId);
const getPosts = async (catId:number, nthPage:number):Promise<Array<object>> => PostDAO.getPosts(catId, nthPage);

export {
    insertPost, deletePost, updatePost, updateState, getPosts,
};
