import { HttpException } from "./root";

export class InternalException extends HttpException {
    constructor(message: string,errors:any, errorCode: number) {
        super(message, errorCode, 500, errors);
        this.name = "InternalException";
        this.message = message;
        this.errorCode = errorCode;
    }
}