import express from "express";
//* "location": "POINT(1 2)",
//* new wkx.Point(1, 2).toWkt();
import { getUserIdbyAccessToken } from "../library/jwt";
import { getCatsBylocation } from "../service/Cat";

const router:express.Router = express.Router();

router.post("/", async (req:express.Request, res:express.Response):Promise<any> => {
    const { location } : {location:{ NElatitude : number, NElongitude : number, SWlatitude : number, SWlongitude : number }} = req.body;
    const { accessToken }:{accessToken:string} = req.signedCookies;
    try {
        const userId = getUserIdbyAccessToken(accessToken);
        const result:Array<object> = await getCatsBylocation(location, userId);
        res.status(200).send(result);
    } catch (e) {
        console.log(e);
        // eslint-disable-next-line no-console
        res.status(400).send(e);
    }
});

export default router;
