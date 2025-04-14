using { MainService } from '../routes/main';

annotate MainService.SalesOrderHeaders with @(  //nome da entidade
    Capabilities: { //capabilidades da entidade o que pode ser feito com a entidade 
        DeleteRestrictions : {
            $Type : 'Capabilities.DeleteRestrictionsType',
            Deletable: false, //não permite deletar
        },
        UpdateRestrictions : {
            $Type : 'Capabilities.UpdateRestrictionsType',
            Updatable: false, //não permite atualizar
        },
        FilterFunctions : [
            'toLower', //ignora maiusculas e minusculas na busca
        ],
        FilterRestrictions : {
            $Type : 'Capabilities.FilterRestrictionsType',
            FilterExpressionRestrictions: [
                {
                    Property : id,
                    AllowedExpressions: 'SearchExpression' //expressão de busca por parte do texto
                }
            ]
        }
    },
    UI: { 
        SelectionFields: [ //campos que serão exibidos no filtro
            id,
            totalAmount,
            customer_id,
            status_id,
        ],
        LineItem: [ //campos que serão exibidos na lista/tabela
            {
                $Type: 'UI.DataField', //tipo de campo
                Value: id, //campo que será exibido
                ![@HTML5.CssDefaults]: { //configurações do campo
                    $Type: 'HTML5.CssDefaultsType', //tipo de configuração
                    width: '18rem' //largura do campo
                }
            },
            {
                $Type: 'UI.DataField',
                Label: 'Cliente',
                Value: customer.id,
                ![@HTML5.CssDefaults]: {
                    $Type: 'HTML5.CssDefaultsType',
                    width: '18rem'
                }
            },
            {
                $Type: 'UI.DataField',
                Label: 'Valor Total',
                Value: totalAmount,
                ![@HTML5.CssDefaults]: {
                    $Type: 'HTML5.CssDefaultsType',
                    width: '10rem'
                }
            },
            {
                $Type: 'UI.DataField',
                Label: 'Status',
                Criticality: (status.id =  'COMPLETED' ? 3 : (status.id = 'PENDING' ? 2 : 1)),
                CriticalityRepresentation: #WithoutIcon,
                Value: status.id,
                ![@HTML5.CssDefaults]: {
                    $Type: 'HTML5.CssDefaultsType',
                    width: '8rem'
                }
            },
            {
                $Type: 'UI.DataField',
                Value: createdAt,
                ![@HTML5.CssDefaults] : {
                    $Type: 'HTML5.CssDefaultsType',
                    width: '15rem'
                }
            },
                {
                    $Type: 'UI.DataField',
                    Label: 'Criado por',
                    Value: createdBy,
                    ![@HTML5.CssDefaults] : {
                        $Type: 'HTML5.CssDefaultsType',
                        width: '15rem'
                    }
                }
        ],
        HeaderInfo  : {
            $Type : 'UI.HeaderInfoType',
            TypeName : 'Pedido de Venda',
            TypeNamePlural : 'Pedidos de Venda',
            Title: {
                $Type: 'UI.DataField',
                Value: 'Pedido: {id}',
            }
        },
        Facets: [ //grupos de campos tela de detalhes
            {
                ID: 'SalesOrderData',
                $Type: 'UI.CollectionFacet',
                Label: 'Informações do Cabeçalho do Pedido', 
                Facets: [
                    {
                        ID: 'header',
                        $Type: 'UI.ReferenceFacet',
                        Target: '@UI.FieldGroup#Header',
                    }
                ]
            },
            {
                ID: 'customerData',
                $Type: 'UI.ReferenceFacet', //tipo de facet
                Label: 'Informações do Cliente', 
                Target: 'customer/@UI.FieldGroup#CustomerData', //target da facet
            },
            {
                ID: 'itemsData',
                $Type: 'UI.ReferenceFacet', //tipo de facet
                Label: 'Itens do Pedido', 
                Target: 'items/@UI.LineItem', // tabela de itens na tela de detalhes
            },
        ],
        FieldGroup#Header: { //nome do grupo de campos
            $Type: 'UI.FieldGroupType', //tipo de grupo de campos
            Data: [
                {
                    $Type: 'UI.DataField',
                    Value: id,
                },
                {
                    $Type: 'UI.DataField',
                    Value: totalAmount,
                },
                {
                    $Type: 'UI.DataField',
                    Value: createdAt,
                }
                ,
                {
                    $Type: 'UI.DataField',
                    Value: createdBy,
                }
            ]

        }
    }
) {
    id @title: 'ID';
    totalAmount @title: 'Valor Total';
    customer @(
        title: 'Cliente',
        Common:{
            Label: 'Cliente',
            Text: customer.firstName, //campo que será exibido
            ValueList: { //lista de valores tipo matchcode
                $Type: 'Common.ValueListType', //tipo de lista
                CollectionPath: 'Customers', //nome da entidade
                Parameters: [
                    {
                        $Type: 'Common.ValueListParameterInOut', //tipo de parametro
                        ValueListProperty: 'id', //propriedade da lista
                        LocalDataProperty: 'customer_id', //propriedade local
                    },
                    {
                        $Type: 'Common.ValueListParameterDisplayOnly', //tipo de parametro
                        ValueListProperty: 'firstName', //propriedade da lista
                    },
                    {
                        $Type: 'Common.ValueListParameterDisplayOnly', //tipo de parametro
                        ValueListProperty: 'lastName', //propriedade da lista
                    },
                    {
                        $Type: 'Common.ValueListParameterDisplayOnly', //tipo de parametro
                        ValueListProperty: 'email', //propriedade da lista
                    }
                ]
            },
        }
    );
    status @(
        Common:{
            Label: 'Status',
            Text : 'status.description',
            TextArrangement: #TextOnly, //exibe apenas o texto
            ValueListWithFixedValues, //lista de valores tipo matchcode lista fixa
            ValueList: { //lista de valores tipo matchcode
                $Type: 'Common.ValueListType', //tipo de lista
                CollectionPath: 'SalesOrderStatuses', //nome da entidade
                Parameters: [
                    {
                        $Type: 'Common.ValueListParameterInOut', //tipo de parametro
                        ValueListProperty: 'id', //propriedade da lista
                        LocalDataProperty: 'status_id', //propriedade local
                    },
                ]
            },
        }
    )
};

