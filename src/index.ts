/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import "reflect-metadata";
import http from "http";

import typeorm from "typeorm";
import app from "./app";
import data from "./data";

import Cat from "./data/entity/Cat";
import Tag from "./data/entity/Tag";

const PORT : Number = 5000;
const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`app listen on ${PORT}`);
});

data
    .getConnection()
    .then(async (connection:typeorm.Connection) => {
        const catRepository:typeorm.Repository<Cat> = connection.getRepository(Cat);
        const tagRepository:typeorm.Repository<Tag> = connection.getRepository(Tag);

        const cat = new Cat();
        cat.location = "(0,0)";
        cat.nickname = "운영냥";
        const testCat = await catRepository.save(cat);

        const tag = new Tag();
        tag.content = "권위적임";
        const testTag = await tagRepository.save(tag);

        console.log(testCat);
        console.log(testTag);
        // return;
    })
    .catch((err) => console.log(`TypeORM connection error: ${err}`));
