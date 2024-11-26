export const RolePermissionParentRoute = 'role-permission';

export const RolePermissionRoutes = {
  create: '',
  update: 'update/:rolePermissionId',
  delete: ':rolePermissionId',
  view_one: ':rolePermissionId',
  view_all: '',
  get_permission_with_role: 'getPermissionWithRole/role',
  get_permissions_by_role_id: 'getPermissionsByRoleId/permissions/:roleId',
  update_role_permission: 'updateRolePermission/rolePermission'
};