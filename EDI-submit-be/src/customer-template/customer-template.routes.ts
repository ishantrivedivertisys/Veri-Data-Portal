export const CustomerTemplateParentRoute = 'customer-template';

export const CustomerTemplateRoutes = {
  create: '',
  update: 'update/:customerTemplateId',
  delete: ':customerTemplateId',
  view_one: ':customerTemplateId',
  view_all: '',
  get_db_template_fields: 'getDBTemplateFields/template',
  get_by_customer_no: 'getByCustomerNumber/:customerNo',
  // get_header_by_header_row_no: 'getHeaderByHeaderRowNo/headerRow'
};