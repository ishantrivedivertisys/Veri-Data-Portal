export const TEMPLATESCONFIG = [
    {
        TemplateColumnName: ['CustomerRefNo', 'Customer#', 'Customer', 'Payer No'],
        TableColumnName: "customerRefNo",
        Validation: ['mandatory']
    },
    {
        TemplateColumnName: ['AccountName1', 'CustomerName', 'Name'],
        TableColumnName: "accountName1",
        Validation: ['mandatory']
    },
    {
        TemplateColumnName: ['AccountName2'],
        TableColumnName: "accountName2",
        Validation: [''],
    },
    {
        TemplateColumnName: ['Address1', 'Street', 'Street1', 'Customer Address 1'],
        TableColumnName: "address1",
        Validation: ['']
    },
    {
        TemplateColumnName: ['Address2', 'Street2'],
        TableColumnName: "address2",
        Validation: ['']
    },
    {
        TemplateColumnName: ['City', 'Customer Town'],
        TableColumnName: "city",
        Validation: ['mandatory', 'character']
    },
    {
        TemplateColumnName: ['ZipCode', 'Zip', 'Postal Code', 'Customer Postal Code', 'SoldPostalCode'],
        TableColumnName: "zipCode",
        Validation: ['mandatory']
    },
    {
        TemplateColumnName: ['StateCode', 'Customer State', 'State'],
        TableColumnName: "stateCode",
        Validation: ['mandatory', 'character']
    },
    {
        TemplateColumnName: ['CountryCode', 'Country'],
        TableColumnName: "countryCode",
        Validation: ['']
    },
    {
        TemplateColumnName: ['Phone', 'Telephone 1', 'Tel#', 'Main Phone'],
        TableColumnName: "phone",
        Validation: ['']
    },
    {
        TemplateColumnName: ['FigureDate', 'Figure Date'],
        TableColumnName: "figureDate",
        Validation: ['mandatory', 'date']
    },
    {
        TemplateColumnName: ['LastSaleDate'],
        TableColumnName: "lastSaleDate",
        Validation: ['date']
    },
    {
        TemplateColumnName: ['YearAccountOpened', 'YearAccountOpen'],
        TableColumnName: "yearAccountOpened",
        Validation: ['']
    },
    {
        TemplateColumnName: ['PrimaryTerms', 'Terms 1'],
        TableColumnName: "term1",
        Validation: ['']
    },
    {
        TemplateColumnName: ['SecondaryTerms', 'Terms 2'],
        TableColumnName: "term2",
        Validation: ['']
    },
    {
        TemplateColumnName: ['PrimaryTermsOpen', 'Terms 1 Open'],
        TableColumnName: "open_term1",
        Validation: ['']
    },
    {
        TemplateColumnName: ['SecondaryTermsOpen', 'Terms 2 Open'],
        TableColumnName: "open_term2",
        Validation: ['']
    },
    {
        TemplateColumnName: ['HighCredit', 'High Credit'],
        TableColumnName: "highCredit",
        Validation: ['integer']
    },
    {
        TemplateColumnName: ['TotalOwing', 'Dollars Total', 'Amount', 'Balance Total', 'Grand Total'],
        TableColumnName: "totalOwing",
        Validation: ['integer']
    },
    {
        TemplateColumnName: ['Current', 'Aging Current'],
        TableColumnName: "current",
        Validation: ['integer']
    },
    {
        TemplateColumnName: ['Dating'],
        TableColumnName: "dating",
        Validation: ['integer']
    },
    {
        TemplateColumnName: ['Aging1_30', '0_30', '1 to 30'],
        TableColumnName: "aging1_30",
        Validation: ['mandatory', 'integer']
    },
    {
        TemplateColumnName: ['Aging31_60', '31_60', '31 to 60'],
        TableColumnName: "aging31_60",
        Validation: ['mandatory', 'integer']
    },
    {
        TemplateColumnName: ['Aging61_90', '61_90', '61 to 90'],
        TableColumnName: "aging61_90",
        Validation: ['mandatory', 'integer']
    },
    {
        TemplateColumnName: ['AgingOver90', '91-120', 'Over 90'],
        TableColumnName: "agingOver90",
        Validation: ['integer']
    },
    {
        TemplateColumnName: ['Dispute1_30', 'Dispute 1 to 30'],
        TableColumnName: "dispute1_30",
        Validation: ['character']
    },
    {
        TemplateColumnName: ['Dispute31_60', 'Dispute 31 to 60'],
        TableColumnName: "dispute31_60",
        Validation: ['character']
    },
    {
        TemplateColumnName: ['Dispute61_90', 'Dispute 61 to 90'],
        TableColumnName: "dispute61_90",
        Validation: ['character']
    },
    {
        TemplateColumnName: ['DisputeOver90', 'Dispute Over 90'],
        TableColumnName: "disputeOver90",
        Validation: ['character']
    },
    {
        TemplateColumnName: ['AverageDays', 'AveragePayDays'],
        TableColumnName: "averageDays",
        Validation: ['integer']
    },
    {
        TemplateColumnName: ['Manner of Payment'],
        TableColumnName: "mannerOfPayment",
        Validation: ['']
    },
    {
        TemplateColumnName: ['Contact', 'Primary Contact'],
        TableColumnName: "contact",
        Validation: ['']
    },
    {
        TemplateColumnName: ['Contact Job Title'],
        TableColumnName: "contactJobTitle",
        Validation: ['']
    },
    {
        TemplateColumnName: ['Contact Telephone'],
        TableColumnName: "contactTelephone",
        Validation: ['']
    },
    {
        TemplateColumnName: ['Contact E-Mail'],
        TableColumnName: "contactEmail",
        Validation: ['email']
    },
    {
        TemplateColumnName: ['CommentCode'],
        TableColumnName: "commentCode",
        Validation: ['']
    },
    {
        TemplateColumnName: ['Comments'],
        TableColumnName: "comments",
        Validation: ['']
    },
    {
        TemplateColumnName: ['Currencies Cd'],
        TableColumnName: "currencies",
        Validation: ['']
    },
    // {
    //     TemplateColumnName: [''],
    //     TableColumnName: "ignore",
    //     Validation: ['']
    // },
]