import express from "express";
// import storage from "../data/storage";

const router:express.Router = express.Router();

// Add Post
router.post("/new", (req:express.Request, res:express.Response) => {
    const {
        userId, catId, content, photoPath,
    }:{userId:number, catId:number, content:string, photoPath:string} = req.body;

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
    const { catId }:{ catId:number} = req.body;

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
    const { content, userId, postId }:{content:string, userId:number, postId:number} = req.params;
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
    const {userId, postId }:{userId:number, postId:number} = req.params;
    /*
{"deleteStatus": "Y", "message": "Successfully deleted post"}
*/
});

export default router;
