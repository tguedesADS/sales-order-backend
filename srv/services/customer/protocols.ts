import { AbstractError } from '@/errors';
import { Customers } from '@models/sales';
import { Either } from '@sweet-monads/either';

export interface CustomerService {
    afterRead(customerList: Customers): Either<AbstractError, Customers>;
}
