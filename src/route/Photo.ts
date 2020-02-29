import express from "express";

import * as PhotoController from "../controller/Photo";

const router:express.Router = express.Router();

router.get("/album/:catId", PhotoController.catAlbum);

router.post("/profile/delete", PhotoController.deleteProfile);

//! S3에 데이터 저장 후 그 주소를 받아와 데이터베이스에 저장 및 클라이언트에 보내줘야 함.
router.post("/profile", PhotoController.profilePic);

export default router;
