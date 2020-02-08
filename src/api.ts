/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import compression from "compression";

import BasicRouter from "./route/BasicRouter";
import catRouter from "./route/Cat";
import commentRouter from "./route/Comment";
import mapRouter from "./route/Map";
import photoRouter from "./route/Photo";
import postRouter from "./route/Post";
import reportRouter from "./route/Report";
import userRouter from "./route/User";


const api: express.Application = express();


api.use(cors());
api.use(bodyParser.urlencoded({ extended: false }));
api.use(bodyParser.json());
api.use(compression());

api.use("/cat", catRouter);
api.use("/comment", commentRouter);
api.use("/map", mapRouter);
api.use("/photo", photoRouter);
api.use("/post", postRouter);
api.use("/report", reportRouter);
api.use("/user", userRouter);
api.use("/", BasicRouter);

api.use((req:Request, res:Response) => {
    res.status(404).send("Invalid address.Please check the address again");
});

api.use((err:Error, req:Request, res:Response, next:NextFunction) => {
    // eslint-disable-next-line no-console
    console.error(err.stack);
    res.status(500).send("Something broke!");
});

export default api;
