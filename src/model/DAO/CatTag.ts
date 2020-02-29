/* eslint-disable class-methods-use-this */
import {
    getConnection, UpdateResult, InsertResult, Repository, EntityRepository,
} from "typeorm";

import { CatTag, Tag } from "..";
import { TagStatus } from "../../types/index";

@EntityRepository(CatTag)
export default class CatTagRepository extends Repository<CatTag> {
    deleteTag(tagId:number, catId:number, userId:number):Promise<UpdateResult> {
        return getConnection().createQueryBuilder()
            .update(CatTag).set({ status: TagStatus.Deleted, deleteUser: userId })
            .where({ tag: tagId, cat: catId })
            .execute();
    }

    getTag(catId:string):Promise<Array<object>> {
        return this.createQueryBuilder("cat_tag")
            .where({ cat: Number(catId), status: TagStatus.Active })
            .leftJoinAndSelect("cat_tag.tag", "tag")
            .select(["cat_tag.id", "tag.content"])
            .getMany();
    }

    checkTag(catTag:string):Promise<Tag|undefined> {
        return this.createQueryBuilder("cat_tag")
            .select("tag").from(Tag, "tag")
            .where("tag.content = :content", { content: catTag })
            .select(["tag.id"])
            .getOne();
    }

    updateTag(userId: number, catId: number, tagId: number):Promise<InsertResult> {
        return getConnection().createQueryBuilder()
            .insert()
            .into("cat_tag")
            .values([{
                user: userId, cat: catId, tag: tagId, status: TagStatus.Active,
            }])
            .execute();
    }

    newTag(catTag: string):Promise<InsertResult> {
        return getConnection().createQueryBuilder()
            .insert()
            .into("tag")
            .values([
                {
                    content: catTag,
                },
            ])
            .execute();
    }
}
