import express from "express";
// import storage from "../data/storage";

const router:express.Router = express.Router();

// delete tag
router.post("/deleteTag",(req:express.Request, res:express.Response) => {
    const { tagId, catId, userId }:{tagId:number, catId:number, userId:number } = req.body;

    // response
    // {"message": "Successfully deleted tag}
});

// This endpoint updates the user's following information.
router.post("/follow", (req:express.Request, res:express.Response) => {
    const { catId, userId }:{catId?:number, userId?:number} = req.body;

    // response
    // {"message": "User now follows this cat"}
});

// This endpoint provides you with the information of the selected cat.
router.get("/:catId", (req:express.Request, res:express.Response) => {
    const { catId }:{catId?: string} = req.params;

    // response
    /*
    {
    catId: 1,
    description: "This cat is a beauty",
    nickName: "네로",
    tag: ["뚱뚱", "슬픔"],
    isfollowing: true,
    photo: binary data,//고양이 프로필사진,
    location: [latitude, logitude],
    cut: {Y: 3, N: 2, unknown: 1},
    rainbow: {Y: 3, N: 2},
    species: "러시안 블루",
    today: "건강하다...!",
    todayTime: 2020-01-30
}
     */

    // error
    // { "error" : error }
});
// update cat rainbow
router.post("/rainbow", (req:express.Request, res:express.Response) => {
    const { catId, rainbow }:{catId:number, rainbow:object} = req.body;

    // response
    /*
    {
     "rainbow": { Y :  0, Y_date : 2020-01-31 , N : 0, N_date : 2020-01-31  }
}
     */

    // error
    // { "error" : error }
});

// Followers Tab
router.get("/follower/:catId", (req:express.Request, res:express.Response) => {
    const { catId }:{catId?: string} = req.params;

    // response
    /*
[
  {
    "userID" : userID,
    "nickname" : nickName,
    "userPhoto" : binarydata,
    "createDate" : createDate
  }
  .
  .
  .
]
     */

    // error
    // {"message": "Unable to find followers"}
});

// Cat's Today Status
router.post("/addcatTody", (req:express.Request, res:express.Response) => {
    const { catId, catToday }:{catId?:number, catToday?:string} = req.body;

    /*
    {
  "cat_today" : "기운이 넘침",
  "cat_today_time": 2020-01-30
}

    */
});

// Catcut
router.post("/cut", (req:express.Request, res:express.Response) => {
    const { catId, catCut }:{catId?:number, catCut?:object} = req.body;

    /*
{ Y : 0 , N : 0 , unknown : 0}

    */
});

// update Tag
router.post("/updateTag", (req:express.Request, res:express.Response) => {
    const { catId, catTag }:{catId?:number, catTag?:string} = req.body;

    /*
{ "messge" : "Tag Add Successfully", "catTag": [뚱땡] }
    */
});

// Add Cat
router.post("/addcat", (req:express.Request, res:express.Response) => {
    const {
        catTag, catNickname, location, catDescription, catSpecies, catCut, photoPath,
    }:{ catTag?:Array<number>, catNickname?:string, location?:string, catDescription?:string, catSpecies?:string, catCut?:object, photoPath?:string } = req.body;

    /*
    {
  "cat_today" : "기운이 넘침",
  "cat_today_time": 2020-01-30
}

    */
});

// Unfollow Cat
router.post("/unfollow", (req:express.Request, res:express.Response) => {
    const { userId, catId }:{userId?:number, catId?:number} = req.body;

    // response
    // {"message": "Unfollowed this cat"}
});

// Unfollow Cat
router.get("/catlist/:userId", (req:express.Request, res:express.Response) => {
    const { userId }:{userId?:string} = req.params;

    // response
    /*
      {
  cat_id: 1,
  location: "Point (10 3)",
  cat_nickname: "돼냥이",
  cat_photo: binary data,
  },
  {
  cat_id: 2,
  location: "Point (13 5)",
  cat_nickname: "냥이",
  cat_photo: binary data,
  }
]
    */
});

export default router;
