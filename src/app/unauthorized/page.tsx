import Link from 'next/link';
import { AppHeader } from '@/components/common/AppHeader';
import { getSession } from '@/lib/auth/session';

type UnauthorizedPageProps = {
  searchParams: Promise<{ from?: string; reason?: string }>;
};

export default async function UnauthorizedPage({ searchParams }: UnauthorizedPageProps) {
  const session = await getSession();
  const { from, reason } = await searchParams;

  return (
    <>
      <AppHeader role={session.role} />
      <div id="main-content" role="main" className="mx-auto max-w-lg px-6 py-16 text-center">
        <h1 className="text-2xl font-bold">Access denied</h1>
        <p className="mt-4 text-muted-foreground">
          {reason === 'studio'
            ? 'Your role does not have permission to access the studio editor. Switch to editor or publisher.'
            : 'You do not have permission to view this resource.'}
        </p>
        {from && (
          <p className="mt-2 text-sm text-muted-foreground">
            Attempted: <code>{from}</code>
          </p>
        )}
        <p className="mt-8">
          <Link href="/" className="underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
            Return home
          </Link>
        </p>
      </div>
    </>
  );
}
