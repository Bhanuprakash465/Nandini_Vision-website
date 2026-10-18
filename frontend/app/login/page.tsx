import type { Metadata } from "next";
import LoginForm from "@/components/LoginForm";

export const metadata: Metadata = {
  title: "Owner sign in",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <section className="on-dark flex min-h-[calc(100svh-var(--header-h))] flex-col justify-center bg-[image:var(--gradient-night)] px-6 py-24 text-white">
      <h1 className="mb-14 text-center font-display text-5xl md:text-7xl">Owner sign in</h1>
      <LoginForm />
    </section>
  );
}
