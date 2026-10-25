import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MAX_UPLOAD_MB, memoryCategories, wedding } from "@/lib/wedding";
import { Clapperboard, Images, KeyRound, Loader2, Trash2, UploadCloud } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { deleteMemory, verifyAdminPin } from "@/lib/memories.functions";

export const Route = createFileRoute("/memories")({
  head: () => ({
    meta: [
      { title: `Share your photos & videos — ${wedding.bride} & ${wedding.groom}` },
      {
        name: "description",
        content:
          "Upload the photos and videos you took during Fatima's bridal week and the Nikkah day, tag them by event, and add them to our shared memory wall.",
      },
      { property: "og:title", content: "Share your Nikkah day photos & videos" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        property: "og:description",
        content:
          "Upload the photos and videos you took and add them to our shared memory wall.",
      },
    ],
  }),
  component: MemoriesPage,
});

type Memory = {
  id: string;
  image_path: string;
  guest_name: string | null;
  caption: string | null;
  media_type: string;
  category: string;
  created_at: string;
};

type Filter = "all" | "videos" | (typeof memoryCategories)[number]["id"];

const categoryLabel = (id: string) =>
  memoryCategories.find((c) => c.id === id)?.label ?? "General";

function MemoriesPage() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [urls, setUrls] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [guestName, setGuestName] = useState("");
  const [caption, setCaption] = useState("");
  const [category, setCategory] = useState<string>("general");
  const [filter, setFilter] = useState<Filter>("all");
  const fileRef = useRef<HTMLInputElement>(null);
  const [adminPin, setAdminPin] = useState<string | null>(null);
  const [pinOpen, setPinOpen] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const taps = useRef<number[]>([]);
  const verifyPinFn = useServerFn(verifyAdminPin);
  const deleteFn = useServerFn(deleteMemory);

  function onTitleTap() {
    const now = Date.now();
    taps.current = [...taps.current.filter((t) => now - t < 1200), now];
    if (taps.current.length >= 3) {
      taps.current = [];
      if (!adminPin) {
        setPinInput("");
        setPinError(null);
        setPinOpen(true);
      }
    }
  }

  async function submitPin() {
    const res = await verifyPinFn({ data: { pin: pinInput } });
    if (res.ok) {
      setAdminPin(pinInput);
      setPinOpen(false);
    } else {
      setPinError("Incorrect PIN");
    }
  }

  function removeMemory(id: string) {
    if (!adminPin) return;
    setDeleteError(null);
    setConfirmId(id);
  }

  async function confirmDelete() {
    const id = confirmId;
    if (!adminPin || !id) return;
    setDeletingId(id);
    const res = await deleteFn({ data: { pin: adminPin, id } });
    setDeletingId(null);
    if (res.ok) {
      setMemories((ms) => ms.filter((m) => m.id !== id));
      setConfirmId(null);
    } else setDeleteError("Sorry, that could not be deleted. Please try again.");
  }

  async function load() {
    const { data, error } = await supabase
      .from("memories")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);

    if (!error && data) {
      setMemories(data as Memory[]);
      const paths = (data as Memory[]).map((m) => m.image_path);
      if (paths.length) {
        const { data: signed } = await supabase.storage
          .from("memories")
          .createSignedUrls(paths, 60 * 60);
        const map: Record<string, string> = {};
        signed?.forEach((s) => {
          if (s.path && s.signedUrl) map[s.path] = s.signedUrl;
        });
        setUrls(map);
      }
    }
    setLoading(false);
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setStatus(null);
    const maxBytes = MAX_UPLOAD_MB * 1024 * 1024;
    let uploaded = 0;

    for (const file of Array.from(files).slice(0, 10)) {
      const isImage = file.type.startsWith("image/");
      const isVideo = file.type.startsWith("video/");
      if (!isImage && !isVideo) continue;
      if (file.size > maxBytes) continue;
      const ext = file.name.split(".").pop() ?? (isVideo ? "mp4" : "jpg");
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("memories")
        .upload(path, file, { contentType: file.type });
      if (upErr) continue;
      const { error: rowErr } = await supabase.from("memories").insert({
        image_path: path,
        guest_name: guestName.trim().slice(0, 60) || null,
        caption: caption.trim().slice(0, 200) || null,
        media_type: isVideo ? "video" : "image",
        category,
      });
      if (!rowErr) uploaded += 1;
    }

    setUploading(false);
    setCaption("");
    if (fileRef.current) fileRef.current.value = "";
    setStatus(
      uploaded > 0
        ? `Thank you! ${uploaded} file${uploaded > 1 ? "s" : ""} added to the wall.`
        : "Sorry, those files could not be uploaded. Please try again.",
    );
    void load();
  }

  const visible = memories.filter((m) =>
    filter === "all"
      ? true
      : filter === "videos"
        ? m.media_type === "video"
        : m.category === filter,
  );

  const filters: { id: Filter; label: string }[] = [
    { id: "all", label: "All" },
    ...memoryCategories.map((c) => ({ id: c.id as Filter, label: c.label })),
    { id: "videos", label: "Videos Only" },
  ];

  return (
    <main>
      <section className="bg-emerald-gradient px-5 py-20 text-center">
        <p className="eyebrow text-gold-soft">Bridal week to Nikkah day</p>
        <h1
          onClick={onTitleTap}
          style={{ touchAction: "manipulation", WebkitTapHighlightColor: "transparent" }}
          className="mt-3 cursor-default select-none text-5xl text-primary-foreground"
        >
          Memory wall
        </h1>
        {!adminPin && (
          <button
            type="button"
            aria-label="Admin mode"
            onClick={() => {
              setPinInput("");
              setPinError(null);
              setPinOpen(true);
            }}
            className="mt-2 inline-flex p-2 text-primary-foreground/25 hover:text-primary-foreground/60"
            style={{ touchAction: "manipulation" }}
          >
            <KeyRound className="h-3.5 w-3.5" />
          </button>
        )}
        {adminPin && (
          <p className="mt-4 text-xs text-gold-soft">
            Admin mode active •{" "}
            <button type="button" className="underline" onClick={() => setAdminPin(null)}>
              Exit
            </button>
          </p>
        )}
        {confirmId && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60 px-5"
            onClick={() => !deletingId && setConfirmId(null)}
          >
            <div
              className="w-full max-w-sm rounded-2xl bg-card p-6 text-center text-card-foreground shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Trash2 className="mx-auto h-8 w-8 text-destructive" />
              <h2 className="mt-3 text-2xl">Delete this memory?</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                It will be removed from the wall for everyone. This can't be undone.
              </p>
              {deleteError && <p className="mt-3 text-sm text-destructive">{deleteError}</p>}
              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  disabled={!!deletingId}
                  onClick={() => setConfirmId(null)}
                  className="flex-1 rounded-full border border-border px-4 py-2 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!!deletingId}
                  onClick={confirmDelete}
                  className="flex flex-1 items-center justify-center gap-2 rounded-full bg-destructive px-4 py-2 text-sm text-destructive-foreground"
                >
                  {deletingId ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Yes, delete
                </button>
              </div>
            </div>
          </div>
        )}
        {pinOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60 px-5"
            onClick={() => setPinOpen(false)}
          >
            <form
              onClick={(e) => e.stopPropagation()}
              onSubmit={(e) => {
                e.preventDefault();
                void submitPin();
              }}
              className="w-full max-w-xs rounded-sm border border-gold/40 bg-card p-6 text-center shadow-elegant"
            >
              <p className="eyebrow">Admin access</p>
              <input
                autoFocus
                type="password"
                inputMode="numeric"
                maxLength={10}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                aria-label="Admin PIN"
                placeholder="Enter PIN"
                className="mt-4 w-full rounded-sm border border-input bg-background px-3 py-2 text-center text-lg tracking-[0.5em] text-foreground outline-none focus:border-gold"
              />
              {pinError && <p className="mt-2 text-xs text-destructive">{pinError}</p>}
              <button
                type="submit"
                className="mt-4 w-full rounded-sm bg-primary px-4 py-2 text-sm text-primary-foreground"
              >
                Unlock
              </button>
            </form>
          </div>
        )}
        <span className="gold-rule mx-auto mt-6 max-w-xs" />
        <p className="mx-auto mt-6 max-w-xl text-primary-foreground/85">
          Took a photo or video during the bridal week or on the Nikkah day? Add it here so{" "}
          {wedding.bride} and {wedding.groom} can keep every moment they didn't get to see.
        </p>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-14">
        <div className="rounded-sm border border-gold/40 bg-card p-6 shadow-elegant sm:p-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="eyebrow">Your name (optional)</span>
              <input
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                maxLength={60}
                placeholder="e.g. Aunty Zainab"
                className="mt-2 w-full rounded-sm border border-input bg-background px-3 py-2 text-sm outline-none focus:border-gold"
              />
            </label>
            <label className="block">
              <span className="eyebrow">Caption (optional)</span>
              <input
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                maxLength={200}
                placeholder="e.g. Right after the Nikkah"
                className="mt-2 w-full rounded-sm border border-input bg-background px-3 py-2 text-sm outline-none focus:border-gold"
              />
            </label>
          </div>

          <div className="mt-6">
            <span className="eyebrow">What is this for?</span>
            <div className="mt-3 flex flex-wrap gap-2">
              {memoryCategories.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCategory(c.id)}
                  className={`rounded-full border px-4 py-1.5 text-xs transition-colors ${
                    category === c.id
                      ? "border-gold bg-primary text-primary-foreground"
                      : "border-gold/40 bg-background text-muted-foreground hover:border-gold"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <input
            ref={fileRef}
            type="file"
            accept="image/*,video/*"
            multiple
            className="hidden"
            onChange={(e) => void handleUpload(e.target.files)}
          />
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="mt-6 inline-flex w-full items-center justify-center gap-3 rounded-sm bg-primary px-6 py-4 text-sm tracking-widest text-primary-foreground uppercase transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <UploadCloud className="h-4 w-4" />
            )}
            {uploading ? "Uploading…" : "Choose photos or videos"}
          </button>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Up to 10 files at a time, up to 1GB each. Photos and videos appear on the wall straight
            away.
          </p>
          {status && <p className="mt-4 text-center text-sm text-foreground">{status}</p>}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 pb-24">
        <div className="mb-6 flex flex-wrap justify-center gap-2">
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={`rounded-full border px-4 py-1.5 text-xs transition-colors ${
                filter === f.id
                  ? "border-gold bg-primary text-primary-foreground"
                  : "border-gold/40 bg-card text-muted-foreground hover:border-gold"
              }`}
            >
              {f.id === "videos" && <Clapperboard className="mr-1.5 inline h-3 w-3" />}
              {f.label}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-center text-muted-foreground">Loading the wall…</p>
        ) : visible.length === 0 ? (
          <div className="rounded-sm border border-dashed border-gold/40 py-20 text-center">
            <Images className="mx-auto h-6 w-6 text-gold" />
            <p className="mt-4 font-display text-xl">Nothing here yet</p>
            <p className="mt-2 text-sm text-muted-foreground">
              {filter === "all"
                ? "Be the first to share a memory from the week."
                : "No memories match this filter — try another."}
            </p>
          </div>
        ) : (
          <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
            {visible.map((m) => (
              <figure
                key={m.id}
                className="animate-rise mb-4 break-inside-avoid overflow-hidden rounded-sm border border-gold/25 bg-card"
              >
                {m.media_type === "video" ? (
                  urls[m.image_path] && (
                    <video
                      src={urls[m.image_path]}
                      controls
                      preload="metadata"
                      playsInline
                      className="w-full"
                    />
                  )
                ) : (
                  urls[m.image_path] && (
                    <img
                      src={urls[m.image_path]}
                      alt={m.caption ?? "Guest photo"}
                      loading="lazy"
                      className="w-full object-cover"
                    />
                  )
                )}
                {adminPin && (
                  <button
                    type="button"
                    aria-label="Delete this memory"
                    onClick={() => void removeMemory(m.id)}
                    disabled={deletingId === m.id}
                    className="flex w-full items-center justify-center gap-2 bg-destructive px-3 py-2 text-xs text-destructive-foreground disabled:opacity-60"
                  >
                    {deletingId === m.id ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Trash2 className="h-3 w-3" />
                    )}
                    Delete
                  </button>
                )}
                <figcaption className="px-3 py-3 text-xs text-muted-foreground">
                  <span className="mr-2 rounded-full border border-gold/40 px-2 py-0.5 text-[0.65rem] text-foreground">
                    {categoryLabel(m.category)}
                  </span>
                  {m.caption}
                  {m.guest_name && (
                    <span className="mt-1 block text-foreground">— {m.guest_name}</span>
                  )}
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
