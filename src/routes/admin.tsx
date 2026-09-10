import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import {
  adminDeleteProduct,
  adminListProducts,
  adminLogin,
  adminLogout,
  adminSaveProduct,
  adminSetVisible,
  adminStatus,
  adminUploadImage,
} from "@/lib/admin.functions";
import type { StoreProductRow } from "@/lib/catalog.functions";
import { gbp } from "@/lib/format";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Shop admin — Living Room & Loft" },
      { name: "description", content: "Private area for managing the Living Room & Loft catalogue." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Shop admin — Living Room & Loft" },
      { property: "og:description", content: "Private catalogue management." },
    ],
  }),
  component: AdminPage,
});

const CATEGORIES = [
  { value: "beds", label: "Beds" },
  { value: "wardrobes", label: "Wardrobes" },
  { value: "sofas", label: "Sofas" },
  { value: "mattresses", label: "Mattresses" },
] as const;

type FormState = {
  id?: string;
  name: string;
  category: string;
  price: string;
  wasPrice: string;
  summary: string;
  description: string;
  specs: string;
  dimensions: string;
  leadTime: string;
  imageUrl: string;
  visible: boolean;
};

const emptyForm: FormState = {
  name: "",
  category: "beds",
  price: "",
  wasPrice: "",
  summary: "",
  description: "",
  specs: "",
  dimensions: "",
  leadTime: "Delivered in 2 to 3 weeks",
  imageUrl: "",
  visible: true,
};

function toForm(p: StoreProductRow): FormState {
  return {
    id: p.id,
    name: p.name,
    category: p.category,
    price: (p.pricePence / 100).toFixed(2),
    wasPrice: p.wasPence ? (p.wasPence / 100).toFixed(2) : "",
    summary: p.summary,
    description: p.description,
    specs: p.details.join("\n"),
    dimensions: p.dimensions,
    leadTime: p.leadTime,
    imageUrl: p.imageUrl ?? "",
    visible: p.visible,
  };
}

async function shrinkImage(file: File): Promise<string> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Could not read that photo."));
    reader.readAsDataURL(file);
  });

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const el = new Image();
    el.onload = () => resolve(el);
    el.onerror = () => reject(new Error("Could not read that photo."));
    el.src = dataUrl;
  });

  const max = 1400;
  const scale = Math.min(1, max / Math.max(img.width, img.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(img.width * scale);
  canvas.height = Math.round(img.height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) return dataUrl;
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", 0.82);
}

function AdminPage() {
  const status = useQuery({ queryKey: ["admin-status"], queryFn: () => adminStatus() });

  if (status.isPending) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
      </div>
    );
  }

  return status.data?.unlocked ? <AdminDashboard /> : <PinGate />;
}

