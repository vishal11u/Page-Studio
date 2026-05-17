'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

type DialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
};

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  if (!open) return null;

  return (
    <section
      aria-hidden={false}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <button
        type="button"
        className="fixed inset-0 z-40 bg-black/50"
        aria-label="Close dialog"
        onClick={() => onOpenChange(false)}
      />
      <section
        role="dialog"
        aria-modal="true"
        className="relative z-50 mx-4 w-full max-w-lg rounded-lg border border-border bg-background p-6 shadow-lg"
      >
        {children}
      </section>
    </section>
  );
}

export function DialogHeader({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return <header className={cn('mb-4 space-y-1', className)} {...props} />;
}

export function DialogTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cn('text-lg font-semibold', className)} {...props} />;
}

export function DialogDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-sm text-muted-foreground', className)} {...props} />;
}
