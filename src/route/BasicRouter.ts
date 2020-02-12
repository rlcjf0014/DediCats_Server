/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import express from "express";
import uploadFile from "../ImageFunction/imgupload";
import deleteFile from "../ImageFunction/imgdelete";
// import storage from "../data/storage";z

const router:express.Router = express.Router();

router.get("/", (req:express.Request, res:express.Response) => {
    res.status(200).send("Hi! Welcome to Dedicats");
});

router.post("/imageupload", async (req:express.Request, res:express.Response) => {
    const { name, path }:{name:string, path:string} = req.body;

    const result = await uploadFile(name, path );
    res.status(201).send(`Your path is ${result}`);
});
// ? "/home/joshua/Desktop/Codestates/four_week_project/server/computer-science-geek_o_1010290.jpg"
router.post("/imagedelete", async (req:express.Request, res:express.Response) => {
    const { name }:{name:string} = req.body;

    const result = await deleteFile("Geek");
    res.status(201).send("Successfully deleted image");
});

export default router;
