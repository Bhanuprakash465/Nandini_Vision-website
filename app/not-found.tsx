import Link from "next/link";

export default function NotFound() {
  return (
    <main className="error-page" data-testid="not-found">
      <div>
        <p className="code">404</p>
        <h1>This frame is missing.</h1>
        <p>The page you’re looking for has moved, or was never photographed.</p>
        <Link href="/" className="btn btn--maroon">
          Return home
        </Link>
      </div>
    </main>
  );
}
