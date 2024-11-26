export const TempExperienceParentRoute = 'temp-experience';

export const TempExperienceRoutes = {
  create: '',
  update: 'update/:tempExperienceId',
  delete: ':tempExperienceId',
  view_one: ':tempExperienceId',
  view_all: '',
  upload_excel: 'uploadExcel',
  get_temp_experience_by_file_upload_id: 'getTempExperienceByFileUploadId/:fileUploadId',
  approve: 'approve/:fileUploadId',
  get_import_history: 'getImportHistory/history',
  get_pending_trade_tape_by_file_upload_id: 'getPendingTradeTapeByFileUploadId/PendingTradeTape/:fileUploadId',
  get_header_trade_tape_by_file_upload_id: 'getHeaderTradeTapeByFileUploadId/HeaderTradeTape',
  validate_template: 'validateTemplate/template',
  trade_tape_mapping: 'tradeTapeMapping',
  upload_tab_delimited_files: 'uploadTabDelimitedFiles/tabDelimited',
  file_processing: 'fileProcessing/fileUrlAndCustomerNo',
  update_trade_tape_by_file_upload_id: 'updateTradeTapeByFileUploadId/updateTradeTape/:fileUploadId',
  delete_trade_tape_by_file_upload_id: 'deleteTradeTapeByFileUploadId/deleteTradeTape/:fileUploadId',
  un_matched_columns_by_file_upload_id: 'unMatchedColumnsByFileUploadId/unMatchedColumns/:fileUploadId',
  delete_template_column_by_id: 'deleteTemplateColumnById/templateColumn/:templateStructureId'
};
