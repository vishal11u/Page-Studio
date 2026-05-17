import Link from 'next/link';
import { RoleSwitcher } from './RoleSwitcher';
import type { Role } from '@/types/auth';

type AppHeaderProps = {
  role: Role;
  title?: string;
};

export function AppHeader({ role, title = 'Page Studio' }: AppHeaderProps) {
  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-lg font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
            {title}
          </Link>
          <nav aria-label="Main" className="flex gap-4 text-sm">
            <Link href="/preview/home" className="hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
              Preview
            </Link>
            <Link href="/studio/home" className="hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
              Studio
            </Link>
          </nav>
        </div>
        <RoleSwitcher currentRole={role} />
      </div>
    </header>
  );
}
