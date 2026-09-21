import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { noteToFatima, wedding } from "@/lib/wedding";
import { Heart } from "lucide-react";

export const Route = createFileRoute("/note")({
  head: () => ({
    meta: [
      { title: `A note for ${wedding.bride}` },
      {
        name: "description",
        content: `A personal letter written for ${wedding.bride} on her Nikkah day.`,
      },
      { property: "og:title", content: `A note for ${wedding.bride}` },
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

  return (
    <main className="bg-emerald-gradient min-h-[80vh] px-5 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <p className="eyebrow text-gold-soft">Written just for her</p>
        <h1 className="mt-3 text-5xl text-primary-foreground">A note for {wedding.bride}</h1>
        <span className="gold-rule mx-auto mt-6 max-w-xs" />

        {!open && (
          <button
            onClick={() => setOpen(true)}
            className="animate-float mt-14 inline-flex flex-col items-center gap-4 rounded-sm border border-gold/60 bg-card/10 px-12 py-10 backdrop-blur-sm transition-transform hover:scale-105"
          >
            <Heart className="h-8 w-8 text-gold-soft" />
            <span className="font-display text-2xl text-primary-foreground">
              Open your letter
            </span>
            <span className="eyebrow text-primary-foreground/70">Tap to read</span>
          </button>
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
