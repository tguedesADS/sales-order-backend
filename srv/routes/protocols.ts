import { Request } from '@sap/cds';

export type FullResquetParams<ExpectedResults> = Request & {
    results: ExpectedResults;
}
