import express from "express";
import {
    InsertResult, getConnection, getManager, UpdateResult, getRepository,
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
        const result:UpdateResult = await getConnection().createQueryBuilder().update(Comment).set({ content })
            .where({ id: commentId })
            .execute();
        if (!result.raw.changedRows) {
            res.status(400).send("{'message' : 'Fail to updating comment'}");
        }

        const returnObj:object|undefined = await getRepository(Comment)
            .createQueryBuilder("comment")
            .where("comment.id = :id AND comment.status = :status", { id: commentId, status: "Y" })
            .leftJoinAndSelect("comment.user", "commentUser")
            .select(["comment", "commentUser.id", "commentUser.nickname", "commentUser.photo_path"])
            .getOne();

        if (returnObj) {
            res.status(201).send(returnObj);
            return;
        }

        res.status(500).send("comment 정보를 불러오는데 실패하였습니다.");
    } catch (e) {
        console.log(e);
        res.status(500).send("Error in update Comment");
    }
});

export default router;
