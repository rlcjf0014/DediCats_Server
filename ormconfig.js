require("dotenv").config();


module.exports = {
    type: "mariadb",
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "1234",
    charset: "utf8mb4",
    database: process.env.DB_NAME || "cats",
    synchronize: true,
    logging: false,
    entities: [
        "dist/model/entity/*.js",
    ],
    migrations: [
        "dist/model/migration/**/*.js",
    ],
    subscribers: [
        "dist/model/subscriber/**/*.js",
    ],
    cli: {
        entitiesDir: "dist/model/entity",
        migrationsDir: "dist/model/migration",
        subscribersDir: "dist/model/subscriber",
    },
};
