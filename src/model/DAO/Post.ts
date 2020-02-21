import {
    UpdateResult, getConnection, getRepository, InsertResult, DeleteResult,
} from "typeorm";
import Post from "../entity/Post";
import { PostStatus } from "../../types/index";


const insertPost = async (userId:number, catId:number, content:string):Promise<InsertResult> => {
    const addPost:InsertResult = await getConnection().createQueryBuilder()
        .insert()
        .into("post")
        .values([
            {
                user: userId, cat: catId, content, status: PostStatus.Active,
            },
        ])
        .execute();
    return addPost;
};

const deletePost = async (postId:number):Promise<DeleteResult> => {
    const deleteResult:DeleteResult = await getConnection()
        .createQueryBuilder()
        .delete()
        .from("post")
        .where({ id: postId })
        .execute();
    return deleteResult;
};

const updatePost = async (postId:number, content:string) : Promise<UpdateResult> => {
    const updateResult:UpdateResult = await getConnection().createQueryBuilder()
        .update(Post).set({ content })
        .where("post.id= :id", { id: postId })
        .execute();

    return updateResult;
};

const updateState = async (postId:number) : Promise<UpdateResult> => {
    const updateResult:UpdateResult = await getConnection().createQueryBuilder()
        .update(Post).set({ status: PostStatus.Deleted })
        .where("post.id= :id", { id: postId })
        .execute();

    return updateResult;
};

const getPosts = async (catId:number, nthPage:number):Promise<Array<object>> => {
    const posts:Array<object> = await getRepository(Post)
        .createQueryBuilder("post")
        .where("post.cat = :cat AND post.status = :status", { cat: catId, status: "Y" })
        .leftJoinAndSelect("post.user", "perry")
        .select(["post", "perry.id", "perry.nickname", "perry.photoPath"])
        .leftJoinAndSelect("post.photos", "joshua", "joshua.status = :status", { status: "Y" })
        .select(["post.id", "post.content", "post.createAt", "post.updateAt", "perry.id", "perry.nickname", "perry.photoPath", "joshua.path", "joshua.id"])
        .leftJoinAndSelect("post.comments", "daniel", "daniel.status = :status", { status: "Y" })
        .select(["post.id", "post.content", "post.createAt", "post.updateAt", "perry.id", "perry.nickname", "perry.photoPath", "joshua.path", "joshua.id", "daniel.id"])
        .orderBy("post.id", "DESC")
        .skip(nthPage)
        .take(10)
        .getMany();

    return posts;
};

export {
    insertPost, deletePost, updatePost, updateState, getPosts,
};
