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

        const start:{type:string, coordinates:Array<number>} = { type: "Point", coordinates: [startLatitude, startLongitude] };
        const end:{type:string, coordinates:Array<number>} = { type: "Point", coordinates: [endLatitude, endLongitude] };
        return { start, end };
    };

    const point:{start:object, end:object} = locationConverTer(location);

    const result:Array<object> = await getManager().createQueryBuilder(Cat, "cat")
        .where("X > 0")
        // .setParameters({
        //     startPoint: JSON.stringify(point.start),
        // })
        .getMany();

    res.status(200).send(result);
});

export default router;
