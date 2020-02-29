/* eslint-disable class-methods-use-this */
/* eslint-disable no-unused-vars */
import {
    InsertResult, getConnection, EntityRepository, Repository,
} from "typeorm";
import { Report } from "..";

/*
const reportPost = async (postId:number, userId:number, criminalId:number):Promise<InsertResult> => {
    const reportpost:InsertResult = await getConnection().createQueryBuilder()
        .insert()
        .into("report")
        .values([
            {
                post: postId, user: userId, criminalId,
            },
        ])
        .execute();
    return reportpost;
};

const reportCat = async (catId:number, userId:number, criminalId:number):Promise<InsertResult> => {
    const reportcat:InsertResult = await getConnection().createQueryBuilder()
        .insert()
        .into("report")
        .values([
            {
                cat: catId, user: userId, criminalId,
            },
        ])
        .execute();
    return reportcat;
};

const reportComment = async (commentId:number, userId:number, criminalId:number):Promise<InsertResult> => {
    const reportcomment:InsertResult = await getConnection().createQueryBuilder()
        .insert()
        .into("report")
        .values([
            {
                comment: commentId, user: userId, criminalId,
            },
        ])
        .execute();
    return reportcomment;
};

export {
    reportPost,
    reportCat,
    reportComment,
};

*/

@EntityRepository()
export default class CatRepository extends Repository<Report> {
    reportPost(postId:number, userId:number, criminalId:number):Promise<InsertResult> {
        return getConnection()
            .createQueryBuilder()
            .insert()
            .into("report")
            .values([
                {
                    post: postId, user: userId, criminalId,
                },
            ])
            .execute();
    }

    reportCat(catId:number, userId:number, criminalId:number):Promise<InsertResult> {
        return getConnection()
            .createQueryBuilder()
            .insert()
            .into("report")
            .values([
                {
                    cat: catId, user: userId, criminalId,
                },
            ])
            .execute();
    }

    reportComment(commentId:number, userId:number, criminalId:number):Promise<InsertResult> {
        return getConnection().createQueryBuilder()
            .insert()
            .into("report")
            .values([
                {
                    comment: commentId, user: userId, criminalId,
                },
            ])
            .execute();
    }
}
