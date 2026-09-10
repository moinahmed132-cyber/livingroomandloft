import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { type Product } from "@/data/products";
import { useCatalog } from "@/lib/catalog";

export type CartLine = { slug: string; qty: number };

type CartContextValue = {
  ready: boolean;
  lines: CartLine[];
  items: { product: Product; qty: number }[];
  count: number;
  subtotalPence: number;
  add: (slug: string, qty?: number) => void;
  setQty: (slug: string, qty: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "lrl-cart-v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const { products, loading: catalogLoading } = useCatalog();
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw) as CartLine[]);
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* ignore */
    }
  }, [lines, hydrated]);

  const value = useMemo<CartContextValue>(() => {
    const items = lines
      .map((l) => {
        const product = products.find((p) => p.slug === l.slug);
        return product ? { product, qty: l.qty } : null;
      })
      .filter((x): x is { product: Product; qty: number } => x !== null);

    return {
      ready: hydrated && !catalogLoading,
      lines,
      items,
      count: items.reduce((n, i) => n + i.qty, 0),
      subtotalPence: items.reduce((n, i) => n + i.product.pricePence * i.qty, 0),
      add: (slug, qty = 1) =>
        setLines((prev) => {
          const existing = prev.find((l) => l.slug === slug);
          if (existing) {
            return prev.map((l) => (l.slug === slug ? { ...l, qty: l.qty + qty } : l));
          }
          return [...prev, { slug, qty }];
        }),
      setQty: (slug, qty) =>
        setLines((prev) =>
          qty <= 0
            ? prev.filter((l) => l.slug !== slug)
            : prev.map((l) => (l.slug === slug ? { ...l, qty } : l)),
        ),
      remove: (slug) => setLines((prev) => prev.filter((l) => l.slug !== slug)),
      clear: () => setLines([]),
    };
  }, [lines, hydrated, products, catalogLoading]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
