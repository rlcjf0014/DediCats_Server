/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import "reflect-metadata";
import http from "http";

import app from "./app";
import data from "./data";

const PORT : Number = 5000;
const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`app listen on ${PORT}`);
});

data
    .getConnection()
    .then(async (connection) => {
        return;
    })
    .catch((err) => console.log(`TypeORM connection error: ${err}`));
