/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import express from "express";
import {
    getRepository, getConnection, InsertResult, QueryBuilder, UpdateResult,
} from "typeorm";
import jwt from "jsonwebtoken";

import Post from "../data/entity/Post";
import uploadFile from "../ImageFunction/imgupload";
import deleteFile from "../ImageFunction/imgdelete";
// import storage from "../data/storage";

const router:express.Router = express.Router();

// Add Post
router.post("/new", async (req:express.Request, res:express.Response) => {
    const {
        catId, content, photoPath,
    }:{catId:number, content:string, photoPath: string | undefined} = req.body;
    const accessKey:any = process.env.JWT_SECRET_ACCESS;
    const { accessToken }:{accessToken:string} = req.signedCookies;
    try {
        const decode:any = jwt.verify(accessToken, accessKey);
        const userId = decode.id;

        const createConnection:QueryBuilder<any> = await getConnection().createQueryBuilder();
        const addPost:InsertResult = await createConnection
            .insert()
            .into("post")
            .values([
                {
                    user: userId, cat: catId, content, status: "Y",
                },
            ])
            .execute();
        if (addPost.raw.affectedRows === 0) {
            res.status(409).send("Failed to save post");
        }
        // result.identifiers[0].id
        if (photoPath === undefined) {
            res.status(201).send("Successfully added post");
            return;
        }
        const key:string = `POST #${addPost.identifiers[0].id}`;
        const imagepath:any = await uploadFile(key, photoPath);
        const addPhoto:InsertResult = await createConnection
            .insert()
            .into("photo")
            .values([
                {
                    path: imagepath, status: "Y", cat: catId, post: addPost.identifiers[0].id,
                },
            ])
            .execute();
        if (addPhoto.raw.affectedRows === 0) {
            const deletePost:DeleteResult = await getConnection()
                .createQueryBuilder()
                .delete()
                .from("post")
                .where({ id: addPost.identifiers[0].id })
                .execute();
            if (deletePost.raw.affectedRows === 0) {
                res.status(400).send({
                    message: "Failed to delete post without posted picture, contact admin",
                    failpostId: addPost.identifiers[0].id,
                });
                return;
            }
            res.status(409).send("Failed to save post");
            return;
        }
        res.status(201).send("Successfully added post");
    } catch (e) {
        res.status(400).send(e);
    }

    //! 사진 데이터를 S3에 저장 후 그 주소를 데이터베이스 저장해야 함. 그 이후에 클라이언트가 요청할 시 주소를 보내줘야 함.
});

// at Post Refresh button
router.get("/:catId", async (req:express.Request, res:express.Response) => {
    const { catId }:{ catId?: string} = req.params;
    try {
        const post:Array<object> = await getRepository(Post)
            .createQueryBuilder("post")
            .where("post.cat = :cat AND post.status = :status", { cat: catId, status: "Y" })
            .leftJoinAndSelect("post.user", "perry")
            .select(["post", "perry.id", "perry.nickname", "perry.photoPath"])
            .leftJoinAndSelect("post.photos", "joshua", "joshua.status = :status", { status: "Y" })
            .select(["post.id", "post.content", "perry.id", "perry.nickname", "perry.photoPath", "joshua.path", "joshua.id"])
            .orderBy("post.id", "ASC")
            .getMany();
        if (!post) {
            res.status(409).send("Failed to get post");
            return;
        }
        res.status(200).send(post);
    } catch (e) {
        res.status(400).send(e);
    }
});

// update Post
router.post("/update", async (req:express.Request, res:express.Response) => {
    const { content, postId }:{content:string, postId:number} = req.body;
    try {
        const updatePost:UpdateResult = await getConnection().createQueryBuilder()
            .update(Post).set({ content })
            .where("post.id= :id", { id: postId })
            .execute();
        if (updatePost.raw.changedRows === 0) {
            res.status(409).send("Failed to update post");
            return;
        }
        const result = { postId, content };
        res.status(201).send(result);
    } catch (e) {
        res.status(400).send(e);
    }
});

// delete Post
router.post("/delete", async (req:express.Request, res:express.Response) => {
    const { postId }:{postId:number} = req.body;
    try {
        const deletePost:UpdateResult = await getConnection().createQueryBuilder()
            .update(Post).set({ status: "N" })
            .where("post.id= :id", { id: postId })
            .execute();
        const result:any = await deleteFile(`POST #${postId}`);

        if (deletePost.raw.changedRows === 0) {
            res.status(409).send("Failed to delete post");
            return;
        }
        res.status(201).send("Successfully deleted post");
    } catch (e) {
        res.status(400).send(e);
    }
});

export default router;
