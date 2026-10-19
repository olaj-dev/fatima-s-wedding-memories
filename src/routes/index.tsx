import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Countdown } from "@/components/Countdown";
import { Button } from "@/components/ui/button";
import { wedding, ayah, programme, contacts, gifts, rsvp, telHref, whatsappHref } from "@/lib/wedding";
import hero from "@/assets/intro-4.jpg";
import { MapPin, Phone, Clock, Camera, Heart, Copy, Check } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${wedding.bride} & ${wedding.groom} — Our Nikkah` },
      {
        name: "description",
        content: `Join ${wedding.bride} and ${wedding.groom} on ${wedding.dateLabel} at ${wedding.venue}. Countdown, order of events, photos and directions.`,
      },
      { property: "og:title", content: `${wedding.bride} & ${wedding.groom} — Our Nikkah` },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        property: "og:description",
        content: `Our Nikkah holds ${wedding.dateLabel} at ${wedding.venue}. You are warmly invited.`,
      },
    ],
  }),
  component: Home,
});

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

function RsvpSection() {
  const [name, setName] = useState("");
  const [choice, setChoice] = useState<boolean | null>(null);
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || choice === null) {
      setError("Please tell us your name and whether you can make it.");
      return;
    }
    setSending(true);
    setError(null);
    const { error: insertError } = await supabase.from("rsvps").insert({
      full_name: name.trim().slice(0, 100),
      attending: choice,
      email: email.trim().slice(0, 120) || null,
      note: note.trim().slice(0, 500) || null,
    });
    setSending(false);
    if (insertError) {
      setError("Something went wrong — please try again.");
      return;
    }
    setDone(true);
  }

  const inputClass =
    "mt-2 w-full rounded-sm border border-primary-foreground/30 bg-primary-foreground/10 px-3 py-2.5 text-sm text-primary-foreground placeholder:text-primary-foreground/40 outline-none focus:border-gold";

  return (
    <section id="rsvp" className="bg-emerald-gradient px-5 py-20">
      <div className="mx-auto max-w-2xl">
        <div className="text-center">
          <p className="eyebrow text-gold-soft">R.S.V.P</p>
          <h2 className="mt-3 text-4xl text-primary-foreground sm:text-5xl">
            Will you be joining us?
          </h2>
          <span className="gold-rule mx-auto mt-6 max-w-xs" />
          <p className="mt-6 text-primary-foreground/85">{rsvp.intro}</p>
        </div>

        {done ? (
          <div className="animate-rise mt-10 rounded-sm border border-gold/40 bg-primary/40 p-10 text-center">
            <Heart className="mx-auto h-6 w-6 text-gold" />
            <p className="mt-4 font-display text-2xl text-primary-foreground">
              Thank you{name.trim() ? `, ${name.trim().split(" ")[0]}` : ""}!
            </p>
            <p className="mt-2 text-sm text-primary-foreground/80">
              {choice ? rsvp.successAccepted : rsvp.successDeclined}
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-10 rounded-sm border border-primary-foreground/25 bg-primary/40 p-6 sm:p-10"
          >
            <label className="block">
              <span className="eyebrow text-gold-soft">Your name</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={100}
                placeholder="Full name"
                className={inputClass}
              />
            </label>

            <span className="eyebrow mt-6 block text-gold-soft">Will you attend?</span>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <Button
                type="button"
                variant="ghost"
                aria-pressed={choice === true}
                onClick={() => setChoice(true)}
                className={`h-auto rounded-full border px-4 py-2.5 text-sm transition-colors ${
                  choice === true
                    ? "border-gold bg-gold/20 text-primary-foreground"
                    : "border-primary-foreground/30 text-primary-foreground/80 hover:border-gold/60"
                }`}
              >
                Joyfully accept
              </Button>
              <Button
                type="button"
                variant="ghost"
                aria-pressed={choice === false}
                onClick={() => setChoice(false)}
                className={`h-auto rounded-full border px-4 py-2.5 text-sm transition-colors ${
                  choice === false
                    ? "border-gold bg-gold/20 text-primary-foreground"
                    : "border-primary-foreground/30 text-primary-foreground/80 hover:border-gold/60"
                }`}
              >
                Regrettably decline
              </Button>
            </div>

            <label className="mt-6 block">
              <span className="eyebrow text-gold-soft">Email (optional)</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                maxLength={120}
                placeholder="you@example.com"
                className={inputClass}
              />
            </label>

            <label className="mt-6 block">
              <span className="eyebrow text-gold-soft">A note for the couple (optional)</span>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                maxLength={500}
                rows={4}
                placeholder="Share your wishes…"
                className={`${inputClass} resize-none`}
              />
            </label>

            <Button
              type="submit"
              variant="ghost"
              disabled={sending}
              className="mt-8 inline-flex h-auto w-full items-center justify-center rounded-full border border-gold px-6 py-3 text-sm tracking-widest text-gold uppercase transition-colors hover:bg-gold hover:text-accent-foreground disabled:opacity-60"
            >
              {sending ? "Sending…" : "Send RSVP"}
            </Button>
            {error && (
              <p className="mt-4 text-center text-sm text-destructive-foreground">{error}</p>
            )}
          </form>
        )}
      </div>
    </section>
  );
}

function GiftsSection() {
  const [copied, setCopied] = useState(false);

  async function copyAccount() {
    try {
      await navigator.clipboard.writeText(gifts.bank.accountNumber);
    } catch {
      const el = document.createElement("textarea");
      el.value = gifts.bank.accountNumber;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <section id="gifts" className="bg-emerald-gradient px-5 py-20 text-center">
      <p className="eyebrow text-gold-soft">Gifts</p>
      <h2 className="mt-3 font-display text-4xl italic text-gold-gradient sm:text-5xl">
        Your presence is our gift
      </h2>
      <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-primary-foreground/80">
        {gifts.intro}
      </p>
      <div className="mx-auto mt-10 max-w-md rounded-sm border border-gold/40 bg-primary/40 p-6 text-left shadow-elegant sm:p-8">
        <p className="eyebrow text-gold-soft">Bank</p>
        <p className="mt-2 font-display text-xl text-primary-foreground">{gifts.bank.bank}</p>

        <p className="eyebrow mt-6 text-gold-soft">Account name</p>
        <p className="mt-2 font-display text-xl text-primary-foreground">
          {gifts.bank.accountName}
        </p>

        <p className="eyebrow mt-6 text-gold-soft">Account number</p>
        <div className="mt-2 flex items-center justify-between gap-4">
          <span className="font-display text-3xl tracking-[0.2em] text-gold sm:text-4xl">
            {gifts.bank.accountNumber}
          </span>
          <button
            onClick={() => void copyAccount()}
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-gold/60 px-4 py-2 text-xs tracking-widest text-gold uppercase transition-colors hover:bg-gold/15"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>

        <p className="mt-6 text-xs text-primary-foreground/70">{gifts.bank.hint}</p>
      </div>
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
          alt={`The engagement ring for ${wedding.bride} and ${wedding.groom}`}
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

      {/* RSVP */}
      <RsvpSection />

      {/* Gifts */}
      <GiftsSection />

      {/* Contacts */}
      <section className="bg-emerald-gradient py-20">
        <div className="mx-auto max-w-5xl px-5 text-center">
          <p className="eyebrow text-gold-soft">Need anything?</p>
          <h2 className="mt-3 text-4xl text-primary-foreground sm:text-5xl">Reach out to us</h2>
          <span className="gold-rule mx-auto mt-6 max-w-xs" />
          <div className="mt-10 mx-auto grid max-w-2xl gap-6 sm:grid-cols-2">
            {contacts.map((c) => (
              <div
                key={c.phone}
                className="rounded-sm border border-primary-foreground/25 p-6 transition-colors hover:border-gold/50"
              >
                <Phone className="mx-auto h-5 w-5 text-gold-soft" />
                <p className="mt-4 font-display text-xl text-primary-foreground">{c.name}</p>
                <p className="mt-1 text-sm text-primary-foreground/90">{c.phone}</p>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <a
                    href={telHref(c.phone)}
                    aria-label={`Call ${c.name}`}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-gold bg-gold px-4 py-2 text-xs tracking-widest text-accent-foreground uppercase transition-transform hover:scale-105"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    Call
                  </a>
                  <a
                    href={whatsappHref(c.phone)}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Message ${c.name} on WhatsApp`}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-primary-foreground/50 px-4 py-2 text-xs tracking-widest text-primary-foreground uppercase transition-colors hover:bg-primary-foreground/10"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                      className="h-3.5 w-3.5"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                    </svg>
                    WhatsApp
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
