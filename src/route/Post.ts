/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import express from "express";
import { getRepository, getConnection, InsertResult } from "typeorm";
import Post from "../data/entity/Post";

// import storage from "../data/storage";

const router:express.Router = express.Router();

// Add Post
router.post("/new", async (req:express.Request, res:express.Response) => {

    const {
        userId1, catId1, content, photoPath,
    }:{userId1:number, catId1:number, content:string, photoPath:string} = req.body;

    try {
        const addPost:InsertResult = await getConnection()
            .createQueryBuilder()
            .insert()
            .into("post")
            .values([
                {
                    userId: userId1, catId: catId1, content, status: "Y",
                },
            ])
            .execute();
        if (!addPost) {
            res.status(404).send("오류로 인해 포스트가 실패했습니다");
        }
        // result.identifiers[0].id
        if (!photoPath) {
            res.status(200).send("Successfully added post");
            return;
        }
        const addPhoto:InsertResult = await getConnection()
            .createQueryBuilder()
            .insert()
            .into("photo")
            .values([
                { path: photoPath, status: "Y", postId: addPost.identifiers[0].id },
            ])
            .execute();
        if (!addPhoto) {
            res.status(404).send("오류로 인해 사진 저장에 실패했습니다");
            return;
        }
        res.status(200).send("Successfully added post");
    } catch (e) {
        res.status(404).send(e);
    }

    //! 사진 데이터를 S3에 저장 후 그 주소를 데이터베이스 저장해야 함. 그 이후에 클라이언트가 요청할 시 주소를 보내줘야 함.
});

// at Post Refresh button
router.get("/:catId", async (req:express.Request, res:express.Response) => {
    const { catId }:{ catId?: string} = req.params;
    try {
        const post:any = await getRepository(Post)
            .createQueryBuilder("post")
            .where("post.cat = :cat AND post.status = :status", { cat: catId, status: "Y" })
            .leftJoinAndSelect("post.user", "perry")
            .select(["post", "perry.id", "perry.nickname", "perry.photoPath"])
            .leftJoinAndSelect("post.photos", "joshua")
            .select(["post", "perry.id", "perry.nickname", "perry.photoPath", "joshua.path", "joshua.id"])
            .getMany();
        if (!post) {
            res.status(404).send("오류로 인해 포스트 불러오기가 실패했습니다. 유감.");
            return;
        }
        res.status(200).send(post);
    } catch (e) {
        res.status(404).send(e);
    }
});

// update Post
router.post("/update", async (req:express.Request, res:express.Response) => {
    const { content, postId }:{content:string, postId:number} = req.body;
    try {
        const updatePost:any = await getConnection().createQueryBuilder()
            .update(Post).set({ content })
            .where("post.id= :id", { id: postId })
            .execute();
        if (!updatePost) {
            res.status(404).send("오류로 인해 포스트 업데이트가 실패했습니다. 유감.");
            return;
        }

        res.status(200).send("successfully updated post");
    } catch (e) {
        res.status(404).send(e);
    }
});

// delete Post
router.post("/delete", async (req:express.Request, res:express.Response) => {
    const { postId }:{postId:number} = req.body;
    try {
        const deletePost = await getConnection().createQueryBuilder()
            .update(Post).set({ status: "N" })
            .where("post.id= :id", { id: postId })
            .execute();
        if (!deletePost) {
            res.status(404).send("오류로 인해 포스트 삭제가 실패했습니다. 유감.");
            return;
        }
        res.status(200).send("successfully deleted post");
    } catch (e) {
        res.status(404).send(e);
    }
});

export default router;
