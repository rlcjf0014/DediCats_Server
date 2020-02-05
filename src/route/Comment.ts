import express from "express";
import {
    InsertResult, getConnection, getManager, UpdateResult,
} from "typeorm";
import Comment from "../data/entity/Comment";
import Post from "../data/entity/Post";
import User from "../data/entity/User";

const router:express.Router = express.Router();

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

router.post("/update", async (req:express.Request, res:express.Response) => {
    try {
        const { userId, commentId, content } : {userId:number, commentId:number, content:string} = req.body;
        const reuslt:UpdateResult = await getConnection().createQueryBuilder().update(Comment).set({ content })
            .where({ id: commentId })
            .execute();

        if (reuslt.raw.affectedRows) {
            res.status(201).send(" { message: 'update success' }");
            return;
        }
    } catch (e) {
        console.log(e);
        res.status(500).send("Error in update Comment");
    }
});

export default router;
