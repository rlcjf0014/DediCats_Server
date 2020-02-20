import {
    getConnection, UpdateResult, InsertResult, getRepository, QueryBuilder, DeleteResult,
} from "typeorm";

import CatTag from "../entity/CatTag";

const queryManager = getConnection().createQueryBuilder();

const deleteTag = async (tagId:number, catId:number, userId:number):Promise<UpdateResult> => {
    const deletetag:UpdateResult = await queryManager
        .update(CatTag).set({ status: "D", deleteUser: userId })
        .where({ tag: tagId, cat: catId })
        .execute();
    return deletetag;
};


export {
    deleteTag,
    queryManager,
}