/* eslint-disable no-console */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import "reflect-metadata";
import http from "http";
import app from "./serverApi";
import data from "../data";
import User from "../data/entity/User";

const PORT : Number = 8080;
const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`app listen on ${PORT}`);
});

data
    .getConnection()
    .then(async () => {
        console.log("Please wait...");
        // const checkDB = await User.count();
        // if (!checkDB) {
        //     console.log("Error occurred during server setup.");
        // }
        console.log("Server is now connected with databse!");
    })
    .catch((err:Error) => console.log(`TypeORM connection error: ${err}`));
