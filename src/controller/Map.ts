import express from "express";
import { getUserIdbyAccessToken } from "../library/jwt";
import { getCatsBylocation } from "../service/Cat";

import { helper } from "../library/Error/errorHelper";

const router:express.Router = express.Router();

router.post("/", helper(async (req:express.Request, res:express.Response, next:express.NextFunction) => {
    const { location } : {location:{ NElatitude : number, NElongitude : number, SWlatitude : number, SWlongitude : number }} = req.body;
    const { accessToken }:{accessToken:string} = req.signedCookies;
    const userId = getUserIdbyAccessToken(accessToken);
    const result:Array<object> = await getCatsBylocation(location, userId);
    res.status(200).send(result);
}));

export default router;
