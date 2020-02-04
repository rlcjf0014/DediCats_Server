import express from "express";
// import storage from "../data/storage";

const router:express.Router = express.Router();

router.get("/", (req:express.Request, res:express.Response) => {
    const reqData = req.body;
    // 타입 지정시  const defunt: PersoneModel = res.body; 형태로 사용
    console.log(`server received POST req from ip: ${req.ip}. data is ${reqData}`);
});

router.post("/signin", (req:express.Request, res:express.Response) => {
    const { email, password }:{email?:string, password?:string} = req.body;

    // response
    // {   "userId" : user_id, "nickname" : nickname, "created_at": Date, "user_photo": binaryData }
});

router.post("/signup", (req:express.Request, res:express.Response) => {
    const { email, password, nickname }:{email?:string, password?:string, nickname?:string} = req.body;

    // response
    // { "userId" : userId , "email" : email , "nickname" : nickname }
});

router.patch("/changepw", (req:express.Request, res:express.Response) => {
    const { userId, password }:{userId?:string, password?:string } = req.body;

    // response
    // { "userId" : userId , "email" : email , "nickname" : nickname }
});

// Sign out
router.post("/signout", (req:express.Request, res:express.Response) => {
    const { userId }:{userId?:number} = req.body;

    // response
    // {"message": "Successfully signed out!"}
});


export default router;
