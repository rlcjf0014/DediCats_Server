import express from "express";
// import storage from "../data/storage";

const router:express.Router = express.Router();

router.post("/", (req:express.Request, res:express.Response) => {
    const {location} : {location:string} = req.body;
    // 타입 지정시  const defunt: PersoneModel = res.body; 형태로 사용
    console.log(`server received POST req from ip: ${req.ip}. data is ${res}`);
});

//* request.body.location
//! "((33.44843745687413, 126.56798357402302), (33.452964008206735, 126.57333898904454))"

// ? response
/*
[
    {
        cat_id:1,
        cat_nickname: "돼냥이",
        location:
            [
               latitude, longitude
            ]
    },
    {
        cat_id:2,
        cat_nickname: "고라파덕",
        location:
            [
               latitude, longitude
            ]
    }
]
*/


export default router;
