import { NextFunction, Request, Response } from "express";
import { QueryFailedError } from "typeorm";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

const helper = (fn:Function) => (req:Request, res:Response, next:NextFunction) => {
    try {
        fn(req, res, next);
    } catch (e) {
        next(e);
    }
};

const typeORMError = (error:Error, req:Request, res:Response, next:NextFunction) => {
    if (error instanceof QueryFailedError) return res.status(400).json({ type: "QueryFailedError", message: error.message });
    next(error);
};

const jwtError = (error:Error, req:Request, res:Response, next:NextFunction) => {
    if (error instanceof TokenExpiredError) return res.status(401).json({ type: "TokenExpiredError", message: error.message });
    if (error instanceof JsonWebTokenError) return res.status(400).json({ type: "JsonWebTokenError", message: error.message });
    next(error);
};

const etcError = (error:Error, req:Request, res:Response, next:NextFunction) => {
    console.log(error);
    res.status(500).json({ type: "etcError", message: error.message });
};

export {
    helper, typeORMError, jwtError, etcError,
};
