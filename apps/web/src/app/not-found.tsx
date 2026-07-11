import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center p-6">
      <div className="max-w-md text-center space-y-4">
        <h2 className="text-4xl font-bold">404</h2>
        <p className="text-lg text-muted-foreground">
          Page not found. The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link href="/">
          <Button>Go Home</Button>
        </Link>
      </div>
    </main>
  );
}
