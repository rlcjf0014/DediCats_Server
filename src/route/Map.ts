import express from "express";
//* "location": "POINT(1 2)",
//* new wkx.Point(1, 2).toWkt();
import { getConnection, getRepository } from "typeorm";


import Cat from "../data/entity/Cat";


const router:express.Router = express.Router();

router.post("/", async (req:express.Request, res:express.Response):Promise<any> => {
    const { location } : {location:{ NElatitude : number, NElongitude : number, SWlatitude : number, SWlongitude : number }} = req.body;
    try {
        // ! follower ,  더 필요함
        const result:Array<object> = await getConnection()
            .query("select innertable.catId, innertable.catNickname, innertable.catAddress, innertable.latitude, innertable.longitude, innertable.description, photo.path as `catProfile` from (select id as `catId`, nickname as `catNickname`, address as `catAddress`, X(`location`) as `latitude`, Y(`location`) as `longitude`, description as `description` from cat ) as `innertable` left join `photo` on(innertable.catId  = photo.catId and photo.is_profile = 'Y') where innertable.latitude >= ? and innertable.latitude <= ? and innertable.longitude >= ? and innertable.longitude <= ? ;",
                [location.NElatitude, location.SWlatitude, location.NElongitude, location.SWlongitude]);

        // for (let i = 0; i < result.length; i += 1) {
        //     // eslint-disable-next-line no-await-in-loop
        //     const getFollower:Array<object> = await getRepository(Cat).createQueryBuilder("cat")
        //         .where("cat.id = :id", { id: result[i].catId })
        //         .leftJoinAndSelect("cat.users", "user")
        //         .select(["cat.id", "user.id", "user.nickname", "user.photoPath"])
        //         .getMany();
        //     if (!getFollower) {
        //         res.status(409).send("Followers not found");
        //     }

        // }
        res.status(200).send(result);
    } catch (e) {
        // eslint-disable-next-line no-console
        res.status(400).send(e);
    }
});

export default router;
