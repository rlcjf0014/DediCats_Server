
require("dotenv").config();
const AWS = require("aws-sdk");
// const fs = require("fs");

const { ID } = process.env;
const { SECRET } = process.env;

const { BUCKET_NAME } = process.env;

const s3 = new AWS.S3({
    accessKeyId: ID,
    secretAccessKey: SECRET,
    region: "ap-northeast-2",
});

// eslint-disable-next-line func-names
export default function deleteFile(key:string):Promise<boolean|unknown> {
    return new Promise(((resolve, reject) => {
        // ? ContentType:
        //* MIME 타입이다. 파일에서 확장자가 없을 때는 반드시 MIME 타입을 설정해야 합니다. 확장자가 있는 파일은 확장자에 따라 자동으로 설정되므로 이 항목을 설정하지 않아도 된다.
        //* 하지만 HTTP에서 주로 사용하는 확장자가 아닐 때는 자동으로 설정되지 않으므로 MIME 타입을 설정해주어야 한다.
        s3.deleteObject({
            Bucket: BUCKET_NAME,
            Key: key,
        }, (err:Error, data:any) => {
            if (err) {
                reject(err);
            }
            resolve(true);
        });
    }));
}


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
