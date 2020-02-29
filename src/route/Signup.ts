import express from "express";
import * as UserController from "../controller/User";

const router:express.Router = express.Router();

router.post("/email", UserController.sendemail);

router.post("/findpw", UserController.findpw);

router.post("/", UserController.signup);

export default router;
