import express from "express";
import * as CommentController from "../controller/Comment";


const commentRouter = (io:any) => {
    const router:express.Router = express.Router();


    router.get("/:postId/:pagination", CommentController.comments);


    // delete CommentCommentService
    router.post("/delete", CommentController.deleteComment);

    // Add Comment
    router.post("/add", CommentController.addComment(io));

    router.post("/update", CommentController.updateComment);
    return router;
};


export default commentRouter;
