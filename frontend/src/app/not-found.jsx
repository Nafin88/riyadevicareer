import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container-x grid min-h-[70vh] place-items-center pt-32 text-center">
      <div>
        <p className="font-display text-7xl font-semibold gold-text">404</p>
        <h1 className="mt-4 text-2xl font-semibold">This page wandered off</h1>
        <p className="mt-2 text-muted">The page you're looking for doesn't exist or has moved.</p>
        <Link href="/" className="btn btn-gold mt-8">Back to home</Link>
      </div>
    </section>
  );
}
