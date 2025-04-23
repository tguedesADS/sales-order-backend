import { SalesOrderItemModel } from '@/models/sales-order-item';

type SalesOrderHeaderProps = {
    id: string;
    customerId: string;
    totalAmount: number;
    items: SalesOrderItemModel[];
};

type SalesOrderHeaderPropsWithIdAndTotalAmount = Omit<SalesOrderHeaderProps, 'id' | 'totalAmount'>;

type SalesOrderHeaderPropsWithSnakeCaseCustomerId = Omit<SalesOrderHeaderProps, 'customerId'> & {
    customer_id: SalesOrderHeaderProps['customerId'];
};

type CreationPayload = {
    customer_id: SalesOrderHeaderProps['customerId'];
};

type CreationPayloadValidationResult = {
    hasErrors: boolean;
    error?: Error;
};

export class SalesOrderHeaderModel {
    constructor(private props: SalesOrderHeaderProps) {}

    public static create(props: SalesOrderHeaderPropsWithIdAndTotalAmount): SalesOrderHeaderModel {
        return new SalesOrderHeaderModel({
            ...props,
            id: crypto.randomUUID(),
            totalAmount: 0
        });
    }

    public static with(props: SalesOrderHeaderProps): SalesOrderHeaderModel {
        return new SalesOrderHeaderModel(props);
    }

    public get id() {
        return this.props.id;
    }

    public get customerId() {
        return this.props.customerId;
    }

    public get totalAmount() {
        return this.props.totalAmount;
    }

    public get items() {
        return this.props.items;
    }

    public set totalAmount(amount: number) {
        this.totalAmount = amount;
    }

    public validateCreationPayload(params: CreationPayload): CreationPayloadValidationResult {
        const customerValidationResult = this.validateCustomerOnCreation(params.customer_id);
        if (customerValidationResult.hasErrors) {
            return customerValidationResult;
        }
        const itemsValidationResult = this.validateItemsOnCreation(this.items);
        if (itemsValidationResult.hasErrors) {
            return itemsValidationResult;
        }
        return {
            hasErrors: false
        };
    }

    private validateCustomerOnCreation(customerId: CreationPayload['customer_id']): CreationPayloadValidationResult {
        if (!customerId) {
            return {
                hasErrors: true,
                error: new Error('Customer inválido')
            };
        }
        return {
            hasErrors: false
        };
    }

    private validateItemsOnCreation(items: SalesOrderHeaderProps['items']): CreationPayloadValidationResult {
        if (!items || items?.length === 0) {
            return {
                hasErrors: true,
                error: new Error('Itens inválidos')
            };
        }
        const itemsErros: string[] = [];
        items.forEach((item) => {
            const validationResult = item.validateCreationPayload({ product_id: item.productId });
            if (validationResult.hasErrors) {
                itemsErros.push(validationResult.error?.message as string);
            }
        });
        if (itemsErros.length > 0) {
            const messages = itemsErros.join('\n - ');
            return {
                hasErrors: true,
                error: new Error(messages)
            };
        }
        return {
            hasErrors: false
        };
    }

    public calculateTotalAmount(): number {
        let totalAmount = 0;
        this.items.forEach((item) => {
            totalAmount += (item.price as number) * (item.quantity as number);
        });
        return totalAmount;
    }

    public calculateDiscount(): number {
        let totalAmount = this.calculateTotalAmount();
        if (totalAmount > 3000) {
            const discount = totalAmount * 0.1;
            totalAmount = totalAmount - discount;
        }
        return totalAmount;
    }

    public getProductsData(): { id: string; quantity: number }[] {
        return this.items.map((item) => ({
            id: item.productId,
            quantity: item.quantity
        }));
    }

    public toStringifiedObject(): string {
        return JSON.stringify(this.props);
    }

    public toCreationObject(): SalesOrderHeaderPropsWithSnakeCaseCustomerId {
        return {
            id: this.props.id,
            customer_id: this.props.customerId,
            totalAmount: this.calculateDiscount(),
            items: this.props.items
        };
    }
}