function PinGate() {
  const login = useServerFn(adminLogin);
  const queryClient = useQueryClient();
  const [pin, setPin] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(false);
    try {
      const res = await login({ data: { pin } });
      if (res.ok) {
        await queryClient.invalidateQueries({ queryKey: ["admin-status"] });
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-20">
      <p className="eyebrow">Staff only</p>
      <h1 className="mt-2 font-display text-3xl">Shop admin</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Enter the owner passcode to manage the catalogue.
      </p>
      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <input
          className="field w-full text-center text-2xl tracking-[0.4em]"
          type="password"
          inputMode="numeric"
          autoComplete="current-password"
          placeholder="••••••"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
        />
        {error && <p className="text-sm text-destructive">That passcode is not right.</p>}
        <button type="submit" className="btn-primary w-full" disabled={busy || pin.length === 0}>
          {busy ? "Checking…" : "Unlock"}
        </button>
      </form>
    </div>
  );
}

function AdminDashboard() {
  const queryClient = useQueryClient();
  const list = useQuery({ queryKey: ["admin-products"], queryFn: () => adminListProducts() });
  const save = useServerFn(adminSaveProduct);
  const setVisible = useServerFn(adminSetVisible);
  const remove = useServerFn(adminDeleteProduct);
  const upload = useServerFn(adminUploadImage);
  const logout = useServerFn(adminLogout);

  const [form, setForm] = useState<FormState | null>(null);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  async function refresh() {
    await queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    await queryClient.invalidateQueries({ queryKey: ["store-products"] });
  }

  async function onPhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setUploading(true);
    try {
      const dataUrl = await shrinkImage(file);
      const res = await upload({ data: { dataUrl } });
      update("imageUrl", res.url);
      toast.success("Photo uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not upload that photo.");
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form) return;
    const pricePence = Math.round(Number(form.price) * 100);
    if (!Number.isFinite(pricePence) || pricePence <= 0) {
      toast.error("Enter a price in pounds, for example 799.99");
      return;
    }
    const wasPence = form.wasPrice ? Math.round(Number(form.wasPrice) * 100) : null;

    setBusy(true);
    try {
      await save({
        data: {
          ...(form.id ? { id: form.id } : {}),
          name: form.name,
          category: form.category as "beds",
          pricePence,
          wasPence: wasPence && wasPence > 0 ? wasPence : null,
          imageUrl: form.imageUrl || null,
          summary: form.summary,
          description: form.description,
          details: form.specs
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean),
          dimensions: form.dimensions,
          leadTime: form.leadTime,
          visible: form.visible,
        },
      });
      toast.success(form.id ? "Product updated" : "Product added");
      setForm(null);
      await refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save this product.");
    } finally {
      setBusy(false);
    }
  }

  const items = list.data ?? [];

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="eyebrow">Owner</p>
          <h1 className="mt-1 font-display text-3xl">Your products</h1>
        </div>
        <button
          type="button"
          className="text-sm text-muted-foreground underline"
          onClick={async () => {
            await logout({});
            await queryClient.invalidateQueries({ queryKey: ["admin-status"] });
          }}
        >
          Lock
        </button>
      </div>

      {!form && (
        <button
          type="button"
          className="btn-primary mt-6 flex w-full items-center justify-center gap-2"
          onClick={() => setForm(emptyForm)}
        >
          <Plus className="h-4 w-4" aria-hidden="true" /> Add a product
        </button>
      )}

      {form && (
        <form onSubmit={onSubmit} className="mt-6 space-y-4 border border-border bg-card p-4">
          <h2 className="font-display text-xl">{form.id ? "Edit product" : "New product"}</h2>

          <div>
            <label className="text-sm" htmlFor="photo">
              Photo
            </label>
            {form.imageUrl && (
              <img
                src={form.imageUrl}
                alt="Product"
                className="mt-2 aspect-square w-32 object-cover"
              />
            )}
            <input
              id="photo"
              type="file"
              accept="image/*"
              onChange={onPhoto}
              className="field mt-2 w-full text-sm"
            />
            {uploading && <p className="mt-1 text-sm text-muted-foreground">Uploading photo…</p>}
          </div>

          <div>
            <label className="text-sm" htmlFor="name">
              Title
            </label>
            <input
              id="name"
              className="field mt-1 w-full"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm" htmlFor="category">
                Category
              </label>
              <select
                id="category"
                className="field mt-1 w-full"
                value={form.category}
                onChange={(e) => update("category", e.target.value)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm" htmlFor="price">
                Price (£)
              </label>
              <input
                id="price"
                className="field mt-1 w-full"
                inputMode="decimal"
                value={form.price}
                onChange={(e) => update("price", e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="text-sm" htmlFor="wasPrice">
              Was price (£, optional)
            </label>
            <input
              id="wasPrice"
              className="field mt-1 w-full"
              inputMode="decimal"
              value={form.wasPrice}
              onChange={(e) => update("wasPrice", e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm" htmlFor="summary">
              Short summary
            </label>
            <input
              id="summary"
              className="field mt-1 w-full"
              value={form.summary}
              onChange={(e) => update("summary", e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              rows={4}
              className="field mt-1 w-full"
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm" htmlFor="specs">
              Specifications (one per line)
            </label>
            <textarea
              id="specs"
              rows={4}
              className="field mt-1 w-full"
              value={form.specs}
              onChange={(e) => update("specs", e.target.value)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm" htmlFor="dimensions">
                Dimensions
              </label>
              <input
                id="dimensions"
                className="field mt-1 w-full"
                value={form.dimensions}
                onChange={(e) => update("dimensions", e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm" htmlFor="leadTime">
                Delivery text
              </label>
              <input
                id="leadTime"
                className="field mt-1 w-full"
                value={form.leadTime}
                onChange={(e) => update("leadTime", e.target.value)}
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.visible}
              onChange={(e) => update("visible", e.target.checked)}
            />
            Show in the shop
          </label>

          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn-primary flex-1" disabled={busy || uploading}>
              {busy ? "Saving…" : "Save product"}
            </button>
            <button type="button" className="btn-outline" onClick={() => setForm(null)}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="mt-8 space-y-3">
        {list.isPending && <p className="text-sm text-muted-foreground">Loading products…</p>}
        {!list.isPending && items.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No products added yet. Anything you add here appears in the shop straight away.
          </p>
        )}
        {items.map((p) => (
          <div key={p.id} className="flex gap-3 border border-border bg-card p-3">
            {p.imageUrl ? (
              <img src={p.imageUrl} alt={p.name} className="h-20 w-20 shrink-0 object-cover" />
            ) : (
              <div className="h-20 w-20 shrink-0 bg-muted" />
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{p.name}</p>
              <p className="text-sm text-muted-foreground">
                {gbp(p.pricePence)} · {p.category}
                {!p.visible && " · hidden"}
              </p>
              <div className="mt-2 flex flex-wrap gap-3 text-sm">
                <button
                  type="button"
                  className="flex items-center gap-1 underline"
                  onClick={() => setForm(toForm(p))}
                >
                  <Pencil className="h-3.5 w-3.5" aria-hidden="true" /> Edit
                </button>
                <button
                  type="button"
                  className="flex items-center gap-1 underline"
                  onClick={async () => {
                    await setVisible({ data: { id: p.id, visible: !p.visible } });
                    await refresh();
                  }}
                >
                  {p.visible ? (
                    <>
                      <EyeOff className="h-3.5 w-3.5" aria-hidden="true" /> Hide
                    </>
                  ) : (
                    <>
                      <Eye className="h-3.5 w-3.5" aria-hidden="true" /> Show
                    </>
                  )}
                </button>
                <button
                  type="button"
                  className="flex items-center gap-1 text-destructive underline"
                  onClick={async () => {
                    if (!window.confirm(`Delete ${p.name}?`)) return;
                    await remove({ data: { id: p.id } });
                    await refresh();
                    toast.success("Product deleted");
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden="true" /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
