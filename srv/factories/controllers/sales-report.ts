import { SalesReportController, SalesReportControllerImpl } from '@/controllers/sales-report';
import { salesReportService } from '@/factories/services/sales-report';

export const makeSalesReportController = (): SalesReportController => {
    return new SalesReportControllerImpl(salesReportService);
};

export const salesReportController = makeSalesReportController();
