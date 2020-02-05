/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import express from "express";
import { getRepository, getConnection } from "typeorm";
import Post from "../data/entity/Post";
import Photo from "../data/entity/Photo";
import User from "../data/entity/User";
import Cat from "../data/entity/Cat";
// import storage from "../data/storage";

const router:express.Router = express.Router();

// Add Post
router.post("/new", async (req:express.Request, res:express.Response) => {
    const {
        userId, catId, content, photoPath,
    }:{userId:number, catId:number, content:string, photoPath:string} = req.body;

    let post:Post;
    try {
        const newPost:Post = new Post();
        const user:User|undefined = await User.findOne({ where: { id: userId } });
        const cat:Cat|undefined = await Cat.findOne({ where: { id: catId } });

        if (!user || !cat) {
            res.status(500).send("serverError aboud find user of cat");
            return;
        }

        newPost.user = user;
        newPost.cat = cat;
        newPost.content = content;
        newPost.status = "Y";
        post = await Post.save(newPost);
        if (!post) {
            res.status(404).send("오류로 인해 포스트 저장이 실패했습니다. 유감.");
            return;
        }
    } catch (e) {
        res.status(404).send(e);
        return;
    }
    //! 사진 데이터를 S3에 저장 후 그 주소를 데이터베이스 저장해야 함. 그 이후에 클라이언트가 요청할 시 주소를 보내줘야 함.
    if (photoPath) {
        try {
            const newPhoto = new Photo();
            newPhoto.path = photoPath;
            newPhoto.post = [post];
            newPhoto.status = "Y";
            await Photo.save(newPhoto);
            res.status(200).send("{message: Adding post was successful}");
        } catch (e) {
            res.status(404).send(e);
        }
    } else {
        res.status(200).send("{message: Adding post was successful}");
    }
});

// at Post Refresh button
router.get("/:catId", async (req:express.Request, res:express.Response) => {
    const { catId }:{ catId?: string} = req.params;
    try {
        const post:any = await getRepository(Post)
            .createQueryBuilder("post")
            .where("post.cat = :cat AND post.status = :status", { cat: catId, status: "Y" })
            // .addSelect("user.id")
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


    /*
[
    {
        "replyId" : replyId,
        "content" : content,
        "replyTime" : replyTime,
        "catPhoto": binary data,
        "userID" : userID,
        "userNickName" : userNickName,
        "userPhoto" : binary data,
        "createDate" : createDate
    }
]
    */
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
        console.log(updatePost);
        res.status(200).send("successfully updated post");
    } catch (e) {
        res.status(404).send(e);
    }


    /*
{
  "postId" : postId,
  "content" : content,
  "postTime" : postTime,
  "catPhoto": binary data,
  "userID" : userID,
  "userNickName" : userNickName,
  "userPhoto" : binary data,
}
*/
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

    /*
{"deleteStatus": "Y", "message": "Successfully deleted post"}
*/
});

export default router;
