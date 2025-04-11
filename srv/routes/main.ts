import '../configs/module-alias';

import { Request, Service } from '@sap/cds';

import { Customers, SalesOrderHeaders } from '@models/sales';

import { FullResquetParams } from '@/routes/protocols';
import { customerController } from '@/factories/controllers/customer';
import { salesOrderHeaderController } from '@/factories/controllers/sales-order-header';

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
        (request as unknown as FullResquetParams<Customers>).results = customerController.afterRead(customersList);
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
};
