/**
 * Quiet scroll reveal. Pure CSS (see `.reveal` in globals.css): content is always
 * visible without JavaScript, in browsers without scroll-driven animation, and
 * when the visitor prefers reduced motion.
 */
export default function Reveal({
  children,
  className = "",
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section" | "li" | "header";
}) {
  return <Tag className={`reveal ${className}`}>{children}</Tag>;
}
