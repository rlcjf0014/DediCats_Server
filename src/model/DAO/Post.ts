/* eslint-disable class-methods-use-this */
/* eslint-disable no-unused-vars */
import {
    UpdateResult, getConnection, getRepository, InsertResult, DeleteResult, EntityRepository, Repository,
} from "typeorm";
import { Post } from "..";
import { PostStatus, CommentStatus, PhotoStatus } from "../../types/index";

@EntityRepository(Post)
export default class PostRepository extends Repository<Post> {
    insertPost(userId:number, catId:number, content:string):Promise<InsertResult> {
        return getConnection().createQueryBuilder()
            .insert()
            .into("post")
            .values([
                {
                    user: userId, cat: catId, content, status: PostStatus.Active,
                },
            ])
            .execute();
    }

    deletePost(postId:number):Promise<DeleteResult> {
        return getConnection()
            .createQueryBuilder()
            .delete()
            .from("post")
            .where({ id: postId })
            .execute();
    }

    updatePost(postId:number, content:string) : Promise<UpdateResult> {
        return getConnection().createQueryBuilder()
            .update(Post).set({ content })
            .where("post.id= :id", { id: postId })
            .execute();
    }

    updateState(postId:number) : Promise<UpdateResult> {
        return getConnection().createQueryBuilder()
            .update(Post).set({ status: PostStatus.Deleted })
            .where("post.id= :id", { id: postId })
            .execute();
    }

    getPosts(catId:number, nthPage:number):Promise<Array<object>> {
        return this.createQueryBuilder("post")
            .where("post.cat = :cat AND post.status = :status", { cat: catId, status: PostStatus.Active })
            .leftJoinAndSelect("post.user", "perry")
            .select(["post", "perry.id", "perry.nickname", "perry.photoPath"])
            .leftJoinAndSelect("post.photos", "joshua", "joshua.status = :status", { status: PhotoStatus.Active })
            .select(["post.id", "post.content", "post.createAt", "post.updateAt", "perry.id", "perry.nickname", "perry.photoPath", "joshua.path", "joshua.id"])
            .leftJoinAndSelect("post.comments", "daniel", "daniel.status = :status", { status: CommentStatus.Active })
            .select(["post.id", "post.content", "post.createAt", "post.updateAt", "perry.id", "perry.nickname", "perry.photoPath", "joshua.path", "joshua.id", "daniel.id"])
            .orderBy("post.id", "DESC")
            .skip(nthPage)
            .take(10)
            .getMany();
    }


    getPostsCount(catId:number):Promise<number> {
        return getConnection()
            .query("select count(*) as `count` from post where status='Y' and catId = ?;", [catId])
            .then((result) => result[0].count);
    }
}

