export const TEMPLATECONFIG = [
    {
        TemplateColumnName: ["CustomerRefNo"],
        TableColumnName: "customerRefNo",
        Validation: ['']
    },
    {
        TemplateColumnName: ["AccountName1"],
        TableColumnName: "accountName1",
        Validation: ['']
    },
    {
        TemplateColumnName: ["Address1"],
        TableColumnName: "address1",
        Validation: ['']
    },
    {
        TemplateColumnName: ["Address2"],
        TableColumnName: "address2",
        Validation: ['']
    },
    {
        TemplateColumnName: ["City"],
        TableColumnName: "city",
        Validation: ['character']
    },
    {
        TemplateColumnName: ["ZipCode"],
        TableColumnName: "zipCode",
        Validation: ['']
    },
    {
        TemplateColumnName: ["StateCode"],
        TableColumnName: "stateCode",
        Validation: ['character']
    },
    {
        TemplateColumnName: ["CountryCode"],
        TableColumnName: "countryCode",
        Validation: ['character']
    },
    {
        TemplateColumnName: ["FigureDate"],
        TableColumnName: "figureDate",
        Validation: ['date']
    },
    {
        TemplateColumnName: ["LastSaleDate"],
        TableColumnName: "lastSaleDate",
        Validation: ['integer']
    },
    {
        TemplateColumnName: ["YearAccountOpened"],
        TableColumnName: "yearAccountOpened",
        Validation: ['integer']
        // Validation: ['integer', 'masterValidation'],
        // masterValues : [2020, 2021, 2022, 2023]
    },
    
    {
        TemplateColumnName: ["TotalOwing"],
        TableColumnName: "totalOwing",
        Validation: ['decimal']
    },
    {
        TemplateColumnName: ["Current"],
        TableColumnName: "current",
        Validation: ['decimal']
    },
    {
        TemplateColumnName: ["Aging1_30"],
        TableColumnName: "aging1_30",
        Validation: ['decimal']
    },
    {
        TemplateColumnName: ["Aging31_60"],
        TableColumnName: "aging31_60",
        Validation: ['decimal']
    },
    {
        TemplateColumnName: ["Aging61_90"],
        TableColumnName: "aging61_90",
        Validation: ['decimal']
    },
    {
        TemplateColumnName: ["AgingOver90"],
        TableColumnName: "agingOver90",
        Validation: ['decimal']
    },
    {
        TemplateColumnName: ["CommentCode"],
        TableColumnName: "commentCode",
        Validation: ['character']
    },
    {
        TemplateColumnName: ["Comments"],
        TableColumnName: "comments",
        Validation: ['character']
    },
]