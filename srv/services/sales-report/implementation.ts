import { ExpectedResult as SalesReport } from '@models/db/types/SalesReport';

import { SalesReportRepository } from '@/repositories/sales-report';
import { SalesReportService } from '@/services/sales-report';

export class SalesReportServiceImpl implements SalesReportService {
    constructor(private readonly salesReportRepository: SalesReportRepository) {}

    public async findByDays(days = 7): Promise<SalesReport[]> {
        const reportData = await this.salesReportRepository.findByDays(days);
        if (!reportData) {
            return [];
        }
        return reportData.map((r) => r.toObject());
    }

    public async findByCustomerId(customerId: string): Promise<SalesReport[]> {
        const reportData = await this.salesReportRepository.findByCustomerId(customerId);
        if (!reportData) {
            return [];
        }
        return reportData.map((r) => r.toObject());
    }
}
