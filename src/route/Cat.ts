import express from "express";

import * as CatController from "../controller/Cat";

const router:express.Router = express.Router();

router.post("/deleteTag", CatController.deletetag);

// This endpoint updates the user's following information.
router.post("/follow", CatController.follow);


// update cat rainbow
router.post("/rainbow", CatController.updateRainbow);

// Followers Tab
router.get("/follower/:catId", CatController.follower);

// Cat's Today Status
router.post("/addcatToday", CatController.addcatToday);

// Catcut
router.post("/cut", CatController.updatecut);

// update Tag
router.post("/updateTag", CatController.updatetag);

// Add Cat
//! new wkx.Point(1, 2).toWkt()
router.post("/addcat", CatController.addcat);

// Unfollow Cat
router.post("/unfollow", CatController.unfollow);

// This endpoint allows you to get the list of cats you follow.
router.get("/catlist", CatController.catlist);

// This endpoint provides you with the information of the selected cat.
// ? 캣 태그, 사진 같이 보내줘야 함.
router.get("/:catId", CatController.selectedCat);

export default router;
