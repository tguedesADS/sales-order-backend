import { Either, left, right } from '@sweet-monads/either';

import { ExpectedResult as SalesReport } from '@models/db/types/SalesReport';

import { AbstractError, NotFoundError, ServerError } from '@/errors';
import { SalesReportRepository } from '@/repositories/sales-report';
import { SalesReportService } from '@/services/sales-report';

export class SalesReportServiceImpl implements SalesReportService {
    constructor(private readonly salesReportRepository: SalesReportRepository) {}

    public async findByDays(days = 7): Promise<Either<AbstractError, SalesReport[]>> {
        try {
            const reportData = await this.salesReportRepository.findByDays(days);
            if (!reportData) {
                const stack = new Error().stack as string;
                return left(new NotFoundError('Nenhum dado encontrado para o período selecionado', stack));
            }
            const mappedData = reportData.map((r) => r.toObject());
            return right(mappedData);
        } catch (error) {
            const errorInstance = error as Error;
            return left(new ServerError(errorInstance.stack as string, errorInstance.message));
        }
    }

    public async findByCustomerId(customerId: string): Promise<SalesReport[]> {
        const reportData = await this.salesReportRepository.findByCustomerId(customerId);
        if (!reportData) {
            return [];
        }
        return reportData.map((r) => r.toObject());
    }
}
