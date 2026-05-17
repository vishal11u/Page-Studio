import { notFound } from 'next/navigation';
import { getPageBySlug } from '@/lib/contentful/adapters';
import { PageRenderer } from '@/components/sections/PageRenderer';
import { AppHeader } from '@/components/common/AppHeader';
import { getSession } from '@/lib/auth/session';

type PreviewPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ mode?: string }>;
};

export default async function PreviewPage({ params, searchParams }: PreviewPageProps) {
  const { slug } = await params;
  const { mode } = await searchParams;
  const session = await getSession();

  const page = await getPageBySlug(slug, mode === 'preview' ? 'preview' : 'published');

  if (!page) {
    notFound();
  }

  return (
    <>
      <AppHeader role={session.role} />
      <div id="main-content" role="main" className="min-h-screen">
        <div className="border-b border-border px-6 py-4">
          <h1 className="text-2xl font-bold">{page.title}</h1>
          <p className="text-sm text-muted-foreground">
            Preview · {mode === 'preview' ? 'Contentful preview' : 'published'} mode
          </p>
        </div>
        <PageRenderer page={page} />
      </div>
    </>
  );
}