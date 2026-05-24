export const hasPermission = (permissions, permissionName) => {
  return Array.isArray(permissions) && permissions.includes(permissionName);
};

export const hasAnyPermission = (permissions, permissionNames) => {
  return (
    Array.isArray(permissions) &&
    permissionNames.some((permissionName) => permissions.includes(permissionName))
  );
};
