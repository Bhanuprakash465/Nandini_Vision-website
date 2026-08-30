"use client";
const tones: Record<string, string> = {
  maroon: "from-[#7c3338] via-[#4a1518] to-[#2c0c0e]",
  gold: "from-[#d9bd82] via-[#a9863f] to-[#7a611f]",
  bone: "from-[#dcd6cc] via-[#b7ab97] to-[#8f8272]",
};

export default function Placeholder({
  tone = "bone",
  label = "TEMPORARY PLACEHOLDER",
  className = "",
}: {
  tone?: "maroon" | "gold" | "bone";
  label?: string;
  className?: string;
}) {
  return (
    <div className={`relative overflow-hidden bg-gradient-to-br ${tones[tone]} ${className}`}>
      <div className="absolute inset-0 shadow-[inset_0_-60px_90px_-30px_rgba(17,17,17,0.45)]" />
      <span className="absolute left-3 bottom-3 z-10 border border-bone/25 bg-ink/35 px-2 py-1 text-[9px] uppercase tracking-[0.14em] text-bone/85">
        {label}
      </span>
    </div>
  );
}
