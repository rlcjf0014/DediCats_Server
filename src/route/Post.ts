/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import express from "express";
import Post from "../data/entity/Post";
import Photo from "../data/entity/Photo";

// import storage from "../data/storage";

const router:express.Router = express.Router();

// Add Post
router.post("/new", async (req:express.Request, res:express.Response) => {
    const {
        userId, catId, content, photoPath,
    }:{userId:number, catId:number, content:string, photoPath:string} = req.body;
 
    try {
        const newPost = new Post();
        newPost.user = userId;
        newPost.cat = catId;
        newPost.content = content;
        newPost.status = "Y";
        await Post.save(newPost);
    } catch (e) {
        res.status(404).send(e);
        return;
    }
    //! 사진 데이터를 S3에 저장 후 그 주소를 데이터베이스 저장해야 함. 그 이후에 클라이언트가 요청할 시 주소를 보내줘야 함. 
    if (photoPath){
    try {
        const post = await Post.findOne({ user: userId, cat: catId, content });
        console.log(post)
        if (!post) {
            res.status(404).send("오류로 인해 포스트 저장이 실패했습니다. 유감.");
            return;
        }
        const newPhoto = new Photo();
        newPhoto.path = photoPath;
        newPhoto.post = post.id;
        newPhoto.status = "Y";
        await Photo.save(newPhoto);
        res.status(200).send("{message: Adding post was successful}");
    } catch (e) {
        res.status(404).send(e);
    }
    }
    else {
      res.status(200).("{message: Adding post was successful}");
    }

});

// at Post Refresh button
router.get("/:catId", (req:express.Request, res:express.Response) => {
    const { catId }:{catId?: string} = req.params;

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
router.post("/update", (req:express.Request, res:express.Response) => {
    const { content, userId, postId }:{content:string, userId:number, postId:number} = req.body;
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
router.post("/delete", (req:express.Request, res:express.Response) => {
    const { userId, postId }:{userId:number, postId:number} = req.body;
    /*
{"deleteStatus": "Y", "message": "Successfully deleted post"}
*/
});

export default router;
