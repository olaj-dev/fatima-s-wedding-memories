import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { isQuizOpen, quiz, wedding } from "@/lib/wedding";
import { Check, Crown, Heart, Loader2, Lock, Sparkles, Trophy, X } from "lucide-react";

export const Route = createFileRoute("/quiz")({
  head: () => ({
    meta: [
      { title: `How well do you know ${wedding.bride}? — Bridal Soirée game` },
      {
        name: "description",
        content: `The Bridal Soirée quiz for ${wedding.bride}'s friends — 10 questions and a race for the Chief Bridesmaid crown.`,
      },
      { property: "og:title", content: `How well do you know ${wedding.bride}?` },
      {
        property: "og:description",
        content: "10 questions. One crown. Who will be Chief Bridesmaid?",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: QuizPage,
});

type Score = { id: string; nickname: string; score: number; total_questions: number; created_at: string };
type Phase = "locked" | "intro" | "playing" | "finished" | "board";

function resultFor(score: number) {
  return [...quiz.results].sort((a, b) => b.min - a.min).find((r) => score >= r.min)!;
}

const timeFmt = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  hour: "numeric",
  minute: "2-digit",
  second: "2-digit",
  hour12: true,
  timeZone: "Africa/Lagos",
});

function QuizPage() {
  const [ready, setReady] = useState(false);
  const [testMode, setTestMode] = useState(false);
  const [phase, setPhase] = useState<Phase>("locked");
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [nickname, setNickname] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [myId, setMyId] = useState<string | null>(null);
  const [board, setBoard] = useState<Score[]>([]);

  useEffect(() => {
    const test = new URLSearchParams(window.location.search).get("test") === "1";
    setTestMode(test);
    setPhase(test || isQuizOpen() ? "intro" : "locked");
    setReady(true);
  }, []);

  const total = quiz.questions.length;
  const current = quiz.questions[Math.min(step, total - 1)]!;

  async function loadBoard(test = testMode) {
    const { data } = await supabase
      .from("quiz_scores")
      .select("id,nickname,score,total_questions,created_at")
      .eq("is_test", test)
      .order("score", { ascending: false })
      .order("created_at", { ascending: true })
      .limit(100);
    setBoard((data as Score[]) ?? []);
  }

  function pick(i: number) {
    if (picked !== null) return;
    setPicked(i);
    if (i === current.answer) setScore((s) => s + 1);
  }

  function next() {
    if (step + 1 >= total) setPhase("finished");
    else {
      setStep((s) => s + 1);
      setPicked(null);
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const name = nickname.trim();
    if (name.length < 2) return setError("Nickname needs at least 2 characters.");
    setSaving(true);
    setError(null);
    const { data, error: err } = await supabase
      .from("quiz_scores")
      .insert({ nickname: name.slice(0, 30), score, total_questions: total, is_test: testMode })
      .select("id")
      .single();
    setSaving(false);
    if (err || !data) return setError("Couldn't save your score — please try again.");
    setMyId(data.id);
    await loadBoard();
    setPhase("board");
  }

  return (
    <main className="bg-emerald-gradient min-h-[80vh] px-5 py-24">
      <div className="mx-auto max-w-2xl">
        <div className="text-center">
          <p className="eyebrow text-gold-soft">Bridal Soirée game</p>
          <h1 className="mt-3 text-4xl text-primary-foreground sm:text-5xl">{quiz.title}</h1>
          <span className="gold-rule mx-auto mt-6 max-w-xs" />
          <p className="mt-6 text-primary-foreground/85">{quiz.intro}</p>
          {testMode && (
            <p className="mt-4 inline-block rounded-full border border-gold/60 px-4 py-1 text-xs text-gold-soft">
              Test mode — scores go to a separate practice board
            </p>
          )}
        </div>

        {!ready && <div className="mt-12 h-40" />}

        {ready && phase === "locked" && <LockedCard onBoard={() => { void loadBoard(); setPhase("board"); }} />}

        {phase === "intro" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60 p-5 backdrop-blur-sm">
            <div className="animate-rise w-full max-w-lg rounded-sm border border-gold/50 bg-card p-8 shadow-elegant">
              <Sparkles className="mx-auto h-7 w-7 text-gold" />
              <h2 className="mt-3 text-center font-display text-3xl text-foreground">How to play</h2>
              <ol className="mt-6 space-y-3">
                {quiz.instructions.map((t, i) => (
                  <li key={t} className="flex gap-3 text-sm text-foreground">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                      {i + 1}
                    </span>
                    <span className="pt-0.5">{t}</span>
                  </li>
                ))}
              </ol>
              <button
                onClick={() => setPhase("playing")}
                className="mt-8 w-full rounded-sm bg-gold px-8 py-3 text-sm font-medium text-accent-foreground transition-colors hover:bg-gold-soft"
              >
                I'm ready — start the quiz
              </button>
            </div>
          </div>
        )}

        {phase === "playing" && (
          <div className="animate-rise mt-12 rounded-sm border border-gold/40 bg-card p-6 shadow-elegant sm:p-10">
            <div className="flex items-center justify-between">
              <p className="eyebrow">Question {step + 1} of {total}</p>
              <p className="eyebrow text-gold">Score: {score}</p>
            </div>
            <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-full bg-gold transition-all duration-500" style={{ width: `${(step / total) * 100}%` }} />
            </div>
            <h2 className="mt-8 font-display text-2xl text-foreground sm:text-3xl">{current.question}</h2>
            <div className="mt-8 grid gap-3">
              {current.options.map((option, i) => {
                const isAnswer = i === current.answer;
                const isPicked = i === picked;
                let cls = "flex items-center justify-between rounded-sm border px-4 py-3 text-left text-sm transition-all";
                if (picked === null) cls += " border-border bg-background text-foreground hover:border-gold hover:bg-accent/10";
                else if (isAnswer) cls += " border-gold bg-primary text-primary-foreground";
                else if (isPicked) cls += " border-destructive/60 bg-destructive/10 text-foreground";
                else cls += " border-border bg-background text-muted-foreground opacity-60";
                return (
                  <button key={option} onClick={() => pick(i)} disabled={picked !== null} className={cls}>
                    <span>{String.fromCharCode(65 + i)}) {option}</span>
                    {picked !== null && isAnswer && <Check className="h-4 w-4 text-gold-soft" />}
                    {picked !== null && isPicked && !isAnswer && <X className="h-4 w-4 text-destructive" />}
                  </button>
                );
              })}
            </div>
            {picked !== null && (
              <div className="animate-rise mt-8 text-center">
                <p className="text-sm text-muted-foreground">
                  {picked === current.answer ? "Correct — you really know her!" : `Not quite — it's “${current.options[current.answer]}”.`}
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

        {phase === "finished" && (
          <div className="animate-rise mt-12 rounded-sm border border-gold/40 bg-card p-10 text-center shadow-elegant">
            <Sparkles className="mx-auto h-8 w-8 text-gold" />
            <p className="mt-4 font-display text-5xl text-foreground">{score} / {total}</p>
            <p className="mt-2 font-script text-4xl text-foreground">{resultFor(score).label}</p>
            <p className="mt-4 text-muted-foreground">{resultFor(score).message}</p>
            <form onSubmit={submit} className="mx-auto mt-8 max-w-sm">
              <label className="eyebrow block">Enter a nickname to join the board</label>
              <input
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                maxLength={30}
                placeholder="e.g. Aisha the Great"
                className="mt-3 w-full rounded-sm border border-input bg-background px-3 py-2.5 text-center text-sm outline-none focus:border-gold"
              />
              {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
              <button
                type="submit"
                disabled={saving}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-sm bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trophy className="h-4 w-4" />}
                Claim my spot
              </button>
            </form>
          </div>
        )}

        {phase === "board" && <Leaderboard board={board} myId={myId} />}
      </div>
    </main>
  );
}

function LockedCard({ onBoard }: { onBoard: () => void }) {
  const [left, setLeft] = useState(() => new Date(quiz.opensAt).getTime() - Date.now());
  useEffect(() => {
    const t = setInterval(() => {
      const ms = new Date(quiz.opensAt).getTime() - Date.now();
      setLeft(ms);
      if (ms <= 0) window.location.reload();
    }, 1000);
    return () => clearInterval(t);
  }, []);
  const s = Math.max(0, Math.floor(left / 1000));
  const parts = [
    [Math.floor(s / 86400), "days"],
    [Math.floor((s % 86400) / 3600), "hrs"],
    [Math.floor((s % 3600) / 60), "min"],
    [s % 60, "sec"],
  ] as const;
  return (
    <div className="animate-rise mt-12 rounded-sm border border-gold/40 bg-card p-10 text-center shadow-elegant">
      <Lock className="mx-auto h-7 w-7 text-gold" />
      <p className="mt-4 font-display text-2xl text-foreground">The quiz opens Tuesday, 3rd November at 5:00 PM</p>
      <div className="mt-6 flex justify-center gap-3">
        {parts.map(([v, l]) => (
          <div key={l} className="min-w-16 rounded-sm border border-gold/40 bg-primary px-3 py-2 text-primary-foreground">
            <p className="font-display text-2xl">{v}</p>
            <p className="text-[10px] tracking-widest uppercase opacity-80">{l}</p>
          </div>
        ))}
      </div>
      <button onClick={onBoard} className="mt-8 text-sm text-muted-foreground underline decoration-gold/60 underline-offset-4">
        Peek at the leaderboard
      </button>
    </div>
  );
}

function Leaderboard({ board, myId }: { board: Score[]; myId: string | null }) {
  const myRank = myId ? board.findIndex((b) => b.id === myId) + 1 : 0;
  return (
    <div className="animate-rise mt-12 rounded-sm border border-gold/40 bg-card p-6 shadow-elegant sm:p-10">
      <div className="text-center">
        <Trophy className="mx-auto h-7 w-7 text-gold" />
        <h2 className="mt-3 font-display text-3xl text-foreground">The Bridal Board</h2>
        {myRank > 0 && <p className="mt-2 text-sm text-muted-foreground">You're ranked #{myRank} of {board.length}</p>}
      </div>
      {board.length === 0 ? (
        <p className="mt-8 text-center text-sm text-muted-foreground">No scores yet — the crown is up for grabs.</p>
      ) : (
        <ol className="mt-8 space-y-2">
          {board.map((b, i) => {
            const first = i === 0;
            const mine = b.id === myId;
            return (
              <li
                key={b.id}
                className={`flex items-center gap-3 rounded-sm border px-4 py-3 ${
                  first ? "border-gold bg-primary text-primary-foreground" : mine ? "border-gold bg-accent/20" : "border-border bg-background"
                }`}
              >
                <span className="w-7 font-display text-xl">{first ? <Crown className="h-5 w-5 text-gold-soft" /> : i + 1}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">
                    {b.nickname} {mine && <span className="text-xs opacity-70">(you)</span>}
                  </p>
                  {first && <p className="text-xs text-gold-soft">👑 Chief Bridesmaid</p>}
                  <p className={`text-[11px] ${first ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                    {timeFmt.format(new Date(b.created_at))}
                  </p>
                </div>
                <span className="font-display text-xl">{b.score}/{b.total_questions}</span>
              </li>
            );
          })}
        </ol>
      )}
      <div className="mt-8 text-center">
        <Link to="/bridal-shower" className="inline-flex items-center gap-2 text-sm text-muted-foreground underline decoration-gold/60 underline-offset-4">
          <Heart className="h-4 w-4" /> Back to the bridal week
        </Link>
      </div>
    </div>
  );
}
