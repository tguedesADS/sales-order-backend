import { Customers } from '@models/sales';

import { BaseControllerImpl, BaseControllerResponse } from '@/controllers/base';
import { CustomerController } from '@/controllers/customer';
import { CustomerService } from '@/services/customer';

export class CustomerControllerImpl extends BaseControllerImpl implements CustomerController {
    constructor(private readonly service: CustomerService) {
        super();
    }

    public afterRead(customerList: Customers): BaseControllerResponse {
        const result = this.service.afterRead(customerList);
        if (result.isLeft()) {
            return this.error(result.value.code, result.value.message);
        }
        return this.sucess(result.value);
    }
}
