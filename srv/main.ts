import cds, { Service, Request } from '@sap/cds';
import { Customers, Product, Products, SalesOrderHeaders, SalesOrderItem, SalesOrderItems } from '@models/sales';
import { customerController } from './factories/controllers/customer';
import { salesOrderHeaderController } from './factories/controllers/sales-order-header';
import { FullResquetParams } from './routes/protocols';
export default (srv: Service) => {
    srv.before('READ', '*', (request: Request) => {
        if(!request.user.is('read_only_user')) {
            return request.reject(403, 'Não autorizado');
        }
    });
    srv.before(['WRITE', 'DELETE'], '*', (request: Request) => {
        if(!request.user.is('admin')) {
            return request.reject(403, 'Não autorizada a escrita/deleção');
        }
    });
    srv.after('READ', 'Customers', (customersList: Customers, request) => {
       (request as unknown as FullResquetParams<Customers>).results = customerController.afterRead(customersList);
    });
    srv.before('CREATE', 'SalesOrderHeaders', async (request: Request) => {
        const result =  await salesOrderHeaderController.beforeCreate(request.data);
        if(result.hasErrors) {
            return request.reject(400, result.error?.message as string);
        }
        request.data.totalAmount = result.totalAmount;
    });
    srv.after('CREATE', 'SalesOrderHeaders', async (results: SalesOrderHeaders, request: Request) => {
        const headersAsArray = Array.isArray(results) ? results : [results] as SalesOrderHeaders;
        for (const header of headersAsArray) {
            const items = header.items as SalesOrderItems;
            const productsData = items.map(item => ({
                id: item.product_id as string,
                quantity: item.quantity as number
            }));
            const productsIds: string[] = productsData.map((productsData) => productsData.id);
            const productsQuery = SELECT.from('sales.Products').where({ id: productsIds });
            const products: Products = await cds.run(productsQuery);
            for(const productData of productsData) {
                const foundProduct = products.find(product => product.id === productData.id) as Product;
                foundProduct.stock = (foundProduct.stock as number) - productData.quantity;
                await cds.update('sales.Products').where({ id: foundProduct.id }).with({ stock: foundProduct.stock });
            }
            const headersAsStrings = JSON.stringify(header);
            const userAsStrings = JSON.stringify(request.user);
            const log = [{
                header_id: header.id,
                userData: userAsStrings,
                orderData: headersAsStrings,
            }];
            await cds.create('sales.SalesOrderLogs').entries(log);
        }
    });
}
