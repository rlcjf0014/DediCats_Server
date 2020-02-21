/* eslint-disable no-unused-vars */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
/* eslint-disable max-len */
import { UpdateResult, InsertResult } from "typeorm";
import Comment from "../model/entity/Comment";
import * as CommentDAO from "../model/DAO/Comment";


const getComments = (postId:number, nthPage:number):Promise<Array<Comment>> => CommentDAO.getComments(postId, nthPage);
const deleteComment = (commentId:number):Promise<UpdateResult> => CommentDAO.deleteComment(commentId);
const insertComment = (postId:number, userId:number, content:string):Promise<InsertResult> => CommentDAO.insertComment(postId, userId, content);
const getComment = (commentId:number):Promise<object|undefined> => CommentDAO.getComment(commentId);
const updateComment = (commentId:number, userId:number, content:string):Promise<UpdateResult> => CommentDAO.updateComment(commentId, userId, content);

export {
    getComments, deleteComment, insertComment, getComment, updateComment,
};
