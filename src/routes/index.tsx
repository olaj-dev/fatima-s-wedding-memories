import { createFileRoute, Link } from "@tanstack/react-router";
import { Countdown } from "@/components/Countdown";
import { Carousel, type Slide } from "@/components/Carousel";
import { wedding, ayah, programme, contacts, gifts } from "@/lib/wedding";
import hero from "@/assets/hero.jpg";
import intro1 from "@/assets/intro-1.jpg";
import intro2 from "@/assets/intro-2.jpg";
import intro3 from "@/assets/intro-3.jpg";
import intro4 from "@/assets/intro-4.jpg";
import { MapPin, Phone, Clock, Gift, Camera, Heart } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${wedding.bride} & ${wedding.groom} — Our Nikkah` },
      {
        name: "description",
        content: `Join ${wedding.bride} and ${wedding.groom} on ${wedding.dateLabel} at ${wedding.venue}. Countdown, order of events, photos and directions.`,
      },
      { property: "og:title", content: `${wedding.bride} & ${wedding.groom} — Our Nikkah` },
      {
        property: "og:description",
        content: `Our Nikkah holds ${wedding.dateLabel} at ${wedding.venue}. You are warmly invited.`,
      },
    ],
  }),
  component: Home,
});

const slides: Slide[] = [
  { src: intro1, caption: "The gifts, laid out with love — Introduction day" },
  { src: intro2, caption: "Our bride, radiant in emerald" },
  { src: intro3, caption: "Two families becoming one" },
  { src: intro4, caption: "The moment it all became real" },
];

function Section({
  eyebrow,
  title,
  children,
  id,
}: {
  eyebrow: string;
  title: string;
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mx-auto max-w-5xl px-5 py-20">
      <div className="mb-10 text-center">
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="mt-3 text-4xl sm:text-5xl">{title}</h2>
        <span className="gold-rule mx-auto mt-6 max-w-xs" />
      </div>
      {children}
    </section>
  );
}

function Home() {
  return (
    <main>
      {/* Hero */}
      <section className="relative isolate flex min-h-[86vh] items-center justify-center overflow-hidden">
        <img
          src={hero}
          alt={`${wedding.bride} and ${wedding.groom}`}
          width={1600}
          height={1104}
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-primary/65" />
        <div className="px-6 py-24 text-center">
          <p className="animate-shimmer font-arabic text-lg text-primary-foreground/90">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
          <h1 className="mt-8 font-script text-6xl text-primary-foreground sm:text-8xl">
            {wedding.bride} &amp; {wedding.groom}
          </h1>
          <p className="eyebrow mt-6 text-primary-foreground/80">
            {wedding.dateLabel} · {wedding.venue}
          </p>
          <div className="mx-auto mt-12 max-w-2xl">
            <Countdown date={wedding.date} />
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              to="/note"
              className="inline-flex items-center gap-2 rounded-sm border border-gold bg-gold px-6 py-3 text-sm tracking-widest text-accent-foreground uppercase transition-transform hover:scale-105"
            >
              <Heart className="h-4 w-4" /> A note for Fatima
            </Link>
            <Link
              to="/memories"
              className="inline-flex items-center gap-2 rounded-sm border border-primary-foreground/60 px-6 py-3 text-sm tracking-widest text-primary-foreground uppercase transition-colors hover:bg-primary-foreground/10"
            >
              <Camera className="h-4 w-4" /> Share your photos
            </Link>
          </div>
        </div>
      </section>

      {/* Ayah */}
      <section className="bg-emerald-gradient px-6 py-24 text-center">
        <p className="mx-auto max-w-3xl font-arabic text-2xl leading-loose text-primary-foreground sm:text-3xl">
          {ayah.arabic}
        </p>
        <span className="gold-rule mx-auto my-8 max-w-xs" />
        <p className="mx-auto max-w-2xl font-display text-xl leading-relaxed text-primary-foreground/90 italic">
          “{ayah.translation}”
        </p>
        <p className="eyebrow mt-6 text-gold-soft">{ayah.reference}</p>
      </section>

      {/* Story */}
      <Section eyebrow="Our story" title="How we got here">
        <p className="mx-auto max-w-2xl text-center text-lg leading-relaxed text-muted-foreground">
          {wedding.story}
        </p>
      </Section>

      {/* Carousel */}
      <section className="bg-secondary/60 py-20">
        <div className="mx-auto max-w-5xl px-5">
          <div className="mb-10 text-center">
            <p className="eyebrow">From the beginning</p>
            <h2 className="mt-3 text-4xl sm:text-5xl">Introduction day</h2>
            <span className="gold-rule mx-auto mt-6 max-w-xs" />
          </div>
          <Carousel slides={slides} />
        </div>
      </section>

      {/* Programme */}
      <Section eyebrow="The day itself" title="Order of programme">
        <ol className="mx-auto max-w-2xl">
          {programme.map((item) => (
            <li
              key={item.title}
              className="flex gap-6 border-b border-border py-5 last:border-0"
            >
              <span className="w-24 shrink-0 pt-1 font-display text-lg text-gold">
                {item.time}
              </span>
              <span>
                <span className="block font-display text-xl text-foreground">
                  {item.title}
                </span>
                <span className="text-sm text-muted-foreground">{item.note}</span>
              </span>
            </li>
          ))}
        </ol>
      </Section>

      {/* Venue */}
      <section className="bg-secondary/60 py-20">
        <div className="mx-auto max-w-5xl px-5">
          <div className="mb-10 text-center">
            <p className="eyebrow">Where &amp; when</p>
            <h2 className="mt-3 text-4xl sm:text-5xl">Join us</h2>
            <span className="gold-rule mx-auto mt-6 max-w-xs" />
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="rounded-sm border border-gold/30 bg-card p-6 text-center">
              <Clock className="mx-auto h-5 w-5 text-gold" />
              <p className="mt-4 font-display text-xl">{wedding.dateLabel}</p>
              <p className="mt-1 text-sm text-muted-foreground">{wedding.timeLabel}</p>
            </div>
            <div className="rounded-sm border border-gold/30 bg-card p-6 text-center">
              <MapPin className="mx-auto h-5 w-5 text-gold" />
              <p className="mt-4 font-display text-xl">{wedding.venue}</p>
              <p className="mt-1 text-sm text-muted-foreground">{wedding.address}</p>
              <a
                href={wedding.mapUrl}
                target="_blank"
                rel="noreferrer"
                className="eyebrow mt-3 inline-block text-gold"
              >
                Open in maps
              </a>
            </div>
            <div className="rounded-sm border border-gold/30 bg-card p-6 text-center">
              <Heart className="mx-auto h-5 w-5 text-gold" />
              <p className="mt-4 font-display text-xl">Dress code</p>
              <p className="mt-1 text-sm text-muted-foreground">{wedding.dressCode}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Gifts */}
      <Section eyebrow="If you wish" title="Gifts & blessings">
        <p className="mx-auto max-w-2xl text-center text-muted-foreground">{gifts.intro}</p>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {gifts.options.map((g) => (
            <div key={g.label} className="rounded-sm border border-gold/30 bg-card p-6">
              <Gift className="h-5 w-5 text-gold" />
              <p className="mt-4 font-display text-xl">{g.label}</p>
              <p className="mt-2 text-sm text-foreground">{g.detail}</p>
              <p className="mt-2 text-xs text-muted-foreground">{g.hint}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Contacts */}
      <section className="bg-emerald-gradient py-20">
        <div className="mx-auto max-w-5xl px-5 text-center">
          <p className="eyebrow text-gold-soft">Need anything?</p>
          <h2 className="mt-3 text-4xl text-primary-foreground sm:text-5xl">Reach out to us</h2>
          <span className="gold-rule mx-auto mt-6 max-w-xs" />
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {contacts.map((c) => (
              <a
                key={c.phone}
                href={`tel:${c.phone}`}
                className="rounded-sm border border-primary-foreground/25 p-6 transition-colors hover:bg-primary-foreground/10"
              >
                <Phone className="mx-auto h-5 w-5 text-gold-soft" />
                <p className="mt-4 font-display text-xl text-primary-foreground">{c.name}</p>
                <p className="text-xs tracking-widest text-primary-foreground/70 uppercase">
                  {c.role}
                </p>
                <p className="mt-2 text-sm text-primary-foreground/90">{c.phone}</p>
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
