import express from "express";
// import storage from "../data/storage";

const router:express.Router = express.Router();

// New Comment of Post
router.post("/new", (req:express.Request, res:express.Response) => {
    const {
        catId, postId, userId, content,
    }:{catId?:number, postId?:number, userId?:number, content?:string} = req.body;
    /*
        redirect가 나을것같은데?
    */
});

// Comment of Post
router.get("/:catId/:postId", (req:express.Request, res:express.Response) => {
    const { catId, postId }:{catId?:number, postId?:number} = req.params;
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
    const { catId, commnetId }:{catId:number, commnetId:number} = req.params;
    /*
{"deleteStatus": "Y", "message": "Successfully deleted post"}
    */
});

// Add Comment
router.post("/add", (req:express.Request, res:express.Response) => {
    const { content, userId, postId }:{content:string, userId:number, postId:number} = req.params;
    /*
{"deleteStatus": "Y", "message": "Successfully deleted post"}{
  "commentId" : commentId,
  "content" : content,
  "commentTime" : commentTime,
  "userID" : userID,
  "userNickName" : userNickName,
  "userPhoto" : binary data,
}    */
});

export default router;
