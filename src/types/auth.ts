export type Role = 'viewer' | 'editor' | 'publisher';

export type Permission = 'preview' | 'edit' | 'publish';

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  viewer: ['preview'],
  editor: ['preview', 'edit'],
  publisher: ['preview', 'edit', 'publish'],
};

export type Session = {
  userId: string;
  role: Role;
};
