const permissionsForUsersModule = [
  'create users',
  'edit users',
  'view users',
  'delete users',
];

const permissionsForRolesModule = [
  'create roles',
  'edit roles',
  'view roles',
  'delete roles',
];

const permissionsForPermissionsModule = [
  'create permissions',
  'edit permissions',
  'view permissions',
  'delete permissions',
];

export const adminPermissions = [
  ...permissionsForPermissionsModule,
  ...permissionsForRolesModule,
  ...permissionsForUsersModule,
];