import { BaseController, BaseControllerResponse } from '@/controllers/base';

export class BaseControllerImpl implements BaseController {
    public sucess(data: unknown): BaseControllerResponse {
        return {
            data,
            status: 200
        };
    }

    public error(code: number, message: string): BaseControllerResponse {
        return {
            data: message,
            status: code
        };
    }
}
