import express from "express";
import {
    InsertResult, getConnection, getManager, UpdateResult, getRepository,
} from "typeorm";
import Comment from "../data/entity/Comment";
import Post from "../data/entity/Post";
import User from "../data/entity/User";

const router:express.Router = express.Router();

// Comment of Post
router.get("/:postId", async (req:express.Request, res:express.Response) => {
    const { postId }:{postId?: string} = req.params;
    const postIdNumber:number = Number(postId);

    try {
        const resultArr:Array<object> = await getRepository(Comment)
            .createQueryBuilder("comment")
            .where("comment.postId = :id AND comment.status = :status", { id: postIdNumber, status: "Y" })
            .leftJoinAndSelect("comment.user", "commentUser")
            .select(["comment", "commentUser.id", "commentUser.nickname", "commentUser.Id", "commentUser.nickname", "commentUser.photoPath"])
            .getMany();

        res.status(200).send(resultArr);
    } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e);
        res.status(409).send("Failed to get comments.");
    }
});


// delete Comment
router.post("/delete", async (req:express.Request, res:express.Response) => {
    const { userId, commentId }:{userId:number, commentId:number} = req.body;
    try {
        const result:UpdateResult = await getConnection().createQueryBuilder()
            .update(Comment)
            .set({ status: "D" })
            .where({ id: commentId })
            .execute();

        if (result.raw.changedRows === 1) {
            res.status(200).send({ deleteStatus: "Y", message: "Successfully deleted post" });
            return;
        }
        res.status(404).send("Deleting comment has failed");
    } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e);
        res.status(409).send("There is an error while deleting the comment in the server.");
    }
});

// Add Comment
router.post("/add", async (req:express.Request, res:express.Response) => {
    const { content, userId, postId }:{content:string, userId:number, postId:number} = req.body;
    try {
        const manager = await getManager();
        const user:User|undefined = await manager.createQueryBuilder(User, "user").where("user.id = :id", { id: userId }).getOne();
        const post:Post|undefined = await manager.createQueryBuilder(Post, "post").where("post.id = :id", { id: postId }).getOne();

        const result:InsertResult = await getConnection().createQueryBuilder().insert().into(Comment)
            .values({
                post, user, content, status: "Y",
            })
            .execute();

        if (result.raw.affectedRows) {
            res.status(201).send("Adding comment was successful");
            return;
        }

        res.status(404).send("Adding comment has failed");
    } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e);
        res.status(409).send("There is an error while adding the comment in the server.");
    }
});

router.post("/update", async (req:express.Request, res:express.Response) => {
    try {
        const { userId, commentId, content } : {userId:number, commentId:number, content:string} = req.body;
        const result:UpdateResult = await getConnection().createQueryBuilder().update(Comment).set({ content })
            .where({ id: commentId })
            .execute();
        if (!result.raw.changedRows) {
            res.status(400).send("Fail to updating comment");
        }

        const returnObj:Comment|undefined = await getRepository(Comment)
            .createQueryBuilder("comment")
            .where("comment.id = :id AND comment.status = :status", { id: commentId, status: "Y" })
            .leftJoinAndSelect("comment.user", "commentUser")
            .select(["comment", "commentUser.id", "commentUser.nickname", "commentUser.photo_path"])
            .getOne();

        if (returnObj) {
            res.status(201).send(returnObj);
            return;
        }

        res.status(404).send("Update succeeded, but failed to retrieve comment information.");
    } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e);
        res.status(409).send("There is an error while updating the comments in the server.");
    }
});

export default router;
