/* eslint-disable class-methods-use-this */
/* eslint-disable max-len */

import {
    getConnection, InsertResult, DeleteResult, UpdateResult, EntityRepository, Repository,
} from "typeorm";

import { Cat } from "..";
import { CatStatus } from "../../types/index";

 @EntityRepository(Cat)
export default class CatRepository extends Repository<Cat> {
    selectCat(catId:number):Promise<Cat|undefined> {
        return this.createQueryBuilder("cat")
            .where({ id: catId })
            .getOne();
    }

    updateRainbow(catId: number, strRainbow: string):Promise<UpdateResult> {
        return getConnection()
            .createQueryBuilder()
            .update(Cat)
            .set({ rainbow: strRainbow })
            .where({ id: catId })
            .execute();
    }

    getFollower(catId: string):Promise<Array<object>> {
        return this.createQueryBuilder("cat")
            .where("cat.id = :id", { id: Number(catId) })
            .leftJoinAndSelect("cat.users", "user")
            .select(["cat.id", "user.id", "user.nickname", "user.photoPath"])
            .getMany();
    }

    addCatToday(catId: number, catToday: string, catTodayTime: string): Promise<UpdateResult> {
        return getConnection()
            .createQueryBuilder()
            .update(Cat).set({ today: catToday, todayTime: catTodayTime })
            .where("cat.id= :id", { id: catId })
            .execute();
    }

    updateCut(catId: number, catCut: string): Promise<UpdateResult> {
        return getConnection()
            .createQueryBuilder()
            .update(Cat)
            .set({ cut: catCut })
            .where("cat.id= :id", { id: catId })
            .execute();
    }

    addCat(catNickname:string, coordinate:string, address:string, catDescription:string, catSpecies:string, userId: number, cut:object): Promise<InsertResult> {
        return getConnection()
            .createQueryBuilder()
            .insert()
            .into("cat")
            .values([
                {
                    description: catDescription,
                    location: coordinate,
                    address,
                    nickname: catNickname,
                    species: catSpecies,
                    cut: JSON.stringify(cut),
                    rainbow: JSON.stringify({
                        Y: 0, YDate: null, N: 0, NDate: null,
                    }),
                    status: CatStatus.Active,
                    user: userId,
                },
            ])
            .execute();
    }

    getCat(catId: string):Promise<Cat|undefined> {
        return this.createQueryBuilder("cat")
            .where("cat.id = :id", { id: Number(catId) })
            .leftJoinAndSelect("cat.user", "item")
            .select(["cat", "item.id"])
            .getOne();
    }

    getCatsBylocation(location : { NElatitude : number, NElongitude : number, SWlatitude : number, SWlongitude : number }, userId:number):Promise<Array<object>> {
        return this.query("select jointable.*, if(isnull(following_cat.userId) , false, true) as `isFollowing` from ( select innertable.*, photo.path as `catProfile` from ( select id as `catId`, species as `catSpecies`, nickname as `catNickname`, address as `catAddress`, X(`location`) as `latitude`, Y(`location`) as `longitude`, description as `description`  from cat where status = 'Y') as `innertable` left join `photo` on (innertable.catId  = photo.catId and photo.is_profile = 'Y') where innertable.latitude <= ? and innertable.latitude >= ? and innertable.longitude <= ? and innertable.longitude >= ? ) as `jointable` left join `following_cat` on (jointable.catId = following_cat.catId and following_cat.userId = ?) ;",
            [location.NElatitude, location.SWlatitude, location.NElongitude, location.SWlongitude, userId]);
    }

    deleteCat(deleteId:number):Promise<DeleteResult> {
        return getConnection()
            .createQueryBuilder()
            .delete()
            .from("cat")
            .where({ id: deleteId })
            .execute();
    }

    insertFollow(catId:number, userId:number):Promise<InsertResult> {
        return getConnection()
            .createQueryBuilder()
            .insert()
            .into("following_cat")
            .values([
                { catId, userId },
            ])
            .execute();
    }

    deleteFollow(catId:number, userId:number):Promise<DeleteResult> {
        return getConnection()
            .createQueryBuilder()
            .delete()
            .from("following_cat")
            .where({ catId, userId })
            .execute();
    }

    checkFollow(catId:number, userId:number):Promise<Array<{count: string}>> {
        return this.query("select count(*) as `count` from following_cat where userId = ? and catId = ?;", [userId, catId]);
    }
}
