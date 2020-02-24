/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import "reflect-metadata";
import express, { Request, Response, NextFunction } from "express";
import { createConnection, Connection } from "typeorm";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";

import cors from "cors";
import http from "http";
import {
    typeORMError, jwtError, etcError, helper, customErrorHandler,
} from "./library/Error/errorHelper";
import {

    BasicRouter, Cat, Comment, Map, Photo, Post, Report, User, Signup, Authentication,
}
    from "./controller";


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
    const { accessToken } = req.signedCookies;
    const accessKey:any = process.env.JWT_SECRET_ACCESS;
    try {
        jwt.verify(accessToken, accessKey);
        next();
    } catch (e) {
        next(e);
    }
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
api.use(customErrorHandler);
api.use(etcError);
