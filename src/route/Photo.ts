import express from "express";
import { getConnection, UpdateResult, getRepository } from "typeorm";

import User from "../data/entity/User";
import Photo from "../data/entity/Photo";
// import storage from "../data/storage";

const router:express.Router = express.Router();

router.get("/album/:catId", async (req:express.Request, res:express.Response) => {
    const { catId }:{catId?: string} = req.params;
    try {
        const getPhoto:Array<object> = await getRepository(Photo)
            .createQueryBuilder("photo")
            .where("photo.cat = :cat AND photo.status = :status", { cat: Number(catId), status: "Y" })
            .select(["photo.id", "photo.path"])
            .orderBy("photo.id", "ASC")
            .getMany();
        if (!getPhoto) {
            res.status(409).send("Photo not found");
        }
        res.status(200).send(getPhoto);
    } catch (e) {
        res.status(400).send(e);
    }
});

//! S3에 데이터 저장 후 그 주소를 받아와 데이터베이스에 저장 및 클라이언트에 보내줘야 함.
router.post("/profile", async (req:express.Request, res:express.Response) => {
    const { userId, photoPath }:{userId:number, photoPath:string} = req.body;

    // try{
    //   const updateProfile:UpdateResult = await getConnection()
    //   .createQueryBuilder()
    //   .update(User)
    //   .set({})
    //   .where({ id: userId })
    //   .execute();

    //   if (updateProfile.raw.changedRows)


    // }
    // catch(e){
    //     res.status(404).send("User profile picture not added");
    // }

    /*
{
    "user_photo": binary Data
}
    */
});

export default router;
