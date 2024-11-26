export const UsersParentRoute = 'users';

export const UsersRoutes = {
  create: '',
  update: 'update/:userId',
  delete: ':userId',
  user: ':userId',
  verify: 'verify_otp',
  all_users: '',
  resend_otp: 'resend_otp',
  update_password: 'update_password',
  updateStatus : 'updatestatus',
  change_password: 'changePassword',
  available_user:"availableUser/phlebotomist",
  file_upload: 'fileUpload/file'
};
