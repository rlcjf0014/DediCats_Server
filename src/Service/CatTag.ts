import {
    getConnection, UpdateResult, InsertResult, getRepository, QueryBuilder, DeleteResult,
} from "typeorm";
import * as CatTagDAO from "../model/DAO/CatTag";
import CatTag from "../model/entity/CatTag";

const deleteTag = async (tagId:number, catId:number, userId:number): Promise<UpdateResult> => {
    await CatTagDAO.deleteTag(tagId, catId, userId);
};
