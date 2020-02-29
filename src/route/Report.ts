import express from "express";
import report from "../controller/Report";

const router:express.Router = express.Router();

router.post("/", report);

export default router;
