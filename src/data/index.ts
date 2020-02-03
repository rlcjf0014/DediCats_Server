// eslint-disable-next-line no-unused-vars
import { createConnection, Connection, ConnectionOptions } from "typeorm";

let connection: Connection;

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
