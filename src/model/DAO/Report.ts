/* eslint-disable no-unused-vars */
import {
    InsertResult, getConnection,
} from "typeorm";

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
