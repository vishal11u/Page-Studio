import { NextResponse } from 'next/server';
import { z } from 'zod';
import { SESSION_COOKIE, USER_COOKIE } from '@/lib/auth/constants';
import type { Role } from '@/types/auth';

const roleSchema = z.object({
  role: z.enum(['viewer', 'editor', 'publisher']),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = roleSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
  }

  const response = NextResponse.json({ role: parsed.data.role as Role });

  response.cookies.set(SESSION_COOKIE, parsed.data.role, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });

  response.cookies.set(USER_COOKIE, `mock-${parsed.data.role}`, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
