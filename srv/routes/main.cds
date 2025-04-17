using { sales } from '../../db/schema';
using { db.types.SalesReportByDays } from '../../db/types';

//Entities
@requires: 'authenticated-user'
service MainService {
    entity SalesOrderHeaders as projection on sales.SalesOrderHeaders;
    entity Customers as projection on sales.Customers;
    entity Products as projection on sales.Products;
    entity SalesOrderLogs as projection on sales.SalesOrderLogs;
    entity SalesOrderStatuses as projection on sales.SalesOrderStatuses;
}

//Functions
extend service MainService with {
    function getSalesReportByDays(days: SalesReportByDays.Params:days) returns array of SalesReportByDays.ExpectedResult;
}