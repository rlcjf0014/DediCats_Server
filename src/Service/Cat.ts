import {
    UpdateResult, InsertResult
} from "typeorm";
import * as CatDAO from "../model/DAO/Cat";
import Cat from "../model/entity/Cat;



    const selectCat = async (catId: number): Promise<Cat|undefined> => {
         await CatDAO.selectCat(catId);
    }

    const updateCatRainbow = async (catId:number, strRainbow:string): Promise<UpdateResult> => {
         await CatDAO.updateRainbow(catId, strRainbow);
        
    }

    const getCatFollower = async (catId:string): Promise<Array<object>> => {
         await CatDAO.getFollower(catId);
    }

    const addCatToday = async (catId: number, catToday: string, catTodayTime: string): Promise<UpdateResult> => {
         await CatDAO.addCatToday(catId, catToday, catTodayTime);
    }

    const updateCatCut = async (catId: number, catCut: string): Promise<UpdateResult> => {
         await CatDAO.updateCut(catId, catCut);
    }

    const addCat = async (catNickname:string, coordinate:string, address:string, catDescription:string,
        catSpecies:string, userId: number, cut:object): Promise<InsertResult> => {
         await CatDAO.addCat(catNickname, coordinate, address, catDescription, catSpecies, userId, cut);
    }

    const getCat = async (catId: string):Promise<Cat|undefined> => {
         await CatDAO.getCat(catId);
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
