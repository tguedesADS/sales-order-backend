import { ExpectedResult as SalesReport } from '@models/db/types/SalesReport';

import { BaseControllerResponse } from '@/controllers/base';

export interface SalesReportController {
    findByDays(days: number): Promise<BaseControllerResponse>;
    findByCustomerId(customerId: string): Promise<SalesReport[]>;
}
