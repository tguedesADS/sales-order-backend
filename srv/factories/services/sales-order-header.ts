import { CustomerRepositoryImpl } from "srv/repositories/customer/implementation";
import { ProductRepositoryImpl } from "srv/repositories/product/implementation";
import { SalesOrderLogRepositoryImpl } from "srv/repositories/sales-order-log/implementation";
import { SalesOrderHeaderServiceImpl } from "srv/services/sales-order-header/implementation";
import { SalesOrderHeaderService } from "srv/services/sales-order-header/protocols";

export const makeSalesOrderHeaderService = (): SalesOrderHeaderService => {
    const customerRepository = new CustomerRepositoryImpl();
    const salesOrderLogRepository = new SalesOrderLogRepositoryImpl();
    const productRepository = new ProductRepositoryImpl();
    return new SalesOrderHeaderServiceImpl(
        customerRepository,
        salesOrderLogRepository,
        productRepository
    );
}

export const salesOrderHeaderService = makeSalesOrderHeaderService();
