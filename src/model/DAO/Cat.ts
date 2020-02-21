
import {
    getConnection, InsertResult, getRepository, DeleteResult, UpdateResult,
} from "typeorm";

import { Cat } from "..";
import { CatStatus } from "../../types/index";

const selectCat = async (catId:number):Promise<Cat|undefined> => {
    const selectedCat:Cat|undefined = await getConnection().createQueryBuilder()
        .select("cat")
        .from(Cat, "cat")
        .where({ id: catId })
        .getOne();
    return selectedCat;
};

const updateRainbow = async (catId: number, strRainbow: string):Promise<UpdateResult> => {
    const updateResult:UpdateResult = await getConnection().createQueryBuilder()
        .update(Cat)
        .set({ rainbow: strRainbow })
        .where({ id: catId })
        .execute();
    return updateResult;
};

const getFollower = async (catId: string):Promise<Array<object>> => {
    const getFollowers:Array<object> = await getRepository(Cat).createQueryBuilder("cat")
        .where("cat.id = :id", { id: Number(catId) })
        .leftJoinAndSelect("cat.users", "user")
        .select(["cat.id", "user.id", "user.nickname", "user.photoPath"])
        .getMany();
    return getFollowers;
};

const addCatToday = async (catId: number, catToday: string, catTodayTime: string): Promise<UpdateResult> => {
    const updateToday:UpdateResult = await getConnection().createQueryBuilder()
        .update(Cat).set({ today: catToday, todayTime: catTodayTime })
        .where("cat.id= :id", { id: catId })
        .execute();
    return updateToday;
};

const updateCut = async (catId: number, catCut: string): Promise<UpdateResult> => {
    const updateCuts:UpdateResult = await getConnection().createQueryBuilder()
        .update(Cat).set({ cut: catCut })
        .where("cat.id= :id", { id: catId })
        .execute();
    return updateCuts;
};

const addCat = async (catNickname:string, coordinate:string, address:string, catDescription:string,
    catSpecies:string, userId: number, cut:object): Promise<InsertResult> => {
    const addcat:InsertResult = await getConnection().createQueryBuilder()
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
    return addcat;
};

const getCat = async (catId: string):Promise<Cat|undefined> => {
    const getcat:Cat | undefined = await getRepository(Cat).createQueryBuilder("cat")
        .where("cat.id = :id", { id: Number(catId) })
        .leftJoinAndSelect("cat.user", "item")
        .select(["cat", "item.id"])
        .getOne();
    return getcat;
};

const getCatsBylocation = async (location : { NElatitude : number, NElongitude : number, SWlatitude : number, SWlongitude : number }, userId:number):Promise<Array<object>> => {
    const result:Array<object> = await getConnection()
        .query("select jointable.*, if(isnull(following_cat.userId) , false, true) as `isFollowing` from ( select innertable.*, photo.path as `catProfile` from ( select id as `catId`, species as `catSpecies`, nickname as `catNickname`, address as `catAddress`, X(`location`) as `latitude`, Y(`location`) as `longitude`, description as `description`  from cat ) as `innertable` left join `photo` on (innertable.catId  = photo.catId and photo.is_profile = 'Y') where innertable.latitude <= ? and innertable.latitude >= ? and innertable.longitude <= ? and innertable.longitude >= ? ) as `jointable` left join `following_cat` on (jointable.catId = following_cat.catId and following_cat.userId = ?) ;",
            [location.NElatitude, location.SWlatitude, location.NElongitude, location.SWlongitude, userId]);

    return result;
};

const deleteCat = async (deleteId:number):Promise<DeleteResult> => {
    const deletedCat:DeleteResult = await getConnection()
        .createQueryBuilder()
        .delete()
        .from("cat")
        .where({ id: deleteId })
        .execute();
    return deletedCat;
};

const insertFollow = async (catId:number, userId:number):Promise<InsertResult> => {
    const updateFollow:InsertResult = await getConnection()
        .createQueryBuilder()
        .insert()
        .into("following_cat")
        .values([
            { catId, userId },
        ])
        .execute();

    return updateFollow;
};

const deleteFollow = async (catId:number, userId:number):Promise<DeleteResult> => {
    const updateFollow:DeleteResult = await getConnection()
        .createQueryBuilder()
        .delete()
        .from("following_cat")
        .where({ catId, userId })
        .execute();

    return updateFollow;
};

const checkFollow = async (catId:number, userId:number):Promise<Array<{count: string}>> => {
    const follower:Array<{count: string}> = await getConnection()
        .query("select count(*) as `count` from following_cat where userId = ? and catId = ?;", [userId, catId]);
    return follower;
};

export {
    selectCat,
    updateRainbow,
    getFollower,
    addCatToday,
    updateCut,
    addCat,
    getCat,
    getCatsBylocation,
    deleteCat,
    insertFollow,
    deleteFollow,
    checkFollow,
};
