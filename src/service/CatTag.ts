/* eslint-disable max-len */
import {
    getConnection, UpdateResult, InsertResult, getRepository, QueryBuilder, DeleteResult,
} from "typeorm";
import * as CatTagDAO from "../model/DAO/CatTag";
import Tag from "../model/entity/Tag";

const deleteTag = (tagId:number, catId:number, userId:number): Promise<UpdateResult> => CatTagDAO.deleteTag(tagId, catId, userId);

const getTag = (catId: string): Promise<Array<object>> => CatTagDAO.getTag(catId);

const checkTag = (catTag:string): Promise<Tag|undefined> => CatTagDAO.checkTag(catTag);

const updateTag = (userId: number, catId: number, tagId: number): Promise<InsertResult> => CatTagDAO.updateTag(userId, catId, tagId);

const newTag = (catTag: string): Promise<InsertResult> => CatTagDAO.newTag(catTag);

export {
    deleteTag,
    getTag,
    checkTag,
    updateTag,
    newTag,
};
