import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { bridalNotes, bridalWeek, quiz, wedding } from "@/lib/wedding";
import { Check, Link2, Sparkles } from "lucide-react";

export const Route = createFileRoute("/bridal-shower")({
  head: () => ({
    meta: [
      { title: `Bridal Shower Week — ${wedding.bride} & ${wedding.groom}` },
      {
        name: "description",
        content:
          "The order of events for Fatima's bridal week, 3rd–7th November 2026 — the Bridal Soirée programme card, makeup & gele details, and the Bridal Soirée quiz.",
      },
      { property: "og:title", content: `Bridal Shower Week 💕 — ${wedding.bride}'s special day` },
      {
        property: "og:description",
        content:
          "Share the 3rd–7th November programme card with the girls — Bridal Soirée, Dance Practice, Henna, Engagement and the Main Wedding.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BridalShowerPage,
});

function buildShareText() {
  const lines = bridalWeek
    .map((d) => `${d.day} ${d.label} — ${d.title}`)
    .join("\n");
  return [
    `💕 ${wedding.bride.toUpperCase()}'S SPECIAL DAY — ORDER OF EVENTS FOR THE WEEK 💕`,
    "",
    lines,
  ].join("\n");
}

function BridalShowerPage() {
  const [copied, setCopied] = useState(false);
  const [showText, setShowText] = useState(false);

  async function shareCard() {
    const text = `${buildShareText()}\n\nFull details: ${window.location.origin}/bridal-shower`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "Fatima's Bridal Week 💕", text });
        return;
      } catch {
        // user dismissed — fall through to copy
      }
    }
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // clipboard unavailable (e.g. HTTP preview) — show it for manual copy
      setShowText(true);
    }
  }

  return (
    <main>
      <section className="bg-emerald-gradient px-5 py-20 text-center">
        <p className="eyebrow text-gold-soft">For the bride's girls</p>
        <h1 className="mt-3 text-5xl text-primary-foreground">Bridal Shower Week</h1>
        <span className="gold-rule mx-auto mt-6 max-w-xs" />
        <p className="mx-auto mt-6 max-w-xl text-primary-foreground/85">
          Everything happening for {wedding.bride}, from the Bridal Soirée on 3rd November to the
          Main Wedding on 7th November. Share the card with the girls and plan ahead.
        </p>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-14">
        {/* Shareable programme card */}
        <div className="animate-rise rounded-sm border border-gold/40 bg-card p-6 shadow-elegant sm:p-8">
          <p className="eyebrow text-center">Order of events</p>
          <h2 className="mt-3 text-center font-display text-3xl">
            {wedding.bride}'s Special Day
          </h2>
          <span className="gold-rule mx-auto mt-5 max-w-[10rem]" />
          <ol className="mt-8 space-y-4">
            {bridalWeek.map((d, i) => (
              <li
                key={d.date}
                className="animate-rise flex items-center gap-4 rounded-sm border border-gold/25 bg-background px-4 py-3.5"
                style={{ animationDelay: `${0.1 + i * 0.08}s` }}
              >
                <span className="font-display text-2xl text-gold">{d.label}</span>
                <span className="h-px flex-1 border-t border-dashed border-gold/30" />
                <span className="font-display text-lg">{d.title}</span>
              </li>
            ))}
          </ol>
          <button
            onClick={() => void shareCard()}
            className="mt-8 inline-flex w-full items-center justify-center gap-3 rounded-sm bg-primary px-6 py-4 text-sm tracking-widest text-primary-foreground uppercase transition-opacity hover:opacity-90"
          >
            {copied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
            {copied ? "Copied to WhatsApp-ready text!" : "Share this card"}
          </button>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Copies the week's programme so you can paste it straight into the bridal group.
          </p>
        </div>

        {/* Quiz launchpad */}
        <div className="animate-rise mt-8 rounded-sm border border-gold/40 bg-primary p-8 text-center shadow-elegant">
          <Sparkles className="mx-auto h-6 w-6 text-gold-soft" />
          <h3 className="mt-4 font-display text-2xl text-primary-foreground">{quiz.title}</h3>
          <p className="mx-auto mt-3 max-w-md text-sm text-primary-foreground/80">{quiz.intro}</p>
          <Link
            to="/quiz"
            className="mt-6 inline-flex items-center justify-center rounded-sm bg-gold px-8 py-3 text-sm font-medium tracking-widest text-accent-foreground uppercase transition-colors hover:bg-gold-soft"
          >
            Play the quiz
          </Link>
        </div>

        {/* Notes for the girls */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {bridalNotes.map((n, i) => (
            <div
              key={n.title}
              className="animate-rise rounded-sm border border-gold/25 bg-card p-5"
              style={{ animationDelay: `${0.15 + i * 0.08}s` }}
            >
              <p className="font-display text-xl">{n.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{n.note}</p>
            </div>
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-muted-foreground">
          Taking photos and videos during the week?{" "}
          <Link
            to="/memories"
            className="font-medium text-foreground underline decoration-gold/60 underline-offset-4 hover:text-gold"
          >
            Add them to the memory wall
          </Link>{" "}
          so {wedding.bride} can keep every moment. ❤️
        </p>
      </section>
    </main>
  );
}
