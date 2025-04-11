import { CustomerController } from '@/controllers/customer';
import { CustomerControllerImpl } from '@/controllers/customer';
import { customerService } from '@/factories/services/customer';

const makeCustomerController = (): CustomerController => {
    return new CustomerControllerImpl(customerService);
};

export const customerController = makeCustomerController();
