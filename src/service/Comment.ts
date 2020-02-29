/* eslint-disable no-unused-vars */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
/* eslint-disable max-len */
import { UpdateResult, InsertResult, getCustomRepository } from "typeorm";
import Comment from "../model/entity/Comment";
import CommentRepository from "../model/DAO/Comment";

const commentRepository = getCustomRepository(CommentRepository);


const getComments = (postId:number, nthPage:number):Promise<Array<Comment>> => commentRepository.getComments(postId, nthPage);
const deleteComment = (commentId:number):Promise<UpdateResult> => commentRepository.deleteComment(commentId);
const insertComment = (postId:number, userId:number, content:string):Promise<InsertResult> => commentRepository.insertComment(postId, userId, content);
const getComment = (commentId:number):Promise<object|undefined> => commentRepository.getComment(commentId);
const updateComment = (commentId:number, userId:number, content:string):Promise<UpdateResult> => commentRepository.updateComment(commentId, userId, content);

export {
    getComments, deleteComment, insertComment, getComment, updateComment,
};
