import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { wedding } from "@/lib/wedding";
import { Camera, Loader2, UploadCloud } from "lucide-react";

export const Route = createFileRoute("/memories")({
  head: () => ({
    meta: [
      { title: `Share your photos — ${wedding.bride} & ${wedding.groom}` },
      {
        name: "description",
        content:
          "Upload the photos you took on the Nikkah day and add them to our shared memory wall.",
      },
      { property: "og:title", content: "Share your Nikkah day photos" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        property: "og:description",
        content: "Upload the photos you took and add them to our shared memory wall.",
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
  created_at: string;
};

function MemoriesPage() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [urls, setUrls] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [guestName, setGuestName] = useState("");
  const [caption, setCaption] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

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
    let uploaded = 0;

    for (const file of Array.from(files).slice(0, 10)) {
      if (!file.type.startsWith("image/")) continue;
      if (file.size > 15 * 1024 * 1024) continue;
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("memories")
        .upload(path, file, { contentType: file.type });
      if (upErr) continue;
      const { error: rowErr } = await supabase.from("memories").insert({
        image_path: path,
        guest_name: guestName.trim().slice(0, 60) || null,
        caption: caption.trim().slice(0, 200) || null,
      });
      if (!rowErr) uploaded += 1;
    }

    setUploading(false);
    setCaption("");
    if (fileRef.current) fileRef.current.value = "";
    setStatus(
      uploaded > 0
        ? `Thank you! ${uploaded} photo${uploaded > 1 ? "s" : ""} added to the wall.`
        : "Sorry, those photos could not be uploaded. Please try again.",
    );
    void load();
  }

  return (
    <main>
      <section className="bg-emerald-gradient px-5 py-20 text-center">
        <p className="eyebrow text-gold-soft">Nikkah day</p>
        <h1 className="mt-3 text-5xl text-primary-foreground">Memory wall</h1>
        <span className="gold-rule mx-auto mt-6 max-w-xs" />
        <p className="mx-auto mt-6 max-w-xl text-primary-foreground/85">
          Took a photo today? Add it here so {wedding.bride} and {wedding.groom} can keep every
          moment they didn't get to see.
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

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
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
            {uploading ? "Uploading…" : "Choose photos to upload"}
          </button>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Up to 10 photos at a time, 15MB each. They appear on the wall straight away.
          </p>
          {status && <p className="mt-4 text-center text-sm text-foreground">{status}</p>}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 pb-24">
        {loading ? (
          <p className="text-center text-muted-foreground">Loading the wall…</p>
        ) : memories.length === 0 ? (
          <div className="rounded-sm border border-dashed border-gold/40 py-20 text-center">
            <Camera className="mx-auto h-6 w-6 text-gold" />
            <p className="mt-4 font-display text-xl">No photos yet</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Be the first to share a memory from the day.
            </p>
          </div>
        ) : (
          <div className="columns-2 gap-4 sm:columns-3">
            {memories.map((m) => (
              <figure
                key={m.id}
                className="animate-rise mb-4 break-inside-avoid overflow-hidden rounded-sm border border-gold/25 bg-card"
              >
                {urls[m.image_path] && (
                  <img
                    src={urls[m.image_path]}
                    alt={m.caption ?? "Guest photo"}
                    loading="lazy"
                    className="w-full object-cover"
                  />
                )}
                {(m.caption || m.guest_name) && (
                  <figcaption className="px-3 py-3 text-xs text-muted-foreground">
                    {m.caption}
                    {m.guest_name && (
                      <span className="mt-1 block text-foreground">— {m.guest_name}</span>
                    )}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
