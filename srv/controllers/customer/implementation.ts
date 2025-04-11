import { Customers } from '@models/sales';

import { CustomerController } from '@/controllers/customer';
import { CustomerService } from '@/services/customer';

export class CustomerControllerImpl implements CustomerController {
    constructor(private readonly service: CustomerService) {}

    afterRead(customerList: Customers): Customers {
        return this.service.afterRead(customerList);
    }
}
