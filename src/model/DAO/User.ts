/* eslint-disable class-methods-use-this */
/* eslint-disable no-unused-vars */

import {
    UpdateResult, getConnection, InsertResult, EntityRepository, Repository,
} from "typeorm";
import { User } from "..";
import { UserStatus } from "../../types/index";

@EntityRepository(User)
export default class CatRepository extends Repository<User> {
    getUserById(id:number):Promise<User|undefined> {
        return this.createQueryBuilder("user")
            .where("user.id = :id", { id })
            .getOne();
    }

    updateUserPw(password:string, id:number):Promise<UpdateResult> {
        return getConnection().createQueryBuilder()
            .update(User)
            .set({ password })
            .where({ id })
            .execute();
    }

    getUserByEmail(email:string):Promise<User|undefined> {
        return this.createQueryBuilder("user")
            .where("user.email = :email", { email })
            .getOne();
    }

    updateToken(id:number, refreshToken:string|null):Promise<UpdateResult> {
        return getConnection().createQueryBuilder()
            .update(User).set({ refreshToken })
            .where({ id })
            .execute();
    }

    getCatList(userId: number):Promise<Array<object>> {
        return this.createQueryBuilder("user")
            .where("user.id = :id", { id: userId })
            .leftJoinAndSelect("user.cats", "cat")
            .select(["user.id", "user.nickname", "user.photoPath", "user.createAt",
                "cat.id", "cat.description", "cat.address", "cat.nickname", "cat.species"])
            .leftJoinAndSelect("cat.photos", "photo", "photo.isProfile = :isProfile", { isProfile: "Y" })
            .select(["user.id", "user.nickname", "user.photoPath", "user.createAt",
                "cat.id", "cat.description", "cat.address", "cat.nickname", "cat.species",
                "photo.path"])
            .getMany();
    }

    insertUser(nickname:string, email:string, password:string, salt:string):Promise<InsertResult> {
        return getConnection()
            .createQueryBuilder()
            .insert()
            .into(User)
            .values({
                nickname, email, password, salt, status: UserStatus.Active,
            })
            .execute();
    }
}
