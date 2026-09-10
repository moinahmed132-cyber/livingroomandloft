import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export type StoreProductRow = {
  id: string;
  slug: string;
  name: string;
  category: string;
  pricePence: number;
  wasPence: number | null;
  imageUrl: string | null;
  summary: string;
  description: string;
  details: string[];
  dimensions: string;
  leadTime: string;
  visible: boolean;
};

type DbRow = Database["public"]["Tables"]["products"]["Row"];

export function mapRow(row: DbRow): StoreProductRow {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category,
    pricePence: row.price_pence,
    wasPence: row.was_pence,
    imageUrl: row.image_url,
    summary: row.summary,
    description: row.description,
    details: Array.isArray(row.details) ? (row.details as string[]) : [],
    dimensions: row.dimensions,
    leadTime: row.lead_time,
    visible: row.visible,
  };
}

export function createPublicClient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient<Database>(process.env["SUPABASE_URL"]!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
          h.delete("Authorization");
        }
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

export const listStoreProducts = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("visible", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load products", error);
    return [] as StoreProductRow[];
  }
  return (data ?? []).map(mapRow);
});
