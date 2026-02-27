/**
 * usePermission Hook
 * Returns boolean whether current user has a given permission.
 *
 * Usage:
 *   const canRevoke = usePermission('tokens.revoke');
 *   const canManage = usePermission(['tokens.revoke', 'tokens.assign']); // any
 */

import useAuthStore from "../store/authStore.js";
import { hasPermission, hasAnyPermission } from "../utils/rbac.js";

/**
 * @param {string | string[]} permission - single or array of permissions
 * @param {'all' | 'any'} mode - 'any' checks if user has AT LEAST ONE
 */
const usePermission = (permission, mode = "any") => {
  const role = useAuthStore((state) => state.user?.role);

  if (!role) return false;

  if (Array.isArray(permission)) {
    return mode === "any"
      ? hasAnyPermission(role, permission)
      : permission.every((p) => hasPermission(role, p));
  }

  return hasPermission(role, permission);
};

export default usePermission;
