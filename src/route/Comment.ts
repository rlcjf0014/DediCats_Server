import express from "express";
import {
    InsertResult, getConnection, getManager, UpdateResult, getRepository,
} from "typeorm";

import Comment from "../model/entity/Comment";
import Post from "../model/entity/Post";
import User from "../model/entity/User";
import { getUserIdbyAccessToken } from "../library/jwt";
import * as CommentService from "../Service/Comment";

const router:express.Router = express.Router();

const returnRouter = (io:any) => {
// Comment of Post
    router.get("/:postId/:pagination", async (req:express.Request, res:express.Response) => {
        const { postId, pagination }:{postId?: string, pagination?:string} = req.params;
        const postIdNumber:number = Number(postId);
        const paginationNumber:number = Number(pagination);

        const nthPage = paginationNumber * 10;
        try {
            const resultArr:Array<Comment> = await CommentService.getComments(postIdNumber, nthPage);
            res.status(200).send(resultArr);
        } catch (e) {
        // eslint-disable-next-line no-console
            console.log(e);
            res.status(400).send(e);
        }
    });


    // delete CommentCommentService
    router.post("/delete", async (req:express.Request, res:express.Response) => {
        const { commentId }:{commentId:number} = req.body;
        try {
            const result:UpdateResult = await CommentService.deleteComment(commentId);
            if (result.raw.changedRows === 1) {
                res.status(201).send({ deleteStatus: "Y", message: "Successfully deleted post" });
                return;
            }
            res.status(409).send("Failed to delete comment");
        } catch (e) {
        // eslint-disable-next-line no-console
            res.status(400).send(e);
        }
    });

    // Add Comment
    router.post("/add", async (req:express.Request, res:express.Response) => {
        const { content, postId }:{content:string, postId:number} = req.body;
        const { accessToken }:{accessToken:string} = req.signedCookies;
        try {
            const userId = getUserIdbyAccessToken(accessToken);
            const result:InsertResult = await CommentService.insertComment(postId, userId, content);

            if (result.raw.affectedRows) {
                const newComment:object|undefined = await CommentService.getComment(result.identifiers[0].id);

                io.to(postId).emit("new comment", newComment);
                res.status(201).send("Adding comment was successful");
                return;
            }

            res.status(409).send("Failed to add comment");
        } catch (e) {
        // eslint-disable-next-line no-console
            console.log(e);
            res.status(400).send(e);
        }
    });

    router.post("/update", async (req:express.Request, res:express.Response) => {
        const { commentId, content } : { commentId:number, content:string} = req.body;
        const { accessToken }:{accessToken:string} = req.signedCookies;
        try {
            const userId = getUserIdbyAccessToken(accessToken);
            const result:UpdateResult = await CommentService.updateComment(commentId, userId, content);
            if (!result.raw.changedRows) {
                res.status(409).send("Failed to update comment");
            }

            const returnObj:object|undefined = await CommentService.getComment(commentId);

            if (returnObj) {
                res.status(201).send(returnObj);
                //! io.to().emit("updated comments", returnObj); 업데이트는 기존의 것을 수정하기 때문에 소켓으로 보내면 순서가 망가질수도 있음.
                return;
            }

            res.status(409).send("Update succeeded, but failed to retrieve comment information.");
        } catch (e) {
        // eslint-disable-next-line no-console
            console.log(e);
            res.status(400).send(e);
        }
    });
    return router;
};

export default returnRouter;
