/* eslint-disable no-console */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import "reflect-metadata";
import http from "http";
import wkx from "wkx";

import app from "./api";
import data from "./data";

import Cat from "./data/entity/Cat";
import Tag from "./data/entity/Tag";
import User from "./data/entity/User";
import CatTag from "./data/entity/CatTag";
import Post from "./data/entity/Post";
import Comment from "./data/entity/Comment";

const PORT : Number = 8000;
const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`app listen on ${PORT}`);
});

data
    .getConnection()
    .then(async () => {
        console.log("Please wait...");
        const checkDB = await User.count();
        if (!checkDB) {
            try {
                // * user
                const user:User = new User();
                user.nickname = "testUser";
                user.password = "1234";
                user.email = "admin@codestates.com";
                user.status = "Y";
                const testUser:User = await User.save(user);
                if (!testUser) {
                    console.log("Failed to save user.");
                    return;
                }

                // * cat
                const cat:Cat = new Cat();
                cat.description = "test용 고양이입니다.";
                cat.location = new wkx.Point(1, 2).toWkt();
                cat.nickname = "devCat";
                cat.user = testUser;
                cat.status = "Y";
                cat.rainbow = JSON.stringify({
                    Y: 0, YDate: null, N: 0, NDate: null,
                });
                cat.cut = JSON.stringify({
                    Y: 0, N: 0, unknown: 0,
                });
                const devCat:Cat = await Cat.save(cat);
                if (!devCat) {
                    console.log("Failed to save cat.");
                    return;
                }

                // * following_cat table
                cat.users = [user];
                const follwingCat:Cat = await Cat.save(cat);
                if (!follwingCat.users) {
                    // ! users[Object<Use>, ... ]의 형태로 출력됨
                    console.log("Fail to following Cat");
                    return;
                }

                // * tag
                const tag:Tag = new Tag();
                tag.content = "권위적인 데브";
                const devTag:Tag = await Tag.save(tag);
                if (!devTag) {
                    console.log("Failed to save tag.");
                    return;
                }

                // * cat_tag
                const catTag = new CatTag();
                catTag.status = "Y";
                catTag.user = user;
                catTag.tag = tag;
                console.log(devCat);
                catTag.cat = devCat;
                const result = await CatTag.save(catTag);
                /*
                CatTag {
                status: 'Y',
                user: User {
                    nickname: 'testUser',
                    password: '1234',
                    email: 'admin@codestates.com',
                    status: 'Y',
                    photoPath: null,
                    id: 1,
                    createAt: 2020-02-04T20:31:25.738Z,
                    updateAt: 2020-02-04T20:31:25.738Z
                },
                tag: Tag {
                    content: '권위적인 데브',
                    id: 1,
                    createAt: 2020-02-04T20:31:25.803Z,
                    updateAt: 2020-02-04T20:31:25.803Z
                },
                deleteUser: null,
                id: 1,
                createAt: 2020-02-04T20:31:25.817Z,
                updateAt: 2020-02-04T20:31:25.817Z
                }
                */
                if (!result) {
                    console.log("Failed to save CatTag");
                    return;
                }

                const post:Post = new Post();
                post.user = testUser;
                post.cat = devCat;
                post.content = "아 배고파요!";
                post.status = "Y";
                const postResult = await Post.save(post);
                if (!postResult) {
                    console.log("Failed to save post");
                    return;
                }

                const comment:Comment = new Comment();
                comment.post = postResult;
                comment.user = testUser;
                comment.content = "안녕하시렵니까?";
                comment.status = "Y";
                const commentResult = await Comment.save(comment);
                if (!commentResult) {
                    console.log("Failed to save comment");
                    return;
                }
            } catch (e) {
                console.log("Error occurred during server setup.");
                console.log("Error : ", e);
                return;
            }
        }
        console.log("The database has been set up.\nPlease use the server!");
    })
    .catch((err:Error) => console.log(`TypeORM connection error: ${err}`));
