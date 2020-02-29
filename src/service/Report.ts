import { InsertResult, getCustomRepository } from "typeorm";

import ReportRepository from "../model/DAO/Report";

const reportRepository = getCustomRepository(ReportRepository);

const reportPost = (postId:number, userId:number, criminalId:number):Promise<InsertResult> => reportRepository.reportPost(postId, userId, criminalId);
const reportCat = (catId:number, userId:number, criminalId:number):Promise<InsertResult> => reportRepository.reportCat(catId, userId, criminalId);
const reportComment = (commentId:number, userId:number, criminalId:number):Promise<InsertResult> => reportRepository.reportComment(commentId, userId, criminalId);

export {
    reportPost,
    reportCat,
    reportComment,
};
