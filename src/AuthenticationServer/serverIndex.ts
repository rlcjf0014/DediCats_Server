/* eslint-disable no-console */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import "reflect-metadata";
import http from "http";
import { createConnection, Connection } from "typeorm";
import app from "./serverApi";


const PORT : Number = 8080;
const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`app listen on ${PORT}`);
});

let connection:Connection;

const getConnection = async (): Promise<Connection> => {
    try {
        if (!(connection instanceof Connection)) {
            connection = await createConnection();
        }
    } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
        throw err;
    }
    return connection;
};

getConnection()
    .then(async () => {
        console.log("Please wait...");
        console.log("The database has been set up.\nPlease use the server!");
    })
    .catch((err:Error) => console.log(`TypeORM connection error: ${err}`));
