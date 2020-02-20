import {
    getConnection, UpdateResult, InsertResult, getRepository, QueryBuilder, DeleteResult,
} from "typeorm";

import CatTag from "../entity/CatTag";
import Tag from "../entity/Tag";


const deleteTag = async (tagId:number, catId:number, userId:number):Promise<UpdateResult> => {
    const queryManager = getConnection().createQueryBuilder();
    const deletetag:UpdateResult = await queryManager
        .update(CatTag).set({ status: "D", deleteUser: userId })
        .where({ tag: tagId, cat: catId })
        .execute();
    return deletetag;
};

const getTag = async (catId:string):Promise<Array<object>> => {
    const repositoryManager = getRepository(CatTag).createQueryBuilder("cat_tag");
    const gettag:Array<object> = await repositoryManager
        .where({ cat: Number(catId), status: "Y" })
        .leftJoinAndSelect("cat_tag.tag", "tag")
        .select(["cat_tag.id", "tag.content"])
        .getMany();
    return gettag;
};

const checkTag = async (catTag:string):Promise<Tag|undefined> => {
    const queryManager = getConnection().createQueryBuilder();
    const checktag:Tag|undefined = await queryManager
        .select("tag").from(Tag, "tag")
        .where("tag.content = :content", { content: catTag })
        .select(["tag.id"])
        .getOne();
    return checktag;
};

const updateTag = async (userId: number, catId: number, tagId: number):Promise<InsertResult> => {
    const queryManager = getConnection().createQueryBuilder();
    const updatetag:InsertResult = await queryManager
        .insert()
        .into("cat_tag")
        .values([{
            user: userId, cat: catId, tag: tagId, status: "Y",
        }])
        .execute();
    return updatetag;
};

const newTag = async (catTag: string):Promise<InsertResult> => {
    const queryManager = getConnection().createQueryBuilder();
    const newtag:InsertResult = await queryManager
        .insert()
        .into("tag")
        .values([
            {
                content: catTag,
            },
        ])
        .execute();
    return newtag;
};


export {
    deleteTag,
    getTag,
    checkTag,
    updateTag,
    newTag,
};
