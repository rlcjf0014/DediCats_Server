/* eslint-disable class-methods-use-this */
/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
import {
    InsertResult, UpdateResult, getConnection, getRepository, EntityRepository, Repository,
} from "typeorm";

import { Photo, User } from "..";

import { PhotoStatus } from "../../types/index";

@EntityRepository()
export default class PhotoRepository extends Repository<Photo> {
    addCatPhoto(imagePath:string|boolean, catId:number):Promise<InsertResult> {
        return getConnection().createQueryBuilder()
            .insert()
            .into("photo")
            .values([
                {
                    path: imagePath, cat: catId, status: PhotoStatus.Active, isProfile: "Y",
                },
            ])
            .execute();
    }

    getCatPhoto(catId: string):Promise<Photo|undefined> {
        return this.createQueryBuilder("photo")
            .where("photo.cat = :cat", { cat: Number(catId), isProfile: "Y" })
            .select(["photo.path"])
            .getOne();
    }

    getCatAlbum(catId: string):Promise<Array<object>> {
        return this
            .createQueryBuilder("photo")
            .where("photo.cat = :cat AND photo.status = :status", { cat: Number(catId), status: PhotoStatus.Active })
            .select(["photo.id", "photo.path"])
            .orderBy("photo.id", "ASC")
            .getMany();
    }

    deleteProfile(userId: number):Promise<UpdateResult> {
        return getConnection().createQueryBuilder()
            .update(User).set({ photoPath: null })
            .where({ id: userId })
            .execute();
    }

    updateProfile(userId: number, imagepath:string, photoName:string):Promise<UpdateResult> {
        return getConnection().createQueryBuilder()
            .update(User).set({ photoPath: imagepath, photoName })
            .where({ id: userId })
            .execute();
    }

    deletePostPhoto(postId:number):Promise<UpdateResult> {
        return getConnection().createQueryBuilder()
            .update(Photo).set({ status: PhotoStatus.Deleted })
            .where({ post: postId })
            .execute();
    }

    addPostPhoto(imagepath:string, catId:number, postId:number):Promise<InsertResult> {
        return getConnection().createQueryBuilder()
            .insert()
            .into("photo")
            .values([
                {
                    path: imagepath, status: PhotoStatus.Active, cat: catId, post: postId,
                },
            ])
            .execute();
    }
}
