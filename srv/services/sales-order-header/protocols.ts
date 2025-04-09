import { SalesOrderHeader } from "@models/sales";

export type CreationPayloadValidationResult = {
    hasErrors: boolean;
    error?: Error;
    totalAmount?: number;
}

export interface SalesOrderHeaderService {
    beforeCreate(params: SalesOrderHeader): Promise<CreationPayloadValidationResult>;
}
