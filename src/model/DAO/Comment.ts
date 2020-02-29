/* eslint-disable class-methods-use-this */
/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import {
    UpdateResult, getConnection, getRepository, InsertResult, EntityRepository, Repository,
} from "typeorm";
import { Comment } from "..";
import { CommentStatus } from "../../types/index";

@EntityRepository()
export default class CommentRespository extends Repository<Comment> {
    getComments(postId:number, nthPage:number):Promise<Array<Comment>> {
        return this.createQueryBuilder("comment")
            .where("comment.postId = :id AND comment.status = :status", { id: postId, status: CommentStatus.Active })
            .leftJoinAndSelect("comment.user", "commentUser")
            .select(["comment", "commentUser.id", "commentUser.nickname", "commentUser.Id", "commentUser.nickname", "commentUser.photoPath"])
            .orderBy("comment.id", "DESC")
            .skip(nthPage)
            .take(10)
            .getMany();
    }

    deleteComment(commentId:number):Promise<UpdateResult> {
        return getConnection().createQueryBuilder()
            .update(Comment)
            .set({ status: CommentStatus.Deleted })
            .where({ id: commentId })
            .execute();
    }

    insertComment(postId:number, userId:number, content:string):Promise<InsertResult> {
        return getConnection().createQueryBuilder().insert().into("comment")
            .values({
                post: postId, user: userId, content, status: CommentStatus.Active,
            })
            .execute();
    }

    getComment(commentId:number):Promise<object|undefined> {
        return this
            .createQueryBuilder("comment")
            .where("comment.id = :id AND comment.status = :status", { id: commentId, status: CommentStatus.Active })
            .leftJoinAndSelect("comment.user", "commentUser")
            .select(["comment", "commentUser.id", "commentUser.nickname", "commentUser.photoPath"])
            .getOne();
    }

    updateComment(commentId:number, userId:number, content:string):Promise<UpdateResult> {
        return getConnection()
            .createQueryBuilder()
            .update(Comment)
            .set({ content })
            .where({ id: commentId, userId })
            .execute();
    }
}