annotate MainService.SalesOrderStatuses with {
    id @Common.Text: description @Common.TextArrangement: #TextOnly; //anotação para a matchecode suspensa
};

annotate MainService.Customers with @( // tela de detalhes do cliente
    UI: {
        FieldGroup#CustomerData : { //nome do grupo de campos
            $Type : 'UI.FieldGroupType', //tipo de grupo de campos
            Data: [
                {
                    $Type: 'UI.DataField',
                    Value: id,
                },
                {
                    $Type: 'UI.DataField',
                    Value: firstName,
                },
                {
                    $Type: 'UI.DataField',
                    Value: lastName,
                },
                {
                    $Type: 'UI.DataField',
                    Value: email,
                }
            ]
        },
    }
) {
    id @title: 'ID';
    firstName @title: 'Nome';
    lastName @title: 'Sobrenome';
    email @title: 'E-mail';
}

annotate MainService.SalesOrderItems with @( 
    UI: {
        LineItem: [
            {
                $Type: 'UI.DataField',
                Value: id,
                ![@HTML5.CssDefaults]: {
                    $Type: 'HTML5.CssDefaultsType',
                    width: '18rem'
                }
            },
            {
                $Type: 'UI.DataField',
                Value: product.name,
                ![@HTML5.CssDefaults]: {
                    $Type: 'HTML5.CssDefaultsType',
                    width: '15rem'
                }
            },
            {
                $Type: 'UI.DataField',
                Value: price,
            },
            {
                $Type: 'UI.DataField',
                Value: quantity,
            }
        ],
    }
) {
    id @title: 'ID';
    quantity @title: 'Quantidade';
    price @title: 'Preço';
    header @UI.Hidden @UI.HiddenFilter; //oculta o campo header, oculta filtros e lista de seleção
    product @UI.Hidden @UI.HiddenFilter; //oculta o campo product, oculta filtros e lista de seleção
};

annotate MainService.Products with {
    name @title: 'Nome';
};
