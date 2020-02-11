import express from "express";
//* "location": "POINT(1 2)",
//* new wkx.Point(1, 2).toWkt();
import { getConnection } from "typeorm";

const router:express.Router = express.Router();

router.post("/", async (req:express.Request, res:express.Response):Promise<any> => {
    const { location } : {location:{ NElatitude : number, NElongitude : number, SWlatitude : number, SWlongitude : number }} = req.body;
    try {
        // ! description , follower , photo , address point 더 필요함
        const result:Array<object> = await getConnection()
            .query("select * from (select id as `catId`, nickname as `catNickname` , X(`location`) as `latitude`, Y(`location`) As `longitude` from cat) as `innertable` where innertable.latitude >= ? and innertable.latitude <= ? and innertable.longitude >= ? and innertable.longitude <= ? ;",
                [location.NElatitude, location.SWlatitude, location.NElongitude, location.SWlongitude]);
        res.status(200).send(result);
    } catch (e) {
        // eslint-disable-next-line no-console
        res.status(400).send(e);
    }
});

export default router;
