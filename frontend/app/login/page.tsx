import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <section className="px-6 md:px-12 pt-40 pb-32 min-h-screen flex flex-col justify-center">
      <h1 className="font-display text-4xl text-center mb-12">Owner Sign In</h1>
      <LoginForm />
    </section>
  );
}
