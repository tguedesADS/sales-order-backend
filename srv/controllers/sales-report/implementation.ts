import { ExpectedResult as SalesReport } from '@models/db/types/SalesReport';

import { BaseControllerImpl, BaseControllerResponse } from '@/controllers/base';
import { SalesReportController } from '@/controllers/sales-report';
import { SalesReportService } from '@/services/sales-report';

export class SalesReportControllerImpl extends BaseControllerImpl implements SalesReportController {
    constructor(private readonly service: SalesReportService) {
        super();
    }

    async findByDays(days: number): Promise<BaseControllerResponse> {
        const result = await this.service.findByDays(days);
        if (result.isLeft()) {
            return this.error(result.value.code, result.value.message);
        }
        return this.sucess(result.value);
    }

    async findByCustomerId(customerId: string): Promise<SalesReport[]> {
        return this.service.findByCustomerId(customerId);
    }
}
