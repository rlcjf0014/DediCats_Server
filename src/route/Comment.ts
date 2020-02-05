import express from "express";
import { InsertResult, getConnection, getManager } from "typeorm";
import { raw } from "body-parser";
import Comment from "../data/entity/Comment";
import Post from "../data/entity/Post";
import User from "../data/entity/User";

const router:express.Router = express.Router();

// New Comment of Post
router.post("/new", (req:express.Request, res:express.Response) => {
    const {
        catId, postId, userId, content,
    }:{catId:number, postId:number, userId:number, content:string} = req.body;
    /*
        redirect가 나을것같은데
    */
});

// Comment of Post
router.get("/:catId/:postId", (req:express.Request, res:express.Response) => {
    const { catId }:{catId?: string} = req.params;
    const { postId }:{postId?: string} = req.params;
    /*
[
{
  "userNickname": "김대연",
  "commentId": 1,
  "content" : "졸귀탱~~~",
  "userPhoto": binary Data,
  "createdAt": 시
}
...
]
    */
});


// delete Comment
router.post("/delete", (req:express.Request, res:express.Response) => {
    const { userId, postId }:{userId:number, postId:number} = req.body;
    /*
{"deleteStatus": "Y", "message": "Successfully deleted post"}
    */
});

// Add Comment
router.post("/add", async (req:express.Request, res:express.Response) => {
    try {
        const { content, userId, postId }:{content:string, userId:number, postId:number} = req.body;
        const user:User|undefined = await getManager().createQueryBuilder(User, "user").where("user.id = :id", { id: userId }).getOne();
        const post:Post|undefined = await getManager().createQueryBuilder(Post, "post").where("post.id = :id", { id: postId }).getOne();

        const result:InsertResult = await getConnection().createQueryBuilder().insert().into(Comment)
            .values({
                post, user, content, status: "Y",
            })
            .execute();

        if (result.raw.affectedRows) {
            res.status(201).send("{'message' : 'Adding comment was successful'}");
            return;
        }

        res.status(409).send("{'message' : 'Adding comment has failed'}");
    } catch (e) {
        res.status(500).send(e);
    }
});

export default router;
