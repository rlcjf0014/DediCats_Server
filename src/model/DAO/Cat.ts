/* eslint-disable max-len */
import {
    getConnection, UpdateResult, InsertResult, getRepository, QueryBuilder, DeleteResult,
} from "typeorm";


import Cat from "../entity/Cat";

const queryManager = getConnection().createQueryBuilder();
const repositoryManager = getRepository(Cat).createQueryBuilder("cat");

const selectCat = async (catId:number):Promise<Cat|undefined> => {
    const selectedCat:Cat|undefined = await queryManager
        .select("cat")
        .from(Cat, "cat")
        .where({ id: catId })
        .getOne();
    return selectedCat;
};

const updateRainbow = async (catId: number, strRainbow: string):Promise<UpdateResult> => {
    const updateResult:UpdateResult = await queryManager
        .update(Cat)
        .set({ rainbow: strRainbow })
        .where({ id: catId })
        .execute();
    return updateResult;
};

const getFollower = async (catId: string):Promise<Array<object>> => {
    const getFollowers:Array<object> = await repositoryManager
        .where("cat.id = :id", { id: Number(catId) })
        .leftJoinAndSelect("cat.users", "user")
        .select(["cat.id", "user.id", "user.nickname", "user.photoPath"])
        .getMany();
    return getFollowers;
};

const addCatToday = async (catId: number, catToday: string, catTodayTime: string): Promise<UpdateResult> => {
    const updateToday:UpdateResult = await queryManager
        .update(Cat).set({ today: catToday, todayTime: catTodayTime })
        .where("cat.id= :id", { id: catId })
        .execute();
    return updateToday;
};

const updateCut = async (catId: number, catCut: string): Promise<UpdateResult> => {
    const updateCuts:UpdateResult = await queryManager
        .update(Cat).set({ cut: catCut })
        .where("cat.id= :id", { id: catId })
        .execute();
    return updateCuts;
};

const addCat = async (catNickname:string, coordinate:string, address:string, catDescription:string,
    catSpecies:string, userId: number, cut:object): Promise<InsertResult> => {
    const addcat:InsertResult = await queryManager
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
                status: "Y",
                user: userId,
            },
        ])
        .execute();
    return addcat;
};

const getCat = async (catId: string):Promise<Cat|undefined> => {
    const getcat:Cat | undefined = await repositoryManager
        .where("cat.id = :id", { id: Number(catId) })
        .leftJoinAndSelect("cat.user", "item")
        .select(["cat", "item.id"])
        .getOne();
    return getcat;
};

const getCatsBylocation = async (location : { NElatitude : number, NElongitude : number, SWlatitude : number, SWlongitude : number }, userId:number):Promise<Array<object>> => {
    const result:Array<object> = await getConnection()
        .query("select jointable.*, if(isnull(following_cat.userId) , false, true) as `isFollowing` from ( select innertable.*, photo.path as `catProfile` from ( select id as `catId`, nickname as `catNickname`, address as `catAddress`, X(`location`) as `latitude`, Y(`location`) as `longitude`, description as `description`  from cat ) as `innertable` left join `photo` on (innertable.catId  = photo.catId and photo.is_profile = 'Y') where innertable.latitude <= ? and innertable.latitude >= ? and innertable.longitude <= ? and innertable.longitude >= ? ) as `jointable` left join `following_cat` on (jointable.catId = following_cat.catId and following_cat.userId = ?) ;",
            [location.NElatitude, location.SWlatitude, location.NElongitude, location.SWlongitude, userId]);

    return result;
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
};


// export default class CatDAO {
//     queryManager = getConnection().createQueryBuilder();


//     selectCat = async (catId:number) => {
//         const selectedCat:Cat|undefined = await this.queryManager
//             .select("cat")
//             .from(Cat, "cat")
//             .where({ id: catId })
//             .getOne();

//         return selectedCat;
//     }
// }
