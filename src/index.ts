/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import "reflect-metadata";
import http from "http";

import typeorm from "typeorm";
import app from "./api";
import data from "./data";

import Cat from "./data/entity/Cat";
import Tag from "./data/entity/Tag";

const PORT : Number = 8000;
const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`app listen on ${PORT}`);
});

data
    .getConnection()
    .then(async (connection:typeorm.Connection) => {
        console.log("연결이 되나요?");
        const catRepository:typeorm.Repository<Cat> = connection.getRepository(Cat);
        const tagRepository:typeorm.Repository<Tag> = connection.getRepository(Tag);

        const cat = new Cat();
        // cat.location = null;
        cat.nickname = "운영냥";
        cat.cut = "YY";
        cat.rainbow = "dead";
        const testCat = await catRepository.save(cat);

        const tag = new Tag();
        tag.content = "권위적임";
        const testTag = await tagRepository.save(tag);

        console.log(testCat);
        console.log(testTag);
        // return;
    })
    .catch((err:Error) => console.log(`TypeORM connection error: ${err}`));
