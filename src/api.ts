import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import cors from "cors";
// import BasicRouter from "./route/BasicRouter";
// import catRouter from "./route/Cat";
// import commentsRouter from "./route/Comments";
// import mapRouter from "./route/Map";
// import postRouter from "./route/Post";
// import reportRouter from "./route/Report";
// import userRouter from './route/User';


const app: express.Application = express();


app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// 잘 되는것 확인했음
const add = (a: number, b: number): number => a + b;
app.get("/", (req: Request, res: Response, next: NextFunction) => {
    console.log(add(5, 5));
    res.send("Hello");
});

// app.use('/')

export default app;
