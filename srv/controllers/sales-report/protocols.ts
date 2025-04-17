import { ExpectedResult as SalesReport } from '@models/db/types/SalesReport';

export interface SalesReportController {
    findByDays(days: number): Promise<SalesReport[]>;
}
