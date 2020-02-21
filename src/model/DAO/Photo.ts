import {
    InsertResult, UpdateResult, getConnection, getRepository,
} from "typeorm";

import Photo from "../entity/Photo";
import User from "../entity/User";


const addCatPhoto = async (imagePath:string|boolean, catId:number):Promise<InsertResult> => {
    const addPhoto:InsertResult = await getConnection().createQueryBuilder()
        .insert()
        .into("photo")
        .values([
            {
                path: imagePath, cat: catId, status: "Y", isProfile: "Y",
            },
        ])
        .execute();

    return addPhoto;
};

const getCatPhoto = async (catId: string):Promise<Photo|undefined> => {
    const getPhoto:Photo|undefined = await getConnection().createQueryBuilder()
        .select("photo")
        .from(Photo, "photo")
        .where("photo.cat = :cat", { cat: Number(catId), isProfile: "Y" })
        .select(["photo.path"])
        .getOne();
    return getPhoto;
};

const getCatAlbum = async (catId: string):Promise<Array<object>> => {
    const getPhoto:Array<object> = await getRepository(Photo)
        .createQueryBuilder("photo")
        .where("photo.cat = :cat AND photo.status = :status", { cat: Number(catId), status: "Y" })
        .select(["photo.id", "photo.path"])
        .orderBy("photo.id", "ASC")
        .getMany();
    return getPhoto;
};

const deleteProfile = async (userId: number):Promise<UpdateResult> => {
    const updatePic:UpdateResult = await getConnection().createQueryBuilder()
        .update(User).set({ photoPath: null })
        .where({ id: userId })
        .execute();
    return updatePic;
};

const updateProfile = async (userId: number, imagepath:string):Promise<UpdateResult> => {
    const updatePic:UpdateResult = await getConnection().createQueryBuilder()
        .update(User).set({ photoPath: imagepath })
        .where({ id: userId })
        .execute();
    return updatePic;
};

const deletePostPhoto = async (postId:number):Promise<UpdateResult> => {
    const updatePostPhoto:UpdateResult = await getConnection().createQueryBuilder()
        .update(Photo).set({ status: "D" })
        .where({ post: postId })
        .execute();
    return updatePostPhoto;
};

const addPostPhoto = async ()


export {
    addCatPhoto, getCatPhoto, getCatAlbum, deleteProfile, updateProfile, deletePostPhoto
};
