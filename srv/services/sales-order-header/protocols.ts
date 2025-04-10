import { User } from "@sap/cds";

import { SalesOrderHeader, SalesOrderHeaders } from "@models/sales";

export type CreationPayloadValidationResult = {
    hasErrors: boolean;
    error?: Error;
    totalAmount?: number;
}

export interface SalesOrderHeaderService {
    beforeCreate(params: SalesOrderHeader): Promise<CreationPayloadValidationResult>;
    afterCreate(params: SalesOrderHeaders, loggedUser: User): Promise<void>;
}
