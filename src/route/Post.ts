/* eslint-disable no-unused-vars */
import express from "express";
import { InsertResult, UpdateResult, DeleteResult } from "typeorm";
import { getUserIdbyAccessToken } from "../library/jwt";
import uploadFile from "../library/ImageFunction/imgupload";
import { PostService, PhotoService } from "../service";
import { helper } from "../library/errorHelper";

const router:express.Router = express.Router();

const postRouter = (io:any) => {
// Add Post
    router.post("/new", helper(async (req:express.Request, res:express.Response) => {
        const {
            catId, content, photoPath,
        }:{catId:number, content:string, photoPath: string | undefined} = req.body;
        const { accessToken }:{accessToken:string} = req.signedCookies;

        const userId = getUserIdbyAccessToken(accessToken);

        const addPost:InsertResult = await PostService.insertPost(userId, catId, content);
        if (addPost.raw.affectedRows === 0) {
            res.status(409).send("Failed to save post");
        }
        // result.identifiers[0].id
        if (photoPath === undefined) {
            res.status(201).send("Successfully added post");
            return;
        }
        const postId = addPost.identifiers[0].id;
        const key:string = `POST #${postId}`;
        const imagepath:string|boolean = await uploadFile(key, photoPath);
        if (typeof (imagepath) === "boolean") {
            res.status(409).send("Saved post, but failed to upload image");
            return;
        }
        const addPhoto:InsertResult = await PhotoService.addPostPhoto(imagepath, catId, postId);
        if (addPhoto.raw.affectedRows === 0) {
            const deletePost:DeleteResult = await PostService.deletePost(postId);
            if (deletePost.raw.affectedRows === 0) {
                res.status(400).send({
                    message: "Failed to delete post without posted picture, contact admin",
                    failpostId: postId,
                });
                return;
            }
            res.status(409).send("Failed to save post");
            return;
        }
        res.status(201).send("Successfully added post");
    //! 사진 데이터를 S3에 저장 후 그 주소를 데이터베이스 저장해야 함. 그 이후에 클라이언트가 요청할 시 주소를 보내줘야 함.
    }));

    // at Post Refresh button
    router.get("/:catId/:pagination", helper(async (req:express.Request, res:express.Response) => {
        const { catId, pagination }:{ catId?: string, pagination?:string} = req.params;
        const catIdNumber:number = Number(catId);
        const paginationNumber:number = Number(pagination);

        const nthPage = paginationNumber * 10;
        const post:Array<object> = await PostService.getPosts(catIdNumber, nthPage);
        const count:number = await PostService.getPostsCount(catIdNumber);
        const maxcount = Math.floor(count / 10) + 1;
        if (!post) {
            res.status(409).send("Failed to get post");
            return;
        }
        res.status(200).send({ post, maxcount });
    }));

    // update Post
    router.post("/update", helper(async (req:express.Request, res:express.Response) => {
        const { content, postId }:{content:string, postId:number} = req.body;
        const updatePost:UpdateResult = await PostService.updatePost(postId, content);
        if (updatePost.raw.changedRows === 0) {
            res.status(409).send("Failed to update post");
            return;
        }
        res.status(201).json({ postId, content });
    }));

    // ? Disconnect User from Post

    router.get("/disconnect", helper(async (req:express.Request, res:express.Response) => {
        // eslint-disable-next-line camelcase
        const { socket_id } = req.query;
        io.to(socket_id).emit("drop", "");
        res.status(200).send("Successfully disconnected socket");
    }));

    // delete Post
    router.post("/delete", helper(async (req:express.Request, res:express.Response) => {
        const { postId }:{postId:number} = req.body;
        const deletePost:UpdateResult = await PostService.updateState(postId);
        if (deletePost.raw.changedRows === 0) {
            res.status(409).send("Failed to delete post");
            return;
        }
        const deletePhoto:UpdateResult = await PhotoService.deletePostPhoto(postId);
        if (deletePhoto.raw.changedRows === 0) {
            res.status(409).send("Deleted post, but failed to delete post photo");
            return;
        }
        io.to(postId).emit("drop", "");
        res.status(201).send("Successfully deleted post");
    }));
    return router;
};

export default postRouter;
