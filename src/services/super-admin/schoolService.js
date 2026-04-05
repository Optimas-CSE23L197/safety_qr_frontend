export const transformSchoolList = (data) => ({
  id: data.id,
  name: data.name,
  code: data.code,
  city: data.city,
  state: data.state,
  is_active: data.is_active,
  created_at: data.created_at,
  students: data.students,
  admins: data.admins,
  subscription_status: data.subscription_status,
  subscription_plan: data.subscription_plan,
});

export const transformSchoolStats = (data) => ({
  total: data.total,
  active: data.active,
  inactive: data.inactive,
});

export const transformSchoolDetail = (data) => ({
  id: data.id,
  name: data.name,
  code: data.code,
  serial_number: data.serial_number,
  address: data.address,
  city: data.city,
  state: data.state,
  pincode: data.pincode,
  email: data.email,
  phone: data.phone,
  logo_url: data.logo_url,
  timezone: data.timezone,
  school_type: data.school_type,
  udise_code: data.udise_code,
  is_active: data.is_active,
  setup_status: data.setup_status,
  created_at: data.created_at,
  activated_at: data.activated_at,
  _count: data._count,
  subscription: data.subscriptions?.[0],
  settings: data.settings,
});

export const transformRegisterSchool = (payload) => ({
  school: {
    name: payload.school.name,
    address: payload.school.address,
    city: payload.school.city,
    state: payload.school.state,
    pincode: payload.school.pincode,
    email: payload.school.email,
    phone: payload.school.phone,
    timezone: payload.school.timezone,
    school_type: payload.school.school_type,
  },
  admin: {
    name: payload.admin.name,
    email: payload.admin.email,
    password: payload.admin.password,
  },
  subscription: {
    plan: payload.subscription.plan,
    student_count: parseInt(payload.subscription.student_count),
    custom_unit_price: payload.subscription.custom_unit_price
      ? parseInt(payload.subscription.custom_unit_price)
      : undefined,
    custom_renewal_price: payload.subscription.custom_renewal_price
      ? parseInt(payload.subscription.custom_renewal_price)
      : undefined,
    is_pilot: payload.subscription.is_pilot,
    pilot_expires_at: payload.subscription.is_pilot
      ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      : undefined,
  },
  agreement: {
    agreed_via: "DASHBOARD",
    ip_address: payload.agreement?.ip_address,
  },
});
