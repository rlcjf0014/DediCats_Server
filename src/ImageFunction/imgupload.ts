import { Any } from "typeorm";

require("dotenv").config();
const AWS = require("aws-sdk");
const fs = require("fs");

const { ID } = process.env;
const { SECRET } = process.env;

const { BUCKET_NAME } = process.env;

const s3 = new AWS.S3({
    accessKeyId: ID,
    secretAccessKey: SECRET,
    region: "ap-northeast-2",
});

// eslint-disable-next-line func-names
export default function uploadFile(imageName: string, imageData:string) {
    return new Promise(((resolve, reject) => {
        // eslint-disable-next-line new-cap
        // eslint-disable-next-line no-buffer-constructor
        // eslint-disable-next-line new-cap
        // eslint-disable-next-line new-cap
        // @ts-ignore
        const base64Data:string = new Buffer.from(imageData.replace(/^data:image\/\w+;base64,/, ""), "base64");
        // const buf = new Buffer(imageData.replace(/^data:image\/\w+;base64,/, ""),"base64")
        const params:{Bucket:any, ACL:string, ContentType:string, Key: string, Body:any} = {
            Bucket: BUCKET_NAME,
            ACL: "public-read",
            ContentType: "image/jpeg",
            Key: imageName,
            Body: base64Data,
        };
        // ? ContentType:
        //* MIME 타입이다. 파일에서 확장자가 없을 때는 반드시 MIME 타입을 설정해야 합니다. 확장자가 있는 파일은 확장자에 따라 자동으로 설정되므로 이 항목을 설정하지 않아도 된다.
        //* 하지만 HTTP에서 주로 사용하는 확장자가 아닐 때는 자동으로 설정되지 않으므로 MIME 타입을 설정해주어야 한다.
        s3.upload(params, (err:Error, data:any) => {
            if (err) {
                reject(err);
            }
            console.log(`File uploaded successfully. ${data.Location}`);
            if (!data.Location) {
                resolve(false);
            }
            resolve(data.Location);
        });
    }));
}

//! svg test

// export default uploadFile;

//! npx tsc index.ts && node index.js

//! 버켓 만드는 법
// s3.createBucket(params, (err:any, data:any) => {
//     if (err) {
//         console.log(err, err.stack);
//     } else {
//         console.log(data)
//         console.log("Bucket Created Successfully", data.location);
//     }
// });
