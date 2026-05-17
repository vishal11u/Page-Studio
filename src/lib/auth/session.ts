import { cookies } from 'next/headers';
import type { Session } from '@/types/auth';
import { parseRole } from './roles';
import { SESSION_COOKIE, USER_COOKIE } from './constants';

export { SESSION_COOKIE, USER_COOKIE } from './constants';

export { parseRole, hasPermission } from './roles';

export async function getSession(): Promise<Session> {
  const cookieStore = await cookies();
  const role = parseRole(cookieStore.get(SESSION_COOKIE)?.value);
  const userId = cookieStore.get(USER_COOKIE)?.value ?? 'anonymous';

  return { userId, role };
}
