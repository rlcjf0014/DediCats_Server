import express from "express";
import { mapCats } from "../controller/Cat";

const router:express.Router = express.Router();

router.post("/", mapCats);

export default router;
