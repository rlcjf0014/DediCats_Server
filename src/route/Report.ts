import express from "express";
import {
 InsertResult, 
} from "typeorm";
import { getUserIdbyAccessToken } from "../library/jwt";
import * as ReportService from "../Service/Report";

const router:express.Router = express.Router();

router.post("/", async (req:express.Request, res:express.Response) => {
    const {
        commentId, postId, catId, criminalId,
    }:{commentId:(number|undefined), postId:(number|undefined), catId:(number|undefined), criminalId:number} = req.body;
    const { accessToken }:{accessToken:string} = req.signedCookies;

    try {
        const userId = getUserIdbyAccessToken(accessToken);
        if (postId) {
            const reportPost:InsertResult = await ReportService.reportPost(postId, userId, criminalId);
            if (reportPost.raw.affectedRows === 0) {
                res.status(409).send("Failed to report post");
            }
            res.status(201).send("Successfully reported post");
        }
        if (catId) {
            const reportCat:InsertResult = await ReportService.reportCat(catId, userId, criminalId);
            if (reportCat.raw.affectedRows === 0) {
                res.status(409).send("Failed to report cat");
            }
            res.status(201).send("Successfully reported cat");
        }
        if (commentId) {
            const reportComment:InsertResult = await ReportService.reportComment(commentId, userId, criminalId);
            if (reportComment.raw.affectedRows === 0) {
                res.status(409).send("Failed to report comment");
            }
            res.status(201).send("Successfully reported comment");
        }
    } catch (e) {
        res.status(400).send(e);
    }
});

export default router;
