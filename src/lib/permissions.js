// Client mirror of server role gates (iehub-server/lib/roles.js).
// Nav visibility only — the server still enforces every request.
export const isAdminUser = (user) =>
  Boolean(user?.isAdmin || user?.role === 'admin' || user?.userType === 'demo-admin');

// Seller writes (product:create) require Owner/Admin/Manager on the server.
const SELLER_ROLES = ['Owner', 'Admin', 'Manager'];

export const canManageListings = (user, activeOrg) => {
  if (user?.isGuest) return false;
  const role = activeOrg?.myRole || null;
  if (!role) return true; // no org context — preserve solo-trader behavior
  return SELLER_ROLES.includes(role);
};

// Org config/members read requires Owner/Admin on the server.
export const canManageOrgSettings = (user, activeOrg) => {
  if (user?.isGuest) return false;
  const role = activeOrg?.myRole || null;
  if (!role) return true;
  return role === 'Owner' || role === 'Admin';
};
