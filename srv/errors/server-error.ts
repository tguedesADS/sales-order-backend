import { AbstractError } from '@/errors';

export class ServerError extends AbstractError {
    constructor(stack: string, message = 'Internal server error') {
        super(message, 500, stack);
    }

    public get message(): string {
        return this.message;
    }
}
