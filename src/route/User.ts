import express from "express";

import * as UserController from "../controller/User";

const router:express.Router = express.Router();

router.patch("/changepw", UserController.changepw);

export default router;
