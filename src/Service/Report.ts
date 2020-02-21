import {
    InsertResult,
} from "typeorm";

import * as ReportDAO from "../model/DAO/Report";

const reportPost = (postId:number, userId:number, criminalId:number):Promise<InsertResult> => ReportDAO.reportPost(postId, userId, criminalId);
const reportCat = (catId:number, userId:number, criminalId:number):Promise<InsertResult> => ReportDAO.reportCat(catId, userId, criminalId);
const reportComment = (commentId:number, userId:number, criminalId:number):Promise<InsertResult> => ReportDAO.reportComment(commentId, userId, criminalId);

export {
    reportPost,
    reportCat,
    reportComment,
};
