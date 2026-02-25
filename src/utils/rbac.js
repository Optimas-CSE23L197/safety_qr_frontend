export const hasRole = (useRoles, allowedRoles) => {
  allowedRoles.some((role) => useRoles.includes(role));
};
