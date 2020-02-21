import {
    UpdateResult, InsertResult, DeleteResult
} from "typeorm";

import Photo from "../model/entity/Photo";
import * as PhotoDAO from "../model/DAO/Photo";


const addCatPhoto = (imagePath:string|boolean, catId:number):Promise<InsertResult> => PhotoDAO.addCatPhoto(imagePath, catId);
const getCatPhoto = (catId:string):Promise<Photo|undefined> => PhotoDAO.getCatPhoto(catId);
const getCatAlbum = (catId:string):Promise<Array<object>> => PhotoDAO.getCatAlbum(catId);
const deleteProfile = (userId:number):Promise<UpdateResult> => PhotoDAO.deleteProfile(userId);
const updateProfile = (userId:number, imagepath:string):Promise<UpdateResult> => PhotoDAO.updateProfile(userId, imagepath);

export { addCatPhoto, getCatPhoto, getCatAlbum, deleteProfile, updateProfile };
