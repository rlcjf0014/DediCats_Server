/* eslint-disable no-unused-vars */
import "reflect-metadata";
import express, { Request, Response, NextFunction } from "express";
import { createConnection, Connection } from "typeorm";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

import cors from "cors";
import jwt from "jsonwebtoken";
import http from "http";
import { typeORMError, jwtError, etcError } from "./library/errorHelper";
import {
    BasicRouter, Cat, Comment, Map, Photo, Post, Report, User, Signup, Authentication,
}
    from "./route";

require("dotenv").config();


const api: express.Application = express();
const PORT : Number = 8000;
const server = http.createServer(api);
const io = require("socket.io")(server);


const post = Post(io);
const comment = Comment(io);


let connection: Connection;

api.use(cors());

api.use(cookieParser(process.env.TOKEN_KEY));
api.use(bodyParser.json({ limit: "50mb" }));
api.use(bodyParser.urlencoded({ limit: "50mb", extended: false }));


api.use("/", BasicRouter);
api.use("/signup", Signup);
api.use("/auth", Authentication);
api.use("/*", (req:Request, res:Response, next:NextFunction) => {
    console.log("access is coming in");
    console.log(req.signedCookies);
    const { accessToken } = req.signedCookies;
    try {
        const accessKey:any = process.env.JWT_SECRET_ACCESS;
        jwt.verify(accessToken, accessKey);
        console.log("이버스는 일반 서버로 갑니다");
        next();
    } catch {
        console.log("이버스는 인증으로 갑니다");
        // res.redirect("../auth/token");
        res.sendStatus(403);
        // res.writeHead(302, {
        //     Location: `${process.env.AUTH_SERVER}/auth/token`
        // res.redirect("./route/Authentication/token");
    }
    // res.end();
});

api.use("/user", User);
api.use("/cat", Cat);
api.use("/comment", comment);
api.use("/map", Map);
api.use("/photo", Photo);
api.use("/post", post);
api.use("/report", Report);

//* Socket setup

io.on("connection", (socket:any) => {
    const { postId } = socket.handshake.query;
    // eslint-disable-next-line no-param-reassign
    socket.postId = postId;
    console.log("User connected to postID,", postId);
    socket.join(postId);

    socket.on("disconnect", () => {
        console.log("disconnected postID: ", postId);
    });
});

server.listen(PORT, () => {
    console.log(`app listen on ${PORT}`);
});

const getConnection = async (): Promise<Connection> => {
    try {
        if (!(connection instanceof Connection)) {
            connection = await createConnection();
        }
    } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
        throw err;
    }
    return connection;
};

getConnection()
    .then(async () => {
        console.log("Please wait...");
        console.log("The database has been set up.\nPlease use the server!");
    })
    .catch((err:Error) => console.log(`TypeORM connection error: ${err}`));


api.use((req:Request, res:Response) => {
    res.status(404).send("Invalid normal server address.Please check the address again");
});

api.use(typeORMError);
api.use(jwtError);
api.use(etcError);
