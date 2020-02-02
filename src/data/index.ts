// eslint-disable-next-line no-unused-vars
import { createConnection, Connection, ConnectionOptions } from "typeorm";


// const options: ConnectionOptions = {
//     type: "mariadb",
//     host: "localhost",
//     port: 5000,
//     username: "root",
//     password: "rlcjf0014",
//     database: "cats",
//     synchronize: true,
//     logging: false,
//     entities: [
//         "src/data/entity/**/*.js",
//     ],
//     migrations: [
//         "src/data/migration/**/*.js",
//     ],
//     subscribers: [
//         "src/data/subscriber/**/*.js",
//     ],
//     cli: {
//         entitiesDir: "dist/data/entity",
//         migrationsDir: "dist/data/migration",
//         subscribersDir: "dist/data/subscriber",
//     },
// };


let connection: Connection;


// createConnection().then(async connection => {
//     console.log("working1")
// }).catch(error => console.log(error));


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

export default { getConnection };
