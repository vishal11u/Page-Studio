export default function StudioLoading() {
  return (
    <div
      className="flex min-h-[calc(100vh-57px)] items-center justify-center p-8"
      role="status"
      aria-live="polite"
    >
      <p className="text-muted-foreground">Loading studio…</p>
    </div>
  );
}