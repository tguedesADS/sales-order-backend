/* eslint-disable max-lines-per-function */
import '../configs/module-alias';

import { Request, Service } from '@sap/cds';

import { Customers, SalesOrderHeaders } from '@models/sales';

import { FullResquetParams } from '@/routes/protocols';
import { customerController } from '@/factories/controllers/customer';
import { salesOrderHeaderController } from '@/factories/controllers/sales-order-header';
import { salesReportController } from '@/factories/controllers/sales-report';

export default (srv: Service) => {
    srv.before('READ', '*', (request: Request) => {
        if (!request.user.is('read_only_user')) {
            return request.reject(403, 'Não autorizado');
        }
    });
    srv.before(['WRITE', 'DELETE'], '*', (request: Request) => {
        if (!request.user.is('admin')) {
            return request.reject(403, 'Não autorizada a escrita/deleção');
        }
    });
    srv.after('READ', 'Customers', (customersList: Customers, request) => {
        const result = customerController.afterRead(customersList);
        if (result.status >= 400) {
            return request.error(result.status, result.data as string);
        }
        (request as unknown as FullResquetParams<Customers>).results = result.data as Customers;
    });
    srv.before('CREATE', 'SalesOrderHeaders', async (request: Request) => {
        const result = await salesOrderHeaderController.beforeCreate(request.data);
        if (result.hasErrors) {
            return request.reject(400, result.error?.message as string);
        }
        request.data.totalAmount = result.totalAmount;
    });
    srv.after('CREATE', 'SalesOrderHeaders', async (headers: SalesOrderHeaders, request: Request) => {
        await salesOrderHeaderController.afterCreate(headers, request.user);
    });
    srv.on('getSalesReportByDays', async (request: Request) => {
        const days = request.data?.days || 7;
        const result = await salesReportController.findByDays(days);
        if (result.status >= 400) {
            return request.error(result.status, result.data as string);
        }
        return result.data;
    });
    srv.on('getSalesReportByCustomerId', async (request: Request) => {
        const [{ id: customerId }] = request.params as unknown as { id: string }[];
        const result = await salesReportController.findByCustomerId(customerId);
        if (result.status >= 400) {
            return request.error(result.status, result.data as string);
        }
        return result.data;
    });
    srv.on('bulkCreateSalesOrder', async (request: Request) => {
        const { user, data } = request;
        return salesOrderHeaderController.bulkCreate(data.payload, user);
    });
    srv.on('cloneSalesOrder', async (request: Request) => {
        const [{ id }] = request.params as unknown as { id: string }[];
        const { user } = request;
        return salesOrderHeaderController.cloneSalesOrder(id, user);
    });
};
