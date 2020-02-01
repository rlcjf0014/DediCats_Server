import "reflect-metadata";
import { createConnection } from "typeorm";
// import * as express from "express";
import express, {
    Application, Request, Response, NextFunction,
} from "express";
import bodyParser from "body-parser";
// import * as logger from "morgan";
// import { AppRoutes } from "./routes";

createConnection()
    .then(async connection => {
    // const app = express();
    // Register application routes
    // AppRoutes.forEach(route => {
    //   app[route.method](
    //     route.path,
    //     (req: Request, res: Response, next: Function) => {
    //       route
    //       .action(req, res)
    //       .then(() => next)
    //       .catch(err => next(err));
    //     }
    //     );
    //   });

        const app = express();
        const port: number = 5000;
        app.use(bodyParser.json());
        // app.use(logger("dev"));


        const add = (a: number, b: number): number => a + b;

        // eslint-disable-next-line no-unused-vars
        app.get("/", (req: Request, res: Response, next: NextFunction) => {
            console.log(add(5, 5));
            res.send("Hello");
        });
        // Run app
        app.listen(port, () => {
            console.log("Express application is up ansd running on port 5000");
        });
    })
    .catch((err) => console.log(`TypeORM connection error: ${err}`));
