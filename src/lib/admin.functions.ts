import { createServerFn } from "@tanstack/react-start";
import { useSession } from "@tanstack/react-start/server";
import { createHash, timingSafeEqual } from "node:crypto";
import { z } from "zod";
import { mapRow, type StoreProductRow } from "./catalog.functions";

type AdminSession = { unlocked?: boolean };

function sessionConfig() {
  return {
    password: process.env["SESSION_SECRET"]!,
    name: "lrl-admin",
    maxAge: 60 * 60 * 24 * 14,
    cookie: {
      httpOnly: true,
      secure: process.env["NODE_ENV"] === "production",
      sameSite: "lax" as const,
      path: "/",
    },
  };
}

function pinMatches(input: string, expected: string) {
  const a = createHash("sha256").update(input, "utf8").digest();
  const b = createHash("sha256").update(expected, "utf8").digest();
  return timingSafeEqual(a, b);
}

async function requireAdmin() {
  const session = await useSession<AdminSession>(sessionConfig());
  if (!session.data.unlocked) throw new Error("Unauthorized");
}

async function admin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

export const adminStatus = createServerFn({ method: "GET" }).handler(async () => {
  const session = await useSession<AdminSession>(sessionConfig());
  return { unlocked: session.data.unlocked === true };
});

export const adminLogin = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => z.object({ pin: z.string().min(1).max(64) }).parse(data))
  .handler(async ({ data }) => {
    const expected = process.env["ADMIN_PIN"];
    if (!expected) throw new Error("Admin passcode is not configured.");
    if (!pinMatches(data.pin.trim(), expected)) return { ok: false as const };
    const session = await useSession<AdminSession>(sessionConfig());
    await session.update({ unlocked: true });
    return { ok: true as const };
  });

export const adminLogout = createServerFn({ method: "POST" }).handler(async () => {
  const session = await useSession<AdminSession>(sessionConfig());
  await session.clear();
  return { ok: true as const };
});

export const adminListProducts = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin();
  const supabase = await admin();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error("Could not load products.");
  return (data ?? []).map(mapRow) as StoreProductRow[];
});

const productSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(2).max(140),
  category: z.enum(["beds", "wardrobes", "sofas", "mattresses"]),
  pricePence: z.number().int().min(1).max(10_000_000),
  wasPence: z.number().int().min(0).max(10_000_000).nullable().optional(),
  imageUrl: z.string().trim().max(500).nullable().optional(),
  summary: z.string().trim().max(300).default(""),
  description: z.string().trim().max(4000).default(""),
  details: z.array(z.string().trim().min(1).max(200)).max(20).default([]),
  dimensions: z.string().trim().max(200).default(""),
  leadTime: z.string().trim().max(120).default("Delivered in 2 to 3 weeks"),
  visible: z.boolean().default(true),
});

function slugify(name: string) {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80) || "product"
  );
}

export const adminSaveProduct = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => productSchema.parse(data))
  .handler(async ({ data }) => {
    await requireAdmin();
    const supabase = await admin();

    const payload = {
      name: data.name,
      category: data.category,
      price_pence: data.pricePence,
      was_pence: data.wasPence && data.wasPence > 0 ? data.wasPence : null,
      image_url: data.imageUrl || null,
      summary: data.summary,
      description: data.description,
      details: data.details,
      dimensions: data.dimensions,
      lead_time: data.leadTime,
      visible: data.visible,
      updated_at: new Date().toISOString(),
    };

    if (data.id) {
      const { error } = await supabase.from("products").update(payload).eq("id", data.id);
      if (error) throw new Error("Could not save this product.");
      return { ok: true as const, id: data.id };
    }

    let slug = slugify(data.name);
    const { data: existing } = await supabase.from("products").select("slug").eq("slug", slug);
    if (existing && existing.length > 0) slug = `${slug}-${Date.now().toString(36).slice(-4)}`;

    const { data: inserted, error } = await supabase
      .from("products")
      .insert({ ...payload, slug })
      .select("id")
      .single();
    if (error || !inserted) throw new Error("Could not create this product.");
    return { ok: true as const, id: inserted.id };
  });

export const adminSetVisible = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z.object({ id: z.string().uuid(), visible: z.boolean() }).parse(data),
  )
  .handler(async ({ data }) => {
    await requireAdmin();
    const supabase = await admin();
    const { error } = await supabase
      .from("products")
      .update({ visible: data.visible, updated_at: new Date().toISOString() })
      .eq("id", data.id);
    if (error) throw new Error("Could not update visibility.");
    return { ok: true as const };
  });

export const adminDeleteProduct = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data }) => {
    await requireAdmin();
    const supabase = await admin();
    const { error } = await supabase.from("products").delete().eq("id", data.id);
    if (error) throw new Error("Could not delete this product.");
    return { ok: true as const };
  });

export const adminUploadImage = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z
      .object({
        dataUrl: z
          .string()
          .max(9_000_000)
          .regex(/^data:image\/(jpeg|png|webp);base64,/, "Please choose a photo."),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    await requireAdmin();
    const supabase = await admin();

    const [header, base64] = data.dataUrl.split(",", 2);
    const contentType = header!.slice(5, header!.indexOf(";"));
    const ext = contentType.split("/")[1] === "png" ? "png" : contentType.split("/")[1] === "webp" ? "webp" : "jpg";
    const bytes = Uint8Array.from(atob(base64!), (c) => c.charCodeAt(0));
    const path = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const { error } = await supabase.storage.from("product-images").upload(path, bytes, {
      contentType,
      upsert: false,
    });
    if (error) {
      console.error("Upload failed", error);
      throw new Error("Could not upload that photo.");
    }

    return { url: `/api/public/product-image/${path}` };
  });
