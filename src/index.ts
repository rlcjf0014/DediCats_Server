/* eslint-disable no-console */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import "reflect-metadata";
import express, { Request, Response, NextFunction } from "express";

import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

import cors from "cors";
import jwt from "jsonwebtoken";
import http from "http";
import data from "./data";
import BasicRouter from "./route/BasicRouter";
import catRouter from "./route/Cat";
import commentRouter from "./route/Comment";
import mapRouter from "./route/Map";
import photoRouter from "./route/Photo";
import postRouter from "./route/Post";
import reportRouter from "./route/Report";
import userRouter from "./route/User";
import signupRouter from "./route/Signup";
// import io from "./index";

require("dotenv").config();


const api: express.Application = express();
const PORT : Number = 8000;
const server = http.createServer(api);
const io = require("socket.io")(server);

const post = postRouter(io);
const comment = commentRouter(io);


api.use(cors());

api.use(cookieParser(process.env.TOKEN_KEY));
api.use(bodyParser.json({ limit: "50mb" }));
api.use(bodyParser.urlencoded({ limit: "50mb", extended: false }));


api.use("/signup", signupRouter);

// api.use("/*", (req:Request, res:Response, next:NextFunction) => {
//     const { accessToken } = req.signedCookies;
//     try {
//         const accessKey:any = process.env.JWT_SECRET_ACCESS;
//         jwt.verify(accessToken, accessKey);
//         next();
//     } catch {
//         res.redirect(`${process.env.AUTH_SERVER}/auth/token`);
//         // res.status(400).send("accessToken is invalid");
//     }
// });

api.use("/user", userRouter);
api.use("/cat", catRouter);
api.use("/comment", comment);
api.use("/map", mapRouter);
api.use("/photo", photoRouter);
api.use("/post", post);
api.use("/report", reportRouter);
api.use("/", BasicRouter);

//* Socket setup


api.use((req:Request, res:Response) => {
    res.status(404).send("Invalid address.Please check the address again");
});

api.use((err:Error, req:Request, res:Response) => {
    // eslint-disable-next-line no-console
    console.error(err.stack);
    res.status(500).send("There's an error.");
});

io.on("connection", (socket:any) => {
    // socket에 연결된 이후, 해당 유저에게 방id와 이름을 저장
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


data
    .getConnection()
    .then(async () => {
        console.log("Please wait...");
        console.log("The database has been set up.\nPlease use the server!");
    })
    .catch((err:Error) => console.log(`TypeORM connection error: ${err}`));


// export default io;
