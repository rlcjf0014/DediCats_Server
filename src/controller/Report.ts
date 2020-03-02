/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
import express from "express";
import { InsertResult } from "typeorm";
import { getUserIdbyAccessToken } from "../library/jwt";
import { ReportService } from "../service";
import { helper } from "../library/Error/errorHelper";
import CustomError from "../library/Error/customError";

const report = helper(async (req:express.Request, res:express.Response) => {
    const {
        commentId, postId, catId, criminalId,
    }:{commentId:(number|undefined), postId:(number|undefined), catId:(number|undefined), criminalId:number} = req.body;
    const { accessToken }:{accessToken:string} = req.signedCookies;

    const userId = getUserIdbyAccessToken(accessToken);
    if (postId) {
        const reportPost:InsertResult = await ReportService.reportPost(postId, userId, criminalId);
        if (reportPost.raw.affectedRows === 0) throw new CustomError("DAO_Exception", 409, "Failed to report post");

        res.status(201).send("Successfully reported post");
    }

    if (catId) {
        const reportCat:InsertResult = await ReportService.reportCat(catId, userId, criminalId);
        if (reportCat.raw.affectedRows === 0) throw new CustomError("DAO_Exception", 409, "Failed to report cat");

        res.status(201).send("Successfully reported cat");
    }
    if (commentId) {
        const reportComment:InsertResult = await ReportService.reportComment(commentId, userId, criminalId);
        if (reportComment.raw.affectedRows === 0) throw new CustomError("DAO_Exception", 409, "Failed to report comment");

        res.status(201).send("Successfully reported comment");
    }
});

export default report;
