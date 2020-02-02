/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import "reflect-metadata";
import http from "http";

import api from "./api";
import data from "./data";

const PORT : any = process.env.PORT || 5000;
const server = http.createServer(api);

server.listen(PORT, () => {
    console.log(`app listen on ${PORT}`);
});

data
    .getConnection()
    .then(async (connection) => {
        return;
    })
    .catch((err) => console.log(`TypeORM connection error: ${err}`));
