'use client';

import { useRouter } from 'next/navigation';
import { Label } from '@/components/ui/label';
import type { Role } from '@/types/auth';

const ROLES: Role[] = ['viewer', 'editor', 'publisher'];

export function RoleSwitcher({ currentRole }: { currentRole: Role }) {
  const router = useRouter();

  async function setRole(role: Role) {
    await fetch('/api/auth/role', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role }),
    });
    router.refresh();
  }

  return (
    <div className="flex items-center gap-2">
      <Label htmlFor="role-select">Role</Label>
      <select
        id="role-select"
        value={currentRole}
        onChange={(e) => setRole(e.target.value as Role)}
        className="h-9 rounded-md border border-input bg-background px-2 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        aria-label="Switch mock session role"
      >
        {ROLES.map((role) => (
          <option key={role} value={role}>
            {role}
          </option>
        ))}
      </select>
    </div>
  );
}
