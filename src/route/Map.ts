import express from "express";
//* "location": "POINT(1 2)",
//* new wkx.Point(1, 2).toWkt();
import { getConnection } from "typeorm";
import jwt from "jsonwebtoken";

const router:express.Router = express.Router();

router.post("/", async (req:express.Request, res:express.Response):Promise<any> => {
    const { location } : {location:{ NElatitude : number, NElongitude : number, SWlatitude : number, SWlongitude : number }} = req.body;
    const accessKey:any = process.env.JWT_SECRET_ACCESS;
    const { accessToken }:{accessToken:string} = req.signedCookies;
    try {
        const decode:any = jwt.verify(accessToken, accessKey);
        const userId = decode.id;
        const result:Array<object> = await getConnection()
            .query("select jointable.*, if(isnull(following_cat.userId) , false, true) as `isFollowing` from ( select innertable.*, photo.path as `catProfile` from ( select id as `catId`, nickname as `catNickname`, address as `catAddress`, X(`location`) as `latitude`, Y(`location`) as `longitude`, description as `description`  from cat ) as `innertable` left join `photo` on (innertable.catId  = photo.catId and photo.is_profile = 'Y') where innertable.latitude <= ? and innertable.latitude >= ? and innertable.longitude <= ? and innertable.longitude >= ? ) as `jointable` left join `following_cat` on (jointable.catId = following_cat.catId and following_cat.userId = ?) ;",
                [location.NElatitude, location.SWlatitude, location.NElongitude, location.SWlongitude, userId]);
        res.status(200).send(result);
    } catch (e) {
        console.log(e);
        // eslint-disable-next-line no-console
        res.status(400).send(e);
    }
});

export default router;
