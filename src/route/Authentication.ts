import express from "express";

import * as UserController from "../controller/User";

const router:express.Router = express.Router();

router.post("/signin", UserController.signin);

router.post("/signout", UserController.signout);

// ! requestToekn으로 accessToken새로 요청
router.post("/token", UserController.token);

export default router;
