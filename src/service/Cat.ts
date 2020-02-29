/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
import {
    UpdateResult, InsertResult, DeleteResult, getCustomRepository,
} from "typeorm";

import CatRepository from "../model/DAO/Cat";

import Cat from "../model/entity/Cat";

const catRepository = getCustomRepository(CatRepository);

const selectCat = (catId: number): Promise<Cat|undefined> => catRepository.selectCat(catId);

const updateCatRainbow = (catId:number, strRainbow:string): Promise<UpdateResult> => catRepository.updateRainbow(catId, strRainbow);

const getCatFollower = (catId:string): Promise<Array<object>> => catRepository.getFollower(catId);

const addCatToday = (catId: number, catToday: string, catTodayTime: string): Promise<UpdateResult> => catRepository.addCatToday(catId, catToday, catTodayTime);

const updateCatCut = (catId: number, catCut: string): Promise<UpdateResult> => catRepository.updateCut(catId, catCut);

const addCat = (catNickname:string, coordinate:string, address:string, catDescription:string,
    catSpecies:string, userId: number, cut:object): Promise<InsertResult> => catRepository.addCat(catNickname, coordinate, address, catDescription, catSpecies, userId, cut);

const getCat = (catId: string):Promise<Cat|undefined> => catRepository.getCat(catId);

const getCatsBylocation = (location:{ NElatitude : number, NElongitude : number, SWlatitude : number, SWlongitude : number }, userId:number):Promise<Array<object>> => catRepositoryyy.getCatsBylocation(location, userId);

const deleteCat = (deleteId: number):Promise<DeleteResult> => catRepository.deleteCat(deleteId);

const insertFollow = (catId:number, userId:number):Promise<InsertResult> => catRepository.insertFollow(catId, userId);

const deleteFollow = (catId:number, userId:number):Promise<DeleteResult> => catRepository.deleteFollow(catId, userId);

const checkFollow = (catId:number, userId:number):Promise<Array<{count: string}>> => catRepository.checkFollow(catId, userId);
export {
    selectCat,
    updateCatCut,
    updateCatRainbow,
    getCat,
    getCatFollower,
    addCat,
    addCatToday,
    getCatsBylocation,
    deleteCat,
    insertFollow,
    deleteFollow,
    checkFollow,
};
