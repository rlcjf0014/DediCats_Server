require("dotenv").config();


module.exports = {
    type: "mariadb",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "rlcjf0014",
    charset: "utf8mb4",
    database: "cats",
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
