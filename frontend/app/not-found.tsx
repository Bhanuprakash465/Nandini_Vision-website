import Link from "next/link";

export default function NotFound() {
  return (
    <section className="page-pad flex min-h-[60svh] flex-col items-start justify-center py-24">
      <h1 className="font-display text-6xl leading-none md:text-9xl">Page not found</h1>
      <p className="mt-6 max-w-md text-[17px] text-black/70">
        That page doesn&rsquo;t exist, or the story has moved. Try the archive or head back home.
      </p>
      <div className="mt-10 flex flex-wrap gap-4">
        <Link href="/" className="btn-cobalt-on-light">Back to home</Link>
        <Link href="/work" className="btn-ghost-dark">See our work</Link>
      </div>
    </section>
  );
}
