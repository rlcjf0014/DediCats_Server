/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
import { UpdateResult, InsertResult, DeleteResult } from "typeorm";
import * as PostDAO from "../model/DAO/Post";

const insertPost = (userId:number, catId:number, content:string):Promise<InsertResult> => PostDAO.insertPost(userId, catId, content);
const deletePost = (postId:number):Promise<DeleteResult> => PostDAO.deletePost(postId);
const updatePost = (postId:number, content:string) : Promise<UpdateResult> => PostDAO.updatePost(postId, content);
const updateState = (postId:number): Promise<UpdateResult> => PostDAO.updateState(postId);
const getPosts = (catId:number, nthPage:number):Promise<Array<object>> => PostDAO.getPosts(catId, nthPage);
const getPostsCount = (catId:number):Promise<number> => PostDAO.getPostsCount(catId);

export {
    insertPost, deletePost, updatePost, updateState, getPosts, getPostsCount,
};
