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
    const newPost = new Post();
    newPost.user = userId;
    newPost.cat = catId;
    newPost.content = content;
    const newPhoto = new Photo();
    newPhoto.path = photoPath;
    await Post.save(newPost);
    await Photo.save(newPhoto);

    /*
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
    */
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
