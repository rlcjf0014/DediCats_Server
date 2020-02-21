/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import express from "express";
import { helper } from "../library/errorHelper";

const router:express.Router = express.Router();

router.get("/", helper((req:express.Request, res:express.Response) => {
    res.status(200).send("Hi! Welcome to Dedicats");
}));

export default router;
