import cds, { Service, Request } from '@sap/cds';
import { Customers, Product, Products, SalesOrderHeader, SalesOrderHeaders, SalesOrderItem, SalesOrderItems } from '@models/sales';
import { customerController } from './factories/controllers/customer';
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
        const params = request.data;
        const items: SalesOrderItems = params.items;
        if(!params.customer_id) {
            return request.reject(400, 'Customer inválido');
        }
        if(!params.items || params.items?.length === 0 ) {
            return request.reject(400, 'Itens inválidos');
        }
        const customerQuery = SELECT.one.from('sales.Customers').where({ id: params.customer_id });
        const customer = await cds.run(customerQuery);
        if(!customer) {
            return request.reject(404, 'Customer não encontrado');
        }
        const productsIds: string[] = params.items.map((item: SalesOrderItem) => item.product_id);
        const productsQuery = SELECT.from('sales.Products').where({ id: productsIds });
        const products: Products = await cds.run(productsQuery);
        for(const item of items) {
            const dbProduct = products.find(product => product.id === item.product_id);
            if(!dbProduct) {
            return request.reject(404, `Produto ${item.product_id} não encontrado`);
            }
            if(dbProduct.stock === 0) {
                return request.reject(400, `Produto ${dbProduct.name}(${dbProduct.id}) sem estoque disponível`);
            }
        }
        let totalAmount = 0;
        items.forEach(item => {
            totalAmount += (item.price as number) * (item.quantity as number);
        })

        if(totalAmount > 3000) {
            const discount = totalAmount * 0.1;
            totalAmount = totalAmount - discount;
        }
        request.data.totalAmount = totalAmount;
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
