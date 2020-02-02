import { createConnection, Connection } from "typeorm";

let connection: Connection;

const getConnection = async (): Promise<Connection> => {
    try {
        if (!(connection instanceof Connection)) {
            connection = await createConnection();
        }
    } catch (err) {
        console.error(err);
        throw err;
    }
    return connection;
};

export default getConnection;
