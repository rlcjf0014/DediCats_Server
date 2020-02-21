/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import {
    UpdateResult, getConnection, getRepository, InsertResult,
} from "typeorm";
import Comment from "../entity/Comment";
import { CommentStatus } from "../../types/index";

const getComments = async (postId:number, nthPage:number):Promise<Array<Comment>> => {
    const resultArr:Array<Comment> = await getRepository(Comment)
        .createQueryBuilder("comment")
        .where("comment.postId = :id AND comment.status = :status", { id: postId, status: CommentStatus.Active })
        .leftJoinAndSelect("comment.user", "commentUser")
        .select(["comment", "commentUser.id", "commentUser.nickname", "commentUser.Id", "commentUser.nickname", "commentUser.photoPath"])
        .orderBy("nthPage.id", "DESC")
        .skip(nthPage)
        .take(10)
        .getMany();
    return resultArr;
};

const deleteComment = async (commentId:number):Promise<UpdateResult> => {
    const result:UpdateResult = await getConnection().createQueryBuilder()
        .update(Comment)
        .set({ status: CommentStatus.Deleted })
        .where({ id: commentId })
        .execute();

    return result;
};

const insertComment = async (postId:number, userId:number, content:string):Promise<InsertResult> => {
    const result:InsertResult = await getConnection().createQueryBuilder().insert().into("comment")
        .values({
            post: postId, user: userId, content, status: CommentStatus.Active,
        })
        .execute();
    return result;
};

const getComment = async (commentId:number):Promise<object|undefined> => {
    const comment:object|undefined = await getConnection()
        .createQueryBuilder()
        .select("comment")
        .from(Comment, "comment")
        .where("comment.id = :id AND comment.status = :status", { id: commentId, status: CommentStatus.Active })
        .leftJoinAndSelect("comment.user", "commentUser")
        .select(["comment", "commentUser.id", "commentUser.nickname", "commentUser.photoPath"])
        .getOne();

    return comment;
};

const updateComment = async (commentId:number, userId:number, content:string):Promise<UpdateResult> => {
    const result:UpdateResult = await getConnection()
        .createQueryBuilder()
        .update(Comment)
        .set({ content })
        .where({ id: commentId, userId })
        .execute();
    return result;
};
export {
    getComments, deleteComment, insertComment, getComment, updateComment,
};
