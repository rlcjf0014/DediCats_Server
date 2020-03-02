/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
import {
    UpdateResult, InsertResult, getCustomRepository,
} from "typeorm";

import Photo from "../model/entity/Photo";
import PhotoRepository from "../model/DAO/Photo";

const photoRepository = () => getCustomRepository(PhotoRepository);

const addCatPhoto = (imagePath:string|boolean, catId:number):Promise<InsertResult> => photoRepository().addCatPhoto(imagePath, catId);
const getCatPhoto = (catId:string):Promise<Photo|undefined> => photoRepository().getCatPhoto(catId);
const getCatAlbum = (catId:string):Promise<Array<object>> => photoRepository().getCatAlbum(catId);
const deleteProfile = (userId:number):Promise<UpdateResult> => photoRepository().deleteProfile(userId);
const updateProfile = (userId:number, imagepath:string, photoName:string):Promise<UpdateResult> => photoRepository().updateProfile(userId, imagepath, photoName);
const deletePostPhoto = (postId:number):Promise<UpdateResult> => photoRepository().deletePostPhoto(postId);
const addPostPhoto = (imagepath:string, catId:number, postId:number):Promise<InsertResult> => photoRepository().addPostPhoto(imagepath, catId, postId);


export {
    addCatPhoto, getCatPhoto, getCatAlbum,
    deleteProfile, updateProfile, deletePostPhoto, addPostPhoto,
};
