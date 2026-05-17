'use client';

import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { addSection } from '@/redux/slices/draftPageSlice';
import { openPublishModal } from '@/redux/slices/uiSlice';
import { sectionTypes, sectionRegistry } from '@/registry/sectionRegistry';
import { SectionList } from './SectionList';
import { SectionEditor } from './SectionEditor';
import { Button } from '@/components/ui/button';
import type { SectionType } from '@/types/page';
import type { Role } from '@/types/auth';

type StudioSidebarProps = {
  role: Role;
};

export function StudioSidebar({ role }: StudioSidebarProps) {
  const dispatch = useAppDispatch();
  const isDirty = useAppSelector((s) => s.draftPage.isDirty);
  const canPublish = role === 'publisher';

  return (
    <aside
      aria-label="Studio editor"
      className="flex w-80 shrink-0 flex-col border-r border-border bg-muted/20"
    >
      <section className="flex-1 space-y-6 overflow-y-auto p-4">
        <section aria-labelledby="sections-heading">
          <header className="mb-3 flex items-center justify-between">
            <h2 id="sections-heading" className="text-sm font-semibold">
              Sections
            </h2>
            <select
              className="h-8 rounded-md border border-input bg-background px-2 text-xs"
              defaultValue=""
              aria-label="Add section"
              onChange={(e) => {
                const type = e.target.value as SectionType;
                if (type) {
                  dispatch(addSection(type));
                  e.target.value = '';
                }
              }}
            >
              <option value="">Add…</option>
              {sectionTypes.map((type) => (
                <option key={type} value={type}>
                  {sectionRegistry[type].label}
                </option>
              ))}
            </select>
          </header>
          <SectionList />
        </section>

        <section aria-labelledby="props-heading">
          <h2 id="props-heading" className="mb-3 text-sm font-semibold">
            Properties
          </h2>
          <SectionEditor />
        </section>
      </section>

      <footer className="border-t border-border p-4">
        {isDirty && (
          <p className="mb-2 text-xs text-amber-600" role="status">
            Unsaved draft changes (persisted locally)
          </p>
        )}
        {canPublish ? (
          <Button className="w-full" onClick={() => dispatch(openPublishModal())}>
            Publish
          </Button>
        ) : (
          <p className="text-xs text-muted-foreground">
            Switch role to <strong>publisher</strong> to publish.
          </p>
        )}
      </footer>
    </aside>
  );
}
