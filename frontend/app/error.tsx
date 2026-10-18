"use client";

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <section className="page-pad flex min-h-[60svh] flex-col items-start justify-center py-24">
      <h1 className="font-display text-5xl leading-none md:text-8xl">Something went wrong</h1>
      <p className="mt-6 max-w-md text-[17px] text-black/70">The page couldn&rsquo;t load. Please try again.</p>
      <button type="button" onClick={reset} className="btn-cobalt-on-light mt-10">Try again</button>
    </section>
  );
}
