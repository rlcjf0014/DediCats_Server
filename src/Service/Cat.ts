import {
    getConnection, UpdateResult, InsertResult, getRepository, QueryBuilder, DeleteResult,
} from "typeorm";
import * as CatDAO from "../model/DAO/Cat";
import Cat from "../model/entity/Cat;



    const selectCat = async (catId: number): Promise<Cat|undefined> => {
        return await CatDAO.selectCat(catId);
    }

    const updateCatRainbow = async (catId:number, strRainbow:string): Promise<UpdateResult> => {
        return await CatDAO.updateRainbow(catId, strRainbow);
    }

    const getCatFollower = async (catId:string): Promise<Array<object>> => {
        return await CatDAO.getFollower(catId);
    }

    const addCatToday = async (catId: number, catToday: string, catTodayTime: string): Promise<UpdateResult> => {
        return await CatDAO.addCatToday(catId, catToday, catTodayTime);
    }

    const updateCatCut = async (catId: number, catCut: string): Promise<UpdateResult> => {
        return await CatDAO.updateCut(catId, catCut);
    }

    const addCat = async (catNickname:string, coordinate:string, address:string, catDescription:string,
        catSpecies:string, userId: number, cut:object): Promise<InsertResult> => {
        return await CatDAO.addCat(catNickname, coordinate, address, catDescription, catSpecies, userId, cut);
    }

    const getCat = async (catId: string):Promise<Cat|undefined> => {
        return await CatDAO.getCat(catId);
    }

    export {
        selectCat, 
        updateCatCut,
        updateCatRainbow,
        getCat,
        getCatFollower,
        addCat,
        addCatToday,
    }
