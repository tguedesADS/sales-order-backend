import { Either } from '@sweet-monads/either';

import { ExpectedResult as SalesReport } from '@models/db/types/SalesReport';

import { AbstractError } from '@/errors';
export interface SalesReportService {
    findByDays(days: number): Promise<Either<AbstractError, SalesReport[]>>;
    findByCustomerId(customerId: string): Promise<Either<AbstractError, SalesReport[]>>;
}
