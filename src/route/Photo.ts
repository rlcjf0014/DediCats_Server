import express from "express";
// import storage from "../data/storage";

const router:express.Router = express.Router();

router.get("/album/:catId", (req:express.Request, res:express.Response) => {
    const { catId }:{catId?:number} = req.params;
    /*
[
    {
        "replyId" : replyId,
        "photoId" : photoId,
        "photo" : binary data
    }
    .
    .
    .
]
    */
});

router.post("/profile", (req:express.Request, res:express.Response) => {
    const { userId, photoPath }:{userId?:number, photoPath?:string} = req.params;
    /*
{
    "user_photo": binary Data
}
    */
});

export default router;
