import express, {
    Application, Request, Response, NextFunction,
} from "express";
import bodyParser from "body-parser";
import cors from "cors";


const app: Application = express();


app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

const add = (a: number, b: number): number => a + b;

app.get("/", (req: Request, res: Response, next: NextFunction) => {
    console.log(add(5, 5));
    res.send("Hello");
});

export default app;
