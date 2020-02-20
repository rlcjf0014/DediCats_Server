import crypto from "crypto";
import util from "util";


const getEncryPw = async (password : string, salt:string):Promise<string> => {
    const pdkdf2Promise:Function = util.promisify(crypto.pbkdf2);
    const key:Buffer = await pdkdf2Promise(password, salt, 105123, 64, "sha512");
    return key.toString("base64");
};

const getRandomByte = async ():Promise<string> => {
    const randomBytesPromise:Function = util.promisify(crypto.randomBytes);
    const buf:Buffer = await randomBytesPromise(64);
    return buf.toString("base64");
};

export { getEncryPw, getRandomByte };
