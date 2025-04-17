import { ExpectedResult as SalesReportByDays } from '@models/db/types/SalesReportByDays';

import { SaleReportController } from '@/controllers/sales-report';
import { SalesReportService } from '@/services/sales-report';

export class SalesReportControllerImpl implements SaleReportController {
    constructor(private readonly service: SalesReportService) {}

    async findByDays(days: number): Promise<SalesReportByDays[]> {
        return this.service.findByDays(days);
    }
}
