/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import express from "express";
import uploadFile from "./imgupload";
// import storage from "../data/storage";z

const router:express.Router = express.Router();

router.get("/", (req:express.Request, res:express.Response) => {
    res.status(200).send("Hi! Welcome to Dedicats");
});

router.post("/imageupload", async (req:express.Request, res:express.Response) => {
    const { name }:{name:string} = req.body;
    
    const result = await uploadFile(name, "/home/joshua/Desktop/Codestates/four_week_project/server/DediCats-server/45c2b26de19055.jpeg");
    res.status(200).send(`Your path is ${result}`);
});


export default router;
