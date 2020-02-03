/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import "reflect-metadata";
import http from "http";
import wkt from "terraformer-wkt-parser";
import wkx from "wkx";

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
        const catRepository:typeorm.Repository<Cat> = connection.getRepository(Cat);
        const tagRepository:typeorm.Repository<Tag> = connection.getRepository(Tag);

        
        const cat = new Cat();
        // const venue = wkt.parse('POINT(15 20');
        cat.location = wkt.convert{
            "type": "Point",
            "coordinates": [10, 10]
        };
        cat.nickname = "고냥이";
        cat.cut = "YY";
        cat.rainbow = "dead";
        const testCat = await catRepository.save(cat);

        const tag = new Tag();
        tag.content = "dominant";
        const testTag = await tagRepository.save(tag);

        console.log(testCat);
        console.log(testTag);
        // return;
    })
    // eslint-disable-next-line no-console
    .catch((err: any) => console.log(`TypeORM connection error: ${err}`));
