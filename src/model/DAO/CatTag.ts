import {
    getConnection, UpdateResult, InsertResult, getRepository, QueryBuilder, DeleteResult,
} from "typeorm";

import { CatTag, Tag } from "..";

import { TagStatus } from "../../types/index";


const deleteTag = async (tagId:number, catId:number, userId:number):Promise<UpdateResult> => {
    const deletetag:UpdateResult = await getConnection().createQueryBuilder()
        .update(CatTag).set({ status: TagStatus.Deleted, deleteUser: userId })
        .where({ tag: tagId, cat: catId })
        .execute();
    return deletetag;
};

const getTag = async (catId:string):Promise<Array<object>> => {
    const gettag:Array<object> = await getRepository(CatTag).createQueryBuilder("cat_tag")
        .where({ cat: Number(catId), status: TagStatus.Active })
        .leftJoinAndSelect("cat_tag.tag", "tag")
        .select(["cat_tag.id", "tag.content"])
        .getMany();
    return gettag;
};

const checkTag = async (catTag:string):Promise<Tag|undefined> => {
    const checktag:Tag|undefined = await getConnection().createQueryBuilder()
        .select("tag").from(Tag, "tag")
        .where("tag.content = :content", { content: catTag })
        .select(["tag.id"])
        .getOne();
    return checktag;
};

const updateTag = async (userId: number, catId: number, tagId: number):Promise<InsertResult> => {
    const updatetag:InsertResult = await getConnection().createQueryBuilder()
        .insert()
        .into("cat_tag")
        .values([{
            user: userId, cat: catId, tag: tagId, status: TagStatus.Active,
        }])
        .execute();
    return updatetag;
};

const newTag = async (catTag: string):Promise<InsertResult> => {
    const newtag:InsertResult = await getConnection().createQueryBuilder()
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
