/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import express from "express";



const router:express.Router = express.Router();

router.get("/", (req:express.Request, res:express.Response) => {
    res.status(200).send("Hi! Welcome to Dedicats");
    // res.status(200).send("success");
});

export default router;
