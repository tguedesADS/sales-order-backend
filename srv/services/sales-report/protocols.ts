import { ExpectedResult as SalesReport } from '@models/db/types/SalesReport';

export interface SalesReportService {
    findByDays(days: number): Promise<SalesReport[]>;
}
