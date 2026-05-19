import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-background px-4 text-center">
      <h1 className="text-6xl font-bold tracking-tight text-foreground">
        404
      </h1>
      <p className="mt-3 text-lg text-muted-foreground">
        Halaman tidak dijumpai.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center justify-center rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Kembali ke Tukar QR
      </Link>
    </main>
  );
}
