/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import cors from "cors";

import authRouter from "./route/Authentication";
import BasicRouter from "./route/BasicRouter";


const api: express.Application = express();
api.use(cors());

api.use(bodyParser.urlencoded({ extended: false }));
api.use(bodyParser.json());
api.use("/", BasicRouter);

api.use("/auth", authRouter);

api.use((req:Request, res:Response) => {
    res.status(404).send("Invalid address.Please check the address again");
});

api.use((err:Error, req:Request, res:Response, next:NextFunction) => {
    // eslint-disable-next-line no-console
    console.error(err.stack);
    res.status(500).send("Something broke!");
});


export default api;
