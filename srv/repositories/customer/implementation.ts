import cds from '@sap/cds';

import { CustomerModel, CustomerProps } from '@/models/customer';
import { CustomerRepository } from '@/repositories/customer';

export class CustomerRepositoryImpl implements CustomerRepository {
    async findById(id: CustomerProps['id']): Promise<CustomerModel | null> {
        const customerQuery = SELECT.one.from('sales.Customers').where({ id });
        const dbCustomer = await cds.run(customerQuery);
        if (!dbCustomer) {
            return null;
        }
        return CustomerModel.with({
            id: dbCustomer.id as string,
            firstName: dbCustomer.firstName as string,
            lastName: dbCustomer.lastName as string,
            email: dbCustomer.email as string
        });
    }
}
