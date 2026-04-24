export const transformStats = (data) => ({
  totalSchools: data.totalSchools,
  activeSchools: data.activeSchools,
  pastDueSchools: data.pastDueSchools,
  trialingSchools: data.trialingSchools,
  totalStudents: data.totalStudents,
  studentsThisMonth: data.studentsThisMonth,
  activeSubscriptions: data.activeSubscriptions,
  schoolsThisMonth: data.schoolsThisMonth,
  mrrUsd: data.mrrUsd,
});

export const transformGrowth = (data) => ({
  labels: data.labels,
  datasets: data.datasets,
});

export const transformSubscriptionBreakdown = (data) => data;

export const transformRecentSchools = (data) =>
  data.map((school) => ({
    id: school.id,
    name: school.name,
    code: school.code,
    city: school.city,
    state: school.state,
    school_type: school.school_type,
    is_active: school.is_active,
    created_at: school.created_at,
    subscription_status: school.subscriptions[0]?.status,
    plan: school.subscriptions[0]?.plan,
    student_count: school._count.students,
    user_count: school._count.users,
  }));

export const transformRecentAudit = (data) =>
  data.map((log) => ({
    id: log.id,
    actor_type: log.actor_type,
    action: log.action,
    entity: log.entity,
    created_at: log.created_at,
    school: log.school,
  }));

export const transformSystemHealth = (data) => data;
