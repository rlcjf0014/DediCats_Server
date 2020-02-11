import express from "express";
import {
    getConnection, UpdateResult, getRepository, QueryBuilder, InsertResult,
} from "typeorm";

import User from "../data/entity/User";
import Photo from "../data/entity/Photo";
// import storage from "../data/storage";
import uploadFile from "../imgupload";
import deleteFile from "../imgdelete";

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

router.post("/profile/delete", async (req: express.Request, res:express.Response) => {
    const { userId }:{userId:number} = req.body;
    try {
        const connection:QueryBuilder<any> = await getConnection().createQueryBuilder();
        const updatePic:UpdateResult = await connection
            .update(User).set({ photoPath: undefined })
            .where({ id: userId }).execute();
        if (updatePic.raw.changedRows === 0) {
            res.status(409).send("Failed to delete profile picture");
            return;
        }
        const result:any = await deleteFile(`USER #${userId}`);
        res.status(201).send("Successfully deleted profile picture");
    } catch (e) {
        res.status(400).send(e);
    }
});

//! S3에 데이터 저장 후 그 주소를 받아와 데이터베이스에 저장 및 클라이언트에 보내줘야 함.
router.post("/profile", async (req:express.Request, res:express.Response) => {
    const { userId, photoPath }:{userId:number, photoPath:string} = req.body;
    try {
        const connection:QueryBuilder<any> = await getConnection().createQueryBuilder();
        const getProfile:User | undefined = await connection
            .select("user")
            .from(User, "user")
            .where("user.id = :id", { id: userId })
            .getOne();
        if (!getProfile) {
            res.status(409).send("Failed to update profile picture");
            return;
        }
        if (getProfile?.photoPath === null) {
            const key = `USER #${userId}`;
            const imagepath:any = await uploadFile(key, photoPath);
            const updatePic:UpdateResult = await connection
                .update(User).set({ photoPath: imagepath })
                .where({ id: userId }).execute();
            if (updatePic.raw.changedRows === 0) {
                res.status(409).send("Failed to update profile picture");
                return;
            }
            res.status(201).send("Successfully updated profile picture");
        } else {
            const result:any = await deleteFile(`USER #${userId}`);
            const key = `USER #${userId}`;
            const imagepath:any = await uploadFile(key, photoPath);
            const updatePic:UpdateResult = await connection
                .update(User).set({ photoPath: imagepath })
                .where({ id: userId }).execute();
            if (updatePic.raw.changedRows === 0) {
                res.status(409).send("Failed to update profile picture");
                return;
            }
            res.status(201).send("Successfully updated profile picture");
        }
    } catch (e) {
        res.status(400).send(e);
    }


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
