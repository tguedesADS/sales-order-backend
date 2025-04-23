import { SalesOrderHeaderService, SalesOrderHeaderServiceImpl } from '@/services/sales-order-header';
import { CustomerRepositoryImpl } from '@/repositories/customer';
import { ProductRepositoryImpl } from '@/repositories/product';
import { SalesOrderHeaderRepositoryImpl } from '@/repositories/sales-order-header';
import { SalesOrderLogRepositoryImpl } from '@/repositories/sales-order-log';

export const makeSalesOrderHeaderService = (): SalesOrderHeaderService => {
    const salesOrderHeaderRepository = new SalesOrderHeaderRepositoryImpl();
    const customerRepository = new CustomerRepositoryImpl();
    const salesOrderLogRepository = new SalesOrderLogRepositoryImpl();
    const productRepository = new ProductRepositoryImpl();

    return new SalesOrderHeaderServiceImpl(
        salesOrderHeaderRepository,
        customerRepository,
        salesOrderLogRepository,
        productRepository
    );
};

export const salesOrderHeaderService = makeSalesOrderHeaderService();
