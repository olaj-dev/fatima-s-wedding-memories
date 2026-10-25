import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { isValidAdminPin } from "./memories-admin.server";

export const verifyAdminPin = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ pin: z.string().max(20) }).parse(d))
  .handler(async ({ data }) => ({ ok: isValidAdminPin(data.pin) }));

export const deleteMemory = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z.object({ pin: z.string().max(20), id: z.string().uuid() }).parse(d),
  )
  .handler(async ({ data }) => {
    if (!isValidAdminPin(data.pin)) return { ok: false, error: "Wrong PIN" };
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row } = await supabaseAdmin
      .from("memories")
      .select("image_path")
      .eq("id", data.id)
      .maybeSingle();
    if (!row) return { ok: false, error: "Not found" };
    await supabaseAdmin.storage.from("memories").remove([row.image_path]);
    const { error } = await supabaseAdmin.from("memories").delete().eq("id", data.id);
    if (error) return { ok: false, error: "Could not delete" };
    return { ok: true };
  });
