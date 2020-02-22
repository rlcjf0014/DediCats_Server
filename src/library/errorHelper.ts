import { NextFunction, Request, Response } from "express";
import { QueryFailedError } from "typeorm";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

const helper = (fn:Function) => (req:Request, res:Response, next:NextFunction) => {
    fn(req, res, next).catch(next);
};

const typeORMError = (error:Error, req:Request, res:Response, next:NextFunction) => {
    if (error instanceof QueryFailedError) res.status(400).json({ type: "QueryFailedError", message: error.message });
    next(error);
};

const jwtError = (error:Error, req:Request, res:Response, next:NextFunction) => {
    if (error instanceof TokenExpiredError) res.status(401).json({ type: "TokenExpiredError", message: error.message });
    else if (error instanceof JsonWebTokenError) res.status(400).json({ type: "JsonWebTokenError", message: error.message });
    next(error);
};

const etcError = (error:Error, req:Request, res:Response, next:NextFunction) => {
    console.log(error);
    res.status(500).json({ type: "etcError", message: error.message });
};

export {
    helper, typeORMError, jwtError, etcError,
};
