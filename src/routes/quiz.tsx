import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { quiz, wedding } from "@/lib/wedding";
import { Check, Heart, RotateCcw, Sparkles, X } from "lucide-react";

export const Route = createFileRoute("/quiz")({
  head: () => ({
    meta: [
      { title: `How well do you know ${wedding.bride}? — ${wedding.bride} & ${wedding.groom}` },
      {
        name: "description",
        content: `A fun little quiz for ${wedding.bride}'s friends ahead of the Nikkah — how well do you really know the bride?`,
      },
      {
        property: "og:title",
        content: `How well do you know ${wedding.bride}?`,
      },
      {
        property: "og:description",
        content: `Take the quiz and prove your friendship before ${wedding.bride}'s big day.`,
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: QuizPage,
});

function resultFor(score: number) {
  return [...quiz.results].sort((a, b) => b.min - a.min).find((r) => score >= r.min)!;
}

function QuizPage() {
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const total = quiz.questions.length;
  const current = quiz.questions[step];

  function pick(index: number) {
    if (picked !== null) return;
    setPicked(index);
    if (index === current.answer) setScore((s) => s + 1);
  }

  function next() {
    if (step + 1 >= total) {
      setFinished(true);
    } else {
      setStep((s) => s + 1);
      setPicked(null);
    }
  }

  function restart() {
    setStep(0);
    setPicked(null);
    setScore(0);
    setFinished(false);
  }

  return (
    <main className="bg-emerald-gradient min-h-[80vh] px-5 py-24">
      <div className="mx-auto max-w-2xl">
        <div className="text-center">
          <p className="eyebrow text-gold-soft">A little game before the big day</p>
          <h1 className="mt-3 text-4xl text-primary-foreground sm:text-5xl">{quiz.title}</h1>
          <span className="gold-rule mx-auto mt-6 max-w-xs" />
          <p className="mt-6 text-primary-foreground/85">{quiz.intro}</p>
        </div>

        {finished ? (
          <div className="animate-rise mt-12 rounded-sm border border-gold/40 bg-card p-10 text-center shadow-elegant">
            <Sparkles className="mx-auto h-8 w-8 text-gold" />
            <p className="mt-4 font-display text-5xl text-foreground">
              {score} / {total}
            </p>
            <p className="mt-2 font-script text-4xl text-foreground">
              {resultFor(score).label}
            </p>
            <p className="mt-4 text-muted-foreground">{resultFor(score).message}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <button
                onClick={restart}
                className="inline-flex items-center gap-2 rounded-sm border border-gold/60 px-6 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent/20"
              >
                <RotateCcw className="h-4 w-4" /> Play again
              </button>
              <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-sm bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <Heart className="h-4 w-4" /> Back to the invitation
              </Link>
            </div>
          </div>
        ) : (
          <div className="animate-rise mt-12 rounded-sm border border-gold/40 bg-card p-6 shadow-elegant sm:p-10">
            <div className="flex items-center justify-between">
              <p className="eyebrow">
                Question {step + 1} of {total}
              </p>
              <p className="eyebrow text-gold">Score: {score}</p>
            </div>
            <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-gold transition-all duration-500"
                style={{ width: `${(step / total) * 100}%` }}
              />
            </div>

            <h2 className="mt-8 font-display text-2xl text-foreground sm:text-3xl">
              {current.question}
            </h2>

            <div className="mt-8 grid gap-3">
              {current.options.map((option, i) => {
                const isAnswer = i === current.answer;
                const isPicked = i === picked;
                let cls =
                  "flex items-center justify-between rounded-sm border px-4 py-3 text-left text-sm transition-all";
                if (picked === null) {
                  cls +=
                    " border-border bg-background text-foreground hover:border-gold hover:bg-accent/10";
                } else if (isAnswer) {
                  cls += " border-gold bg-primary text-primary-foreground";
                } else if (isPicked) {
                  cls += " border-destructive/60 bg-destructive/10 text-foreground";
                } else {
                  cls += " border-border bg-background text-muted-foreground opacity-60";
                }
                return (
                  <button key={option} onClick={() => pick(i)} disabled={picked !== null} className={cls}>
                    <span>{option}</span>
                    {picked !== null && isAnswer && <Check className="h-4 w-4 text-gold-soft" />}
                    {picked !== null && isPicked && !isAnswer && (
                      <X className="h-4 w-4 text-destructive" />
                    )}
                  </button>
                );
              })}
            </div>

            {picked !== null && (
              <div className="animate-rise mt-8 text-center">
                <p className="text-sm text-muted-foreground">
                  {picked === current.answer
                    ? "Correct — you really know her!"
                    : `Not quite — the answer is “${current.options[current.answer]}”.`}
                </p>
                <button
                  onClick={next}
                  className="mt-4 inline-flex items-center justify-center rounded-sm bg-gold px-8 py-2.5 text-sm font-medium text-accent-foreground transition-colors hover:bg-gold-soft"
                >
                  {step + 1 >= total ? "See my result" : "Next question"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
