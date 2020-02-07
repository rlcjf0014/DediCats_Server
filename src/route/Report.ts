import express from "express";
import {
    getConnection, UpdateResult, InsertResult, getRepository, QueryBuilder, InsertQueryBuilder, SelectQueryBuilder,
} from "typeorm";
import { Query } from "typeorm/driver/Query";
// import storage from "../data/storage";

const router:express.Router = express.Router();

router.post("/", async (req:express.Request, res:express.Response) => {
    const {
        commentId, postId, catId, criminalId, userId,
    }:{commentId:number, postId:(number|undefined), catId:(number|undefined), criminalId?:number, userId:number} = req.body;
    try{
      const updateConnection:QueryBuilder<any> = await getConnection().createQueryBuilder()
      if (postId){
        const reportPost:InsertResult = await updateConnection
        .insert()
        .into("report")
        .values([
            {
                post: postId, user:userId, criminalId 
            }
          ])
        .execute();
        if (reportPost.raw.affectedRows === 0){
          res.status(404).send("Failed to report post");    
        }
        res.status(201).send("Successfully reported post");  
      }
      if (catId){
        const reportCat:InsertResult = await updateConnection
        .insert()
        .into("report")
        .values([
            {
                cat: catId, user:userId, criminalId 
            }
          ])
        .execute();
        if (reportCat.raw.affectedRows === 0){
          res.status(404).send("Failed to report cat");    
        }
        res.status(201).send("Successfully reported cat");  
      }
      if (commentId){
        const reportComment:InsertResult = await updateConnection
        .insert()
        .into("report")
        .values([
            {
                comment: commentId, user:userId, criminalId 
            }
          ])
          .execute()
        if (reportComment.raw.affectedRows === 0){
          res.status(404).send("Failed to report comment");    
        }
        res.status(201).send("Successfully reported comment");  
      }
    }
    catch(e){
        res.status(400).send(e);
    }

});

export default router;
