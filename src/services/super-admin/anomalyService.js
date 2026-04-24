export const transformAnomalyList = (data) => ({
  id: data.id,
  token_id: data.token_id,
  token_hash: data.token,
  anomaly_type: data.anomaly_type,
  severity: data.severity,
  reason: data.reason,
  metadata: data.metadata,
  student_name: data.student,
  student_id: data.student_id,
  school_id: data.school_id,
  school_name: data.school,
  ip_address: data.ip_address || null,
  ip_city: data.ip_city || null,
  device: data.device || null,
  created_at: data.created_at,
  resolved: data.resolved,
  resolved_at: data.resolved_at,
  resolved_by: data.resolved_by,
  resolved_by_name: data.resolved_by,
  resolution_note: data.resolution_note || null,
  resolution_action: data.resolution_action || null,
});

export const transformAnomalyStats = (data) => ({
  total: data.total,
  resolved: data.resolved,
  unresolved: data.unresolved,
  by_severity: data.by_severity,
  by_type: data.by_type,
});

export const transformAnomalyFilters = (data) => ({
  anomalyTypes: data.anomalyTypes,
  severities: data.severities,
  resolvedStatuses: data.resolvedStatuses,
});

export const transformAnomalyDetail = (data) => ({
  id: data.id,
  token_id: data.token_id,
  token_hash: data.token_hash,
  reason: data.reason,
  metadata: data.metadata,
  student: data.student,
  student_id: data.student_id,
  school: data.school,
  anomaly_type: data.anomaly_type,
  severity: data.severity,
  resolved: data.resolved,
  resolved_at: data.resolved_at,
  resolved_by: data.resolved_by,
  created_at: data.created_at,
});
