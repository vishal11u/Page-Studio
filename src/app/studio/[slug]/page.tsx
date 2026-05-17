import { notFound, redirect } from 'next/navigation';
import { getPageBySlug } from '@/lib/contentful/adapters';
import { getSession } from '@/lib/auth/session';
import { hasPermission } from '@/lib/auth/roles';
import { AppHeader } from '@/components/common/AppHeader';
import { StudioClient } from '@/components/studio/StudioClient';
import { ReduxProvider } from '@/redux/provider';

type StudioPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function StudioPage({ params }: StudioPageProps) {
  const { slug } = await params;
  const session = await getSession();

  if (!hasPermission(session.role, 'edit')) {
    redirect('/unauthorized?reason=studio');
  }

  const page = await getPageBySlug(slug, 'preview');

  if (!page) {
    notFound();
  }

  return (
    <ReduxProvider>
      <AppHeader role={session.role} title="Page Studio" />
      <StudioClient initialPage={page} role={session.role} />
    </ReduxProvider>
  );
}
