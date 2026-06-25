export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div
        className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"
        role="status"
        aria-label="Loading"
      />
    </div>
  );
}
