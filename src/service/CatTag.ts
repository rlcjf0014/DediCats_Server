/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
import { UpdateResult, InsertResult, getCustomRepository } from "typeorm";
import CatTagRepository from "../model/DAO/CatTag";
import Tag from "../model/entity/Tag";

const catTagRepository = () => getCustomRepository(CatTagRepository);

const deleteTag = (tagId:number, catId:number, userId:number): Promise<UpdateResult> => catTagRepository().deleteTag(tagId, catId, userId);

const getTag = (catId: string): Promise<Array<object>> => catTagRepository().getTag(catId);

const checkTag = (catTag:string): Promise<Tag|undefined> => catTagRepository().checkTag(catTag);

const updateTag = (userId: number, catId: number, tagId: number): Promise<InsertResult> => catTagRepository().updateTag(userId, catId, tagId);

const newTag = (catTag: string): Promise<InsertResult> => catTagRepository().newTag(catTag);

export {
    deleteTag,
    getTag,
    checkTag,
    updateTag,
    newTag,
};
