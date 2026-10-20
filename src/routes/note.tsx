import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { hashWord, isLetterFullyOpen, noteToFatima, wedding } from "@/lib/wedding";
import { Heart, Lock, LockOpen } from "lucide-react";

export const Route = createFileRoute("/note")({
  head: () => ({
    meta: [
      { title: `A note for ${wedding.bride}` },
      {
        name: "description",
        content: `A personal letter written for ${wedding.bride} on her Nikkah day.`,
      },
      { property: "og:title", content: `A note for ${wedding.bride}` },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        property: "og:description",
        content: `A personal letter written for ${wedding.bride} on her Nikkah day.`,
      },
    ],
  }),
  component: NotePage,
});

function NotePage() {
  const [open, setOpen] = useState(false);
  const [full, setFull] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  const shown = full
    ? noteToFatima.paragraphs
    : noteToFatima.paragraphs.slice(0, noteToFatima.teaserParagraphs);
  const [code, setCode] = useState("");
  const [checking, setChecking] = useState(false);
  const [wrong, setWrong] = useState(false);

  async function tryUnlock(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) return;
    setChecking(true);
    setWrong(false);
    const digest = await hashWord(code);
    setChecking(false);
    if (digest === noteToFatima.secretHash) {
      const preview = new URLSearchParams(window.location.search).get("preview") === "full";
      setFull(preview || isLetterFullyOpen());
      setOpen(true);
    } else {
      setWrong(true);
    }
  }

  return (
    <main className="bg-emerald-gradient min-h-[80vh] px-5 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <p className="eyebrow text-gold-soft">Written just for her</p>
        <h1 className="mt-3 text-5xl text-primary-foreground">A note for {wedding.bride}</h1>
        <span className="gold-rule mx-auto mt-6 max-w-xs" />

        {!open && !unlocking && (
          <button
            onClick={() => setUnlocking(true)}
            className="animate-float mt-14 inline-flex flex-col items-center gap-4 rounded-sm border border-gold/60 bg-card/10 px-12 py-10 backdrop-blur-sm transition-transform hover:scale-105"
          >
            <Lock className="h-8 w-8 text-gold-soft" />
            <span className="font-display text-2xl text-primary-foreground">
              Open your letter
            </span>
            <span className="eyebrow text-primary-foreground/70">
              Sealed — for {wedding.bride}'s eyes only
            </span>
          </button>
        )}

        {!open && unlocking && (
          <form
            onSubmit={tryUnlock}
            className="animate-rise mx-auto mt-14 max-w-md rounded-sm border border-gold/40 bg-card/10 p-8 backdrop-blur-sm"
          >
            <LockOpen className="mx-auto h-6 w-6 text-gold-soft" />
            <p className="mt-4 font-display text-xl text-primary-foreground">
              {noteToFatima.question}
            </p>
            <input
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setWrong(false);
              }}
              autoFocus
              maxLength={40}
              placeholder="Enter the surname…"
              aria-label="Secret word"
              className="mt-6 w-full rounded-sm border border-primary-foreground/30 bg-primary-foreground/10 px-3 py-2.5 text-center text-sm text-primary-foreground placeholder:text-primary-foreground/40 outline-none focus:border-gold"
            />
            {wrong && (
              <p className="animate-rise mt-3 text-sm text-gold-soft">
                That's not it — try again, {wedding.bride} would know this one.
              </p>
            )}
            <button
              type="submit"
              disabled={checking}
              className="mt-6 inline-flex items-center justify-center rounded-sm bg-gold px-8 py-2.5 text-sm font-medium text-accent-foreground transition-colors hover:bg-gold-soft disabled:opacity-60"
            >
              {checking ? "Checking…" : "Unlock the letter"}
            </button>
          </form>
        )}

        {open && (
          <article className="animate-rise mt-14 rounded-sm border border-gold/40 bg-card p-8 text-left shadow-elegant sm:p-12">
            <p className="font-script text-4xl text-foreground">{noteToFatima.greeting}</p>
            <div className="mt-8 space-y-6">
              {noteToFatima.paragraphs.map((p, i) => (
                <p
                  key={p}
                  className="animate-rise font-display text-lg leading-relaxed text-foreground"
                  style={{ animationDelay: `${0.25 + i * 0.25}s` }}
                >
                  {p}
                </p>
              ))}
            </div>
            <span className="gold-rule my-8" />
            <p
              className="animate-rise font-script text-3xl text-foreground"
              style={{ animationDelay: `${0.3 + noteToFatima.paragraphs.length * 0.25}s` }}
            >
              {noteToFatima.signature}
            </p>
          </article>
        )}
      </div>
    </main>
  );
}
