'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { loadPage } from '@/redux/slices/draftPageSlice';
import { PageRenderer } from '@/components/sections/PageRenderer';
import { StudioSidebar } from './StudioSidebar';
import { PublishModal } from './PublishModal';
import type { Page } from '@/types/page';
import type { Role } from '@/types/auth';

type StudioClientProps = {
  initialPage: Page;
  role: Role;
};

export function StudioClient({ initialPage, role }: StudioClientProps) {
  const dispatch = useAppDispatch();
  const draftPage = useAppSelector((s) => s.draftPage.page);

  useEffect(() => {
    if (!draftPage || draftPage.slug !== initialPage.slug) {
      dispatch(loadPage(initialPage));
    }
  }, [dispatch, draftPage, initialPage]);

  const page = draftPage ?? initialPage;

  return (
    <>
      <section className="flex min-h-[calc(100vh-57px)]">
        <StudioSidebar role={role} />
        <div id="main-content" role="main" className="flex-1 overflow-y-auto" aria-label="Live draft preview">
          <div className="border-b border-border px-6 py-3">
            <h1 className="text-lg font-semibold">{page.title}</h1>
            <p className="text-xs text-muted-foreground">Draft preview — changes reflect immediately</p>
          </div>
          <PageRenderer page={page} />
        </div>
      </section>
      <PublishModal />
    </>
  );
}
