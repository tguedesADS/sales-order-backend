import { Service } from '@sap/cds';
import { Customers } from '@models/sales';

export default (srv: Service) => {
    srv.after('READ', 'Customers', (results: Customers) => {
        results.forEach(customer => {
            if (!customer.email?.includes('@')) {
                customer.email = `${customer.email}@gmail.com`;
            }
        });
    });
}
