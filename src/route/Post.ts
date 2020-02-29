import express from "express";
import * as PostRouter from "../controller/Post";


const postRouter = (io:any) => {
    const router:express.Router = express.Router();
    // Add Post
    router.post("/new", PostRouter.addpost);

    // at Post Refresh button
    router.get("/:catId/:pagination", PostRouter.postRefresh);

    // ? Disconnect User from Post

    router.get("/disconnect", PostRouter.disconnect(io));

    // delete Post
    router.post("/delete", PostRouter.deletepost(io));
    return router;
};


export default postRouter;
