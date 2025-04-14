using { MainService } from '../routes/main';

annotate MainService.SalesOrderHeaders with @(  //nome da entidade
    UI: { 
        SelectionFields: [ //campos que serão exibidos no filtro
            id,
            totalAmount,
            customer_id,
            status_id
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
