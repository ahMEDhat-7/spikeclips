export default function Loading() {
  return (
    <main className="container mx-auto p-4 sm:p-6 space-y-6">
      <div className="h-8 w-48 bg-muted animate-pulse rounded" />
      <div className="h-[120px] w-full bg-muted animate-pulse rounded-xl" />
      <div className="h-[300px] w-full bg-muted animate-pulse rounded-xl" />
    </main>
  );
}
