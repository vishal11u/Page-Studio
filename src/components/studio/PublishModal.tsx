'use client';

import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { closePublishModal, setPublishing, setStatusMessage } from '@/redux/slices/uiSlice';
import { publishSuccess, publishFailed, clearPublishError } from '@/redux/slices/publishSlice';
import { markClean } from '@/redux/slices/draftPageSlice';
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export function PublishModal() {
  const dispatch = useAppDispatch();
  const open = useAppSelector((s) => s.ui.publishModalOpen);
  const isPublishing = useAppSelector((s) => s.ui.isPublishing);
  const page = useAppSelector((s) => s.draftPage.page);
  const publishError = useAppSelector((s) => s.publish.publishError);

  async function handlePublish() {
    if (!page) return;

    dispatch(setPublishing(true));
    dispatch(clearPublishError());

    try {
      const response = await fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? 'Publish failed');
      }

      dispatch(
        publishSuccess({
          version: data.version,
          publishedAt: data.snapshot.publishedAt,
          changelog: data.snapshot.changelog,
        }),
      );
      dispatch(markClean());
      dispatch(setStatusMessage(data.created ? `Published v${data.version}` : 'No changes to publish'));
      dispatch(closePublishModal());
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Publish failed';
      dispatch(publishFailed(message));
    } finally {
      dispatch(setPublishing(false));
    }
  }

  return (
    <Dialog open={open} onOpenChange={(value) => !value && dispatch(closePublishModal())}>
      <DialogHeader>
        <DialogTitle>Publish release</DialogTitle>
        <DialogDescription>
          {`Creates an immutable semver snapshot under releases/${page?.slug ?? '[slug]'}/.`}
        </DialogDescription>
      </DialogHeader>
      {publishError && (
        <p className="mb-4 text-sm text-destructive" role="alert">
          {publishError}
        </p>
      )}
      <footer className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => dispatch(closePublishModal())}>
          Cancel
        </Button>
        <Button onClick={handlePublish} disabled={isPublishing || !page}>
          {isPublishing ? 'Publishing…' : 'Confirm publish'}
        </Button>
      </footer>
    </Dialog>
  );
}
