import express, { response } from "express";
import {
    getConnection, InsertResult, UpdateResult,
} from "typeorm";
import User from "../data/entity/User";
// import storage from "../data/storage";

const router:express.Router = express.Router();

// router.get("/", (req:express.Request, res:express.Response) => {
//     const reqData = req.body;
//     // 타입 지정시  const defunt: PersoneModel = res.body; 형태로 사용
//     console.log(`server received POST req from ip: ${req.ip}. data is ${reqData}`);
// });

router.post("/signin", (req:express.Request, res:express.Response) => {
    const { email, password }:{email:string, password:string} = req.body;

    // response
    // {   "userId" : user_id, "nickname" : nickname, "created_at": Date, "user_photo": binaryData }
});

router.post("/signup", async (req:express.Request, res:express.Response) => {
    const { email, password, nickname }:{email:string, password:string, nickname:string} = req.body;
    try {
        const checkEmail:number = await User.count({ where: { email } });
        if (checkEmail) {
            res.status(202).send("User already exists.");
            return;
        }
        const result:InsertResult = await getConnection().createQueryBuilder().insert().into(User)
            .values({
                nickname, email, password, status: "Y",
            })
            .execute();

        if (result.raw.affectedRows) {
            const returnmessage:object = { userId: result.identifiers[0].id, email, nickname };
            res.status(201).send(JSON.stringify(returnmessage));
            return;
        }

        res.status(404).send("User creation failed");
    } catch (e) {
        console.log(e);
        res.status(400).send("There is an error while deleting the comments in the server.");
    }
});

// ! 비밀번호 확인단계필요 ( 비밀번호 보안 필요함! )
router.patch("/changepw", async (req:express.Request, res:express.Response) => {
    try {
        const { userId, password, newPassword }:{userId:number, password:string, newPassword:string } = req.body;
        const result:UpdateResult = await getConnection().createQueryBuilder().update(User).set({ password: newPassword })
            .where({ id: userId })
            .execute();

        if (result.raw.changedRows) {
            res.status(201).send("password successfully changed");
            return;
        }

        res.status(404).send("Failed to change user password");
    } catch (e) {
        console.log(e);
        res.status(400).send("There is an error while updating the paasword in the server.");
    }
});

// Sign out
router.post("/signout", (req:express.Request, res:express.Response) => {
    const { userId }:{userId:number} = req.body;

    // response
    // {"message": "Successfully signed out!"}
});


export default router;
