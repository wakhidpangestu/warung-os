export const shopRoles = ["owner", "cashier", "inventory", "auditor"] as const;
export type ShopRole = (typeof shopRoles)[number];

const permissions = {
  owner: ["manage_shop", "manage_staff", "view_dashboard"],
  cashier: ["view_dashboard"],
  inventory: ["view_dashboard"],
  auditor: ["view_dashboard"]
} as const;

export type Permission = (typeof permissions.owner)[number];

export function can(role: ShopRole, permission: Permission): boolean {
  return (permissions[role] as readonly string[]).includes(permission);
}
