import {
    UpdateResult, getConnection, getRepository, InsertResult, DeleteResult,
} from "typeorm";
import Post from "../entity/Post";

const insertPost = async (userId:number, catId:number, content:string):Promise<InsertResult> => {
    const addPost:InsertResult = await getConnection().createQueryBuilder()
        .insert()
        .into("post")
        .values([
            {
                user: userId, cat: catId, content, status: "Y",
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
        .update(Post).set({ status: "N" })
        .where("post.id= :id", { id: postId })
        .execute();

    return updateResult;
};

export {
    insertPost, deletePost, updatePost, updateState,
};
