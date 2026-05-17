import Link from 'next/link';
import { AppHeader } from '@/components/common/AppHeader';
import { getSession } from '@/lib/auth/session';
import { hasPermission } from '@/lib/auth/roles';

export default async function HomePage() {
  const session = await getSession();
  const canEdit = hasPermission(session.role, 'edit');

  return (
    <>
      <AppHeader role={session.role} />
      <div id="main-content" role="main" className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-bold">Page Studio</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          CMS-powered schema-driven landing pages with a WYSIWYG-lite studio, Redux drafts, and immutable semver releases.
        </p>

        <nav className="mt-10 flex flex-col gap-4 sm:flex-row" aria-label="Quick links">
          <Link
            href="/preview/home"
            className="rounded-md border border-border px-6 py-3 text-center font-medium hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            Preview home
          </Link>
          {canEdit ? (
            <Link
              href="/studio/home"
              className="rounded-md bg-primary px-6 py-3 text-center font-medium text-primary-foreground hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              Open studio
            </Link>
          ) : (
            <p className="rounded-md border border-dashed border-border px-6 py-3 text-center text-sm text-muted-foreground">
              Studio requires editor or publisher role
            </p>
          )}
        </nav>

        <section className="mt-16" aria-labelledby="features-overview">
          <h2 id="features-overview" className="text-xl font-semibold">
            Architecture highlights
          </h2>
          <ul className="mt-4 list-inside list-disc space-y-2 text-muted-foreground">
            <li>Zod-validated section registry with graceful fallbacks</li>
            <li>Contentful adapter layer with mock fallback</li>
            <li>Redux Toolkit + redux-persist draft state</li>
            <li>RBAC proxy + publish API protection</li>
            <li>Immutable releases with semver bump detection</li>
          </ul>
        </section>
      </div>
    </>
  );
}
