import express, { response } from "express";
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
            res.status(205).send("already existing user");
            return;
        }

        const user:User = new User();
        user.email = email;
        user.password = password;
        user.nickname = nickname;
        user.status = "Y";

        const result = await User.save(user);
        if (result) {
            const returnmessage:object = { userId: result.id, email: result.email, nickname: result.nickname };
            res.status(201).send(JSON.stringify(returnmessage));
            return;
        }
        res.status(409).send("회원가입에 실패하였습니다.");
    } catch (e) {
        res.status(500).send(JSON.stringify(e));
    }
});

// ! 비밀번호 확인단계필요 ( 비밀번호 보안 필요함! )
router.patch("/changepw", async (req:express.Request, res:express.Response) => {
    try {
        const { userId, password, newPassword }:{userId:number, password:string, newPassword:string } = req.body;
        const result:any = await User.update({ id: userId }, { password: newPassword });

        if (result.raw.changedRows) {
            const returnmessage:object = { message: "password successfully changed" };
            res.status(201).send(JSON.stringify(returnmessage));
        }
    } catch (e) {
        res.status(500).send(" { message: 'password successfully changed' }");
    }
});

// Sign out
router.post("/signout", (req:express.Request, res:express.Response) => {
    const { userId }:{userId:number} = req.body;

    // response
    // {"message": "Successfully signed out!"}
});


export default router;
