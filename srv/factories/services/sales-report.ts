import { SalesReportService, SalesReportServiceImpl } from '@/services/sales-report';
import { SalesReportRepositoryImpl } from '@/repositories/sales-report';

export const makeSalesReportService = (): SalesReportService => {
    const repository = new SalesReportRepositoryImpl();
    return new SalesReportServiceImpl(repository);
};

export const salesReportService = makeSalesReportService();
