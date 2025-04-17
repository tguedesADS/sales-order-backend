import { ExpectedResult as SalesReportByDays } from '@models/db/types/SalesReportByDays';

import { SalesReportRepository } from '@/repositories/sales-report';
import { SalesReportService } from '@/services/sales-report';

export class SalesReportServiceImpl implements SalesReportService {
    constructor(private readonly salesReportRepository: SalesReportRepository) {}

    public async findByDays(days = 7): Promise<SalesReportByDays[]> {
        const reportData = await this.salesReportRepository.findByDays(days);
        if (!reportData) {
            return [];
        }
        return reportData.map((r) => r.toObject());
    }
}
