export default function PreviewLoading() {
  return (
    <div
      className="flex min-h-[40vh] items-center justify-center p-8"
      role="status"
      aria-live="polite"
    >
      <p className="text-muted-foreground">Loading preview…</p>
    </div>
  );
}