import express from "express";
// import wkx from "wkx";
//* "location": "POINT(1 2)",
//* new wkx.Point(1, 2).toWkt();
import { getConnection, getRepository, getManager } from "typeorm";
import Cat from "../data/entity/Cat";

const router:express.Router = express.Router();

router.post("/", async (req:express.Request, res:express.Response):Promise<any> => {
    const { location } : {location:string} = req.body;

    const locationConverTer:Function = (locationStr:string):Object => {
        const trimLocation = locationStr.trim();
        const startPoint:string = trimLocation.substring(2, trimLocation.indexOf(")"));
        const endPoint:string = trimLocation.substring(trimLocation.lastIndexOf("(") + 1, trimLocation.lastIndexOf("))"));

        const startLatitude:number = Number(startPoint.substring(0, startPoint.indexOf(",")));
        const startLongitude:number = Number(startPoint.substring(startPoint.indexOf(",") + 1).trim());
        const endLatitude:number = Number(endPoint.substring(0, endPoint.indexOf(",")));
        const endLongitude:number = Number(endPoint.substring(endPoint.indexOf(",") + 1).trim());


        return {
            startLatitude, startLongitude, endLatitude, endLongitude,
        };
    };

    const point:{startLatitude:number, startLongitude:number, endLatitude:number, endLongitude:number} = locationConverTer(location);

    const result1:Array<object> = await getConnection()
        .query("select * from (select id as `catId`, nickname as `catNickname` , X(`location`) as `latitude`, Y(`location`) As `longitude` from cat) as `innertable` where innertable.latitude >= ? and innertable.latitude <= ? and innertable.longitude >= ? and innertable.longitude <= ? ;",
            [point.startLatitude, point.endLatitude, point.startLongitude, point.endLongitude]);

    res.status(200).send(result1);
});

export default router;
