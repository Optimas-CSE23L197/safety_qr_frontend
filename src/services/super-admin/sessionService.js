export const transformSessionList = (data) => ({
  id: data.id,
  user_type: data.user_type,
  user_name: data.user_name,
  user_email: data.user_email,
  device_info: data.device_info,
  ip_address: data.ip_address,
  last_active_at: data.last_active_at,
  created_at: data.created_at,
  expires_at: data.expires_at,
  status: data.status,
  platform: data.device_info || "Unknown",
});

export const transformSessionStats = (data) => ({
  total_active: data.total_active,
  expiring_soon_24h: data.expiring_soon_24h,
  most_active_platform: data.most_active_platform,
});

export const formatSessionStatus = (status) => {
  const map = {
    ACTIVE: { label: "Active", color: "success" },
    EXPIRED: { label: "Expired", color: "slate" },
    REVOKED: { label: "Revoked", color: "danger" },
    INACTIVE: { label: "Inactive", color: "warning" },
  };
  return map[status] || map.ACTIVE;
};
