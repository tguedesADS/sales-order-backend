import { User } from '@sap/cds';

import { SalesOrderHeader, SalesOrderHeaders } from '@models/sales';
import { Payload as BulkCreateSalesOrderPayload } from '@models/db/types/BulkCreateSalesOrder';

import { CreationPayloadValidationResult, SalesOrderHeaderService } from '@/services/sales-order-header';
import { CustomerModel } from '@/models/customer';
import { CustomerRepository } from '@/repositories/customer';
import { LoggedUserModel } from '@/models/logged-user';
import { ProductModel } from '@/models/product';
import { ProductRepository } from '@/repositories/product';
import { SalesOrderHeaderModel } from '@/models/sales-order-header';
import { SalesOrderHeaderRepository } from '@/repositories/sales-order-header';
import { SalesOrderItemModel } from '@/models/sales-order-item';
import { SalesOrderLogModel } from '@/models/sales-order-log';
import { SalesOrderLogRepository } from '@/repositories/sales-order-log';

export class SalesOrderHeaderServiceImpl implements SalesOrderHeaderService {
    constructor(
        private readonly salesOrderHeaderRepository: SalesOrderHeaderRepository,
        private readonly customerRepository: CustomerRepository,
        private readonly salesOrderLogRepository: SalesOrderLogRepository,
        private readonly productRepository: ProductRepository
    ) {}

    public async beforeCreate(params: SalesOrderHeader): Promise<CreationPayloadValidationResult> {
        const productsValidationResult = await this.validateProductsOnCreation(params);
        if (productsValidationResult.hasErrors) {
            return productsValidationResult;
        }
        const items = this.getSalesOrderItems(params, productsValidationResult.products as ProductModel[]);
        const header = this.getSalesOrderHeader(params, items);
        const customerValidationResult = await this.validateCustomerOnCreation(params);
        if (customerValidationResult.hasErrors) {
            return customerValidationResult;
        }
        const headerValidationResult = header.validateCreationPayload({
            customer_id: (customerValidationResult.customer as CustomerModel).id
        });
        if (headerValidationResult.hasErrors) {
            return headerValidationResult;
        }
        return {
            hasErrors: false,
            totalAmount: header.calculateDiscount()
        };
    }

    public async afterCreate(
        params: SalesOrderHeaders | BulkCreateSalesOrderPayload[],
        loggedUser: User
    ): Promise<void> {
        const headersAsArray = Array.isArray(params) ? params : ([params] as SalesOrderHeaders);
        const logs: SalesOrderLogModel[] = [];
        for (const header of headersAsArray) {
            const products = (await this.getProductsByIds(header)) as ProductModel[];
            const items = this.getSalesOrderItems(header, products);
            const salesOrderHeader = this.getExistingSalesOrderHeader(header, items);
            const productsData = salesOrderHeader.getProductsData();
            for (const product of products) {
                const foundProduct = productsData.find((productData) => productData.id === product.id);
                product.sell(foundProduct?.quantity as number);
                await this.productRepository.updateStock(product);
            }
            const user = this.getLoggedUser(loggedUser);
            const log = this.getSalesOrderLog(salesOrderHeader, user);
            logs.push(log);
        }
        await this.salesOrderLogRepository.create(logs);
    }

    public async bulkCreate(
        headers: BulkCreateSalesOrderPayload[],
        loggedUser: User
    ): Promise<CreationPayloadValidationResult> {
        const bulkCreateHeaders: SalesOrderHeaderModel[] = [];
        for (const headerObject of headers) {
            const productValidation = await this.validateProductsOnCreation(headerObject);
            if (productValidation.hasErrors) {
                return productValidation;
            }
            const items = this.getSalesOrderItems(headerObject, productValidation.products as ProductModel[]);
            const header = this.getSalesOrderHeader(headerObject, items);
            const customerValidationResult = await this.validateCustomerOnCreation(headerObject);
            if (customerValidationResult.hasErrors) {
                return customerValidationResult;
            }
            const headerValidationResult = header.validateCreationPayload({
                customer_id: (customerValidationResult.customer as CustomerModel).id
            });
            if (headerValidationResult.hasErrors) {
                return headerValidationResult;
            }
            bulkCreateHeaders.push(header);
        }
        await this.salesOrderHeaderRepository.bulkCreate(bulkCreateHeaders);
        await this.afterCreate(headers, loggedUser);
        return this.serializeBulkCreateResult(bulkCreateHeaders);
    }

    private serializeBulkCreateResult(headers: SalesOrderHeaderModel[]): CreationPayloadValidationResult {
        return {
            hasErrors: false,
            headers: headers.map((header) => header.toCreationObject())
        };
    }

    private async validateProductsOnCreation(
        header: SalesOrderHeader | BulkCreateSalesOrderPayload
    ): Promise<CreationPayloadValidationResult> {
        const products = await this.getProductsByIds(header);
        if (!products) {
            return {
                hasErrors: true,
                error: new Error('Nenhum produto da lista de itens foi encontrado')
            };
        }
        return {
            hasErrors: false,
            products
        };
    }

    private async validateCustomerOnCreation(
        header: SalesOrderHeader | BulkCreateSalesOrderPayload
    ): Promise<CreationPayloadValidationResult> {
        const customer = await this.getCustomerById(header);
        if (!customer) {
            return {
                hasErrors: true,
                error: new Error('Customer não encontrado')
            };
        }
        return {
            hasErrors: false,
            customer
        };
    }

    private async getProductsByIds(
        params: SalesOrderHeader | BulkCreateSalesOrderPayload
    ): Promise<ProductModel[] | null> {
        const productsIds: string[] = params.items?.map((item) => item.product_id) as string[];
        return await this.productRepository.findByIds(productsIds);
    }

    private getSalesOrderItems(
        params: SalesOrderHeader | BulkCreateSalesOrderPayload,
        products: ProductModel[]
    ): SalesOrderItemModel[] {
        return params.items?.map((item) =>
            SalesOrderItemModel.create({
                productId: item.product_id as string,
                quantity: item.quantity as number,
                price: item.price as number,
                products
            })
        ) as SalesOrderItemModel[];
    }

    private getSalesOrderHeader(
        params: SalesOrderHeader | BulkCreateSalesOrderPayload,
        items: SalesOrderItemModel[]
    ): SalesOrderHeaderModel {
        return SalesOrderHeaderModel.create({
            customerId: params.customer_id as string,
            items
        });
    }

    private getExistingSalesOrderHeader(
        params: SalesOrderHeader | BulkCreateSalesOrderPayload,
        items: SalesOrderItemModel[]
    ): SalesOrderHeaderModel {
        return SalesOrderHeaderModel.with({
            id: params.id as string,
            customerId: params.customer_id as string,
            totalAmount: params.totalAmount as number,
            items
        });
    }

    private async getCustomerById(
        params: SalesOrderHeader | BulkCreateSalesOrderPayload
    ): Promise<CustomerModel | null> {
        const costumerId = params.customer_id as string;
        return this.customerRepository.findById(costumerId);
    }

    private getLoggedUser(loggedUser: User): LoggedUserModel {
        return LoggedUserModel.create({
            id: loggedUser.id,
            roles: loggedUser.roles as string[],
            attributes: {
                id: loggedUser.attr.id as unknown as number,
                groups: loggedUser.attr.groups as unknown as string[]
            }
        });
    }

    private getSalesOrderLog(header: SalesOrderHeaderModel, user: LoggedUserModel): SalesOrderLogModel {
        return SalesOrderLogModel.create({
            headerId: header.id,
            orderData: header.toStringifiedObject(),
            userData: user.toStringifiedObject()
        });
    }
}
