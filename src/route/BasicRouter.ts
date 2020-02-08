import express from "express";
// import storage from "../data/storage";z

const router:express.Router = express.Router();

router.get("/", (req:express.Request, res:express.Response) => {
    res.status(200).send("Hi! Welcome to Dedicats");
});

export default router;
