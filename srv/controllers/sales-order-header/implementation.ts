import { SalesOrderHeaderService } from "srv/services/sales-order-header/protocols";
import { CreationPayloadValidationResult, SalesOrderHeaderController } from "./protocols";
import { SalesOrderHeader } from "@models/sales";

export class SalesOrderHeaderControllerImpl implements SalesOrderHeaderController {
    constructor(
        private readonly service: SalesOrderHeaderService
    ) {}

    public async beforeCreate(params: SalesOrderHeader): Promise<CreationPayloadValidationResult> {
        return this.service.beforeCreate(params);
    }
}
