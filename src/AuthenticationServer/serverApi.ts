/* eslint-disable no-unused-vars */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Authentication, BasicRouter } from "../route";
import { typeORMError, jwtError, etcError } from "../library/errorHelper";

require("dotenv").config();

const api: express.Application = express();
api.use(cors());

api.use(bodyParser.urlencoded({ extended: false }));
api.use(bodyParser.json());
api.use(cookieParser(process.env.TOKEN_KEY));

api.use("/auth", Authentication);
api.use("/", BasicRouter);

api.use((req:Request, res:Response) => {
    res.status(404).send("Invalid auth address.Please check the address again");
});

api.use((err:Error, req:Request, res:Response, next:NextFunction) => {
    // eslint-disable-next-line no-console
    console.error(err.stack);
    res.status(500).send("Something broke!");
});

api.use(typeORMError);
api.use(jwtError);
api.use(etcError);

export default api;
