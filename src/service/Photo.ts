/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
import {
    UpdateResult, InsertResult, 
} from "typeorm";

import Photo from "../model/entity/Photo";
import * as PhotoDAO from "../model/DAO/Photo";


const addCatPhoto = (imagePath:string|boolean, catId:number):Promise<InsertResult> => PhotoDAO.addCatPhoto(imagePath, catId);
const getCatPhoto = (catId:string):Promise<Photo|undefined> => PhotoDAO.getCatPhoto(catId);
const getCatAlbum = (catId:string):Promise<Array<object>> => PhotoDAO.getCatAlbum(catId);
const deleteProfile = (userId:number):Promise<UpdateResult> => PhotoDAO.deleteProfile(userId);
const updateProfile = (userId:number, imagepath:string):Promise<UpdateResult> => PhotoDAO.updateProfile(userId, imagepath);
const deletePostPhoto = (postId:number):Promise<UpdateResult> => PhotoDAO.deletePostPhoto(postId);
const addPostPhoto = (imagepath:string, catId:number, postId:number):Promise<InsertResult> => PhotoDAO.addPostPhoto(imagepath, catId, postId);

export {
    addCatPhoto, getCatPhoto, getCatAlbum,
    deleteProfile, updateProfile, deletePostPhoto, addPostPhoto,
};
