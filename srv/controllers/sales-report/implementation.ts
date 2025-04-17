import { ExpectedResult as SalesReport } from '@models/db/types/SalesReport';

import { SalesReportController } from '@/controllers/sales-report';
import { SalesReportService } from '@/services/sales-report';

export class SalesReportControllerImpl implements SalesReportController {
    constructor(private readonly service: SalesReportService) {}

    async findByDays(days: number): Promise<SalesReport[]> {
        return this.service.findByDays(days);
    }

    async findByCustomerId(customerId: string): Promise<SalesReport[]> {
        return this.service.findByCustomerId(customerId);
    }
}
