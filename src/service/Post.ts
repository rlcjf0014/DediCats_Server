/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
import { UpdateResult, InsertResult, DeleteResult, getCustomRepository } from "typeorm";
import { NextFunction, Request, Response } from "express";
import PostRepository from "../model/DAO/Post";

const postRepository = getCustomRepository(PostRepository);

const insertPost = (userId:number, catId:number, content:string):Promise<InsertResult> => postRepository.insertPost(userId, catId, content);
const deletePost = (postId:number):Promise<DeleteResult> => postRepository.deletePost(postId);
const updatePost = (postId:number, content:string) : Promise<UpdateResult> => postRepository.updatePost(postId, content);
const updateState = (postId:number): Promise<UpdateResult> => postRepository.updateState(postId);
const getPosts = (catId:number, nthPage:number):Promise<Array<object>> => postRepository.getPosts(catId, nthPage);
const getPostsCount = (next:NextFunction, catId:number):Promise<number> => postRepository.getPostsCount(catId);

export {
    insertPost, deletePost, updatePost, updateState, getPosts, getPostsCount,
};
