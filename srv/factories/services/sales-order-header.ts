import { SalesOrderHeaderService, SalesOrderHeaderServiceImpl } from '@/services/sales-order-header';
import { CustomerRepositoryImpl } from '@/repositories/customer';
import { ProductRepositoryImpl } from '@/repositories/product';
import { SalesOrderLogRepositoryImpl } from '@/repositories/sales-order-log';

export const makeSalesOrderHeaderService = (): SalesOrderHeaderService => {
    const customerRepository = new CustomerRepositoryImpl();
    const salesOrderLogRepository = new SalesOrderLogRepositoryImpl();
    const productRepository = new ProductRepositoryImpl();
    return new SalesOrderHeaderServiceImpl(customerRepository, salesOrderLogRepository, productRepository);
};

export const salesOrderHeaderService = makeSalesOrderHeaderService();
