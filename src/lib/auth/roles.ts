import type { Role, Permission } from '@/types/auth';

const VALID_ROLES: Role[] = ['viewer', 'editor', 'publisher'];

export function parseRole(value: string | undefined): Role {
  if (value && VALID_ROLES.includes(value as Role)) {
    return value as Role;
  }
  return 'viewer';
}

export function hasPermission(role: Role, permission: Permission): boolean {
  const map: Record<Role, Permission[]> = {
    viewer: ['preview'],
    editor: ['preview', 'edit'],
    publisher: ['preview', 'edit', 'publish'],
  };

  return map[role].includes(permission);
}

// Trigger re-evaluation after proxy rename
