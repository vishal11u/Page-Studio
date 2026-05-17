import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getSession, hasPermission } from '@/lib/auth/session';
import { publishPage } from '@/lib/publish/releaseStore';
import type { Page } from '@/types/page';

const pageSchema = z.object({
  pageId: z.string(),
  slug: z.string(),
  title: z.string(),
  sections: z.array(
    z.object({
      id: z.string(),
      type: z.enum(['hero', 'featureGrid', 'testimonial', 'cta']),
      props: z.record(z.string(), z.unknown()),
    }),
  ),
});

export async function POST(request: Request) {
  const session = await getSession();

  if (!hasPermission(session.role, 'publish')) {
    return NextResponse.json(
      { error: 'Forbidden: publisher role required' },
      { status: 403 },
    );
  }

  try {
    const body = await request.json();
    const parsed = pageSchema.safeParse(body.page);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid page payload', details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const result = await publishPage(parsed.data as Page);

    return NextResponse.json({
      created: result.created,
      version: result.version,
      bump: result.bump,
      snapshot: result.snapshot,
    });
  } catch (error) {
    console.error('Publish error:', error);
    return NextResponse.json({ error: 'Internal publish error' }, { status: 500 });
  }
}
