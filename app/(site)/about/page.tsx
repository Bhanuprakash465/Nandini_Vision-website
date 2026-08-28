import type { Metadata } from "next";
import { Reveal } from "@/components/Reveal";
import { ImageMedia } from "@/components/ImageMedia";
import { team, seo, studio } from "@/lib/content";
import { LocalBusinessJsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "About Nandini Vision | Photography Studio in Andhra Pradesh",
  description:
    "The story, philosophy and team behind Nandini Vision — a premium photography studio in Andhra Pradesh, India, photographing beautifully lived lives worldwide.",
  alternates: { canonical: `${seo.url}/about` },
  openGraph: {
    title: "About Nandini Vision",
    description: "Less direction. More noticing.",
    url: `${seo.url}/about`,
    images: [{ url: seo.ogImage }],
  },
};

const approach = [
  {
    title: "Documentary storytelling",
    text: "We photograph events as they happen — arrivals, in-betweens, and the small rituals nobody plans for.",
  },
  {
    title: "Emotional moments",
    text: "The frames that matter are the ones between poses. We wait for them.",
  },
  {
    title: "Cinematic composition",
    text: "Light, depth and negative space, arranged so each frame holds like a film still.",
  },
  {
    title: "Natural interactions",
    text: "We direct softly and rarely — enough to be useful, never enough to be felt.",
  },
  {
    title: "Cultural sensitivity",
    text: "Weddings across religions and communities: we learn the rituals before we photograph them.",
  },
  {
    title: "Attention to detail",
    text: "From heirloom jewellery to a grandmother's hands — detail is where memory lives.",
  },
];

export default function AboutPage() {
  return (
    <>
      <LocalBusinessJsonLd />
      <div className="page-enter">
        <header className="page-hero">
          <div className="container">
            <span className="eyebrow">About</span>
            <h1>The studio</h1>
            <p className="lead">
              {studio.name} photographs in Andhra Pradesh and wherever stories call —
              {` `}
              weddings, families, campaigns and celebrations worth remembering.
            </p>
          </div>
        </header>

        <section className="section" data-testid="about-story" style={{ paddingTop: 0 }}>
          <div className="container about-story">
            <Reveal variant="left">
              <div className="about-story__media img-reveal" data-cursor="view">
                <ImageMedia
                  src="/images/projects/a-red-thread-4.jpg"
                  alt="Evening celebration with marigolds and string lights"
                  cursor="view"
                  sizes="(max-width: 900px) 100vw, 40vw"
                  fallbackAspect="3 / 4"
                />
              </div>
            </Reveal>
            <Reveal variant="right" delay={100}>
              <div className="about-story__body">
                <span className="eyebrow">Studio story</span>
                <h2 style={{ marginTop: "var(--space-m)" }}>A studio built around the feeling between frames.</h2>
                <p className="lead" style={{ marginTop: "var(--space-l)" }}>
                  Nandini Vision began with a single conviction: the best photographs
                  are not taken, they&rsquo;re noticed.
                </p>
                <p>
                  From weddings in Vijayawada to pre-wedding journeys through Araku Valley,
                  we’ve built a studio that works the way memory works — quietly, in colour,
                  and always on the side of the people living the story.
                </p>
                <p>
                  Today the studio photographs celebrations across religions and communities,
                  families in their own light, and brands that want to feel human. Wherever we
                  travel — across India or across the world — the approach stays the same.
                </p>
                <p>
                  We are a small team. That is deliberate. Every story gets the same eyes,
                  the same care, and the same unhurried attention from first call to final album.
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="philosophy-banner" data-testid="philosophy">
          <div className="container">
            <span className="gold-line" aria-hidden="true" />
            <h2>
              Less direction. <em>More noticing.</em>
            </h2>
            <p>
              Our philosophy is not a rulebook — it’s a way of standing in a room.
              We notice, we wait, and we keep what the moment offers.
            </p>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <Reveal>
              <div className="section-head">
                <div>
                  <span className="eyebrow">Approach</span>
                  <h2>How we work</h2>
                </div>
              </div>
            </Reveal>
            <ul className="approach-grid">
              {approach.map((item, i) => (
                <Reveal as="li" key={item.title} delay={i * 60}>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>

        <section className="section section--bone-deep">
          <div className="container">
            <Reveal>
              <div className="section-head">
                <div>
                  <span className="eyebrow">Team</span>
                  <h2>The people behind the frames</h2>
                </div>
                <span className="demo-note">Demo team profiles</span>
              </div>
            </Reveal>
            <div className="team-grid">
              {team.map((member, i) => (
                <Reveal key={member.name} delay={i * 90}>
                  <article className="team-card">
                    <div className="team-card__media img-reveal" data-cursor="view">
                      <ImageMedia
                        src={member.image.src}
                        alt={member.image.alt}
                        cursor="view"
                        sizes="(max-width: 900px) 100vw, 33vw"
                        fallbackAspect="3 / 4"
                      />
                    </div>
                    <h3>{member.name}</h3>
                    <p className="role">{member.role}</p>
                    <p>{member.bio}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
