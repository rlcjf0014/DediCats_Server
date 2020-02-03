import express from "express";
// import storage from "../data/storage";z

const router:express.Router = express.Router();

router.get("/", (req:express.Request, res:express.Response) => {
    const reqData = req.body;
    // 타입 지정시  const defunt: PersoneModel = res.body; 형태로 사용
    console.log(`server received POST req from ip: ${req.ip}. data is ${reqData}`);
});

export default router;
