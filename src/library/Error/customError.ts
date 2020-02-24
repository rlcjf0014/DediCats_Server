export default class CustomError extends Error {
    type: string;

    status: number;

    constructor(type = "GENERIC", status = 500, message = "default error", ...params: any) {
        super(...params);

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, CustomError);
        }

        this.type = type;
        this.status = status;
        this.message = message;
    }
}
