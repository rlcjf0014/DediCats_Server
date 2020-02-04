import express from "express";
// import storage from "../data/storage";

const router:express.Router = express.Router();

router.post("/", (req:express.Request, res:express.Response) => {
    const {
        commnetId, postId, catId, criminalId, userId,
    }:{commnetId?:(number|undefined), postId?:(number|undefined), catId?:(number|undefined), criminalId?:number, userId?:number} = req.body;

    /*
     {    "userNickname": "빛",

     "catNickName": "돼냥",
     "criminalNickname": "바둑이",
     "postId": 1,
     "commentId": 3,

}
     */
});

export default router;
