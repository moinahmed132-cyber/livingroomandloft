import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import bedsImg from "@/assets/cat-beds.jpg";
import wardrobesImg from "@/assets/cat-wardrobes.jpg";
import sofasImg from "@/assets/cat-sofas.jpg";
import mattressesImg from "@/assets/cat-mattresses.jpg";
import {
  products as staticProducts,
  type CategorySlug,
  type Product,
} from "@/data/products";
import { listStoreProducts, type StoreProductRow } from "@/lib/catalog.functions";

const fallbackImages: Record<CategorySlug, string> = {
  beds: bedsImg,
  wardrobes: wardrobesImg,
  sofas: sofasImg,
  mattresses: mattressesImg,
};

export function rowToProduct(row: StoreProductRow): Product {
  const category = (
    ["beds", "wardrobes", "sofas", "mattresses"].includes(row.category) ? row.category : "beds"
  ) as CategorySlug;

  const base: Product = {
    slug: row.slug,
    name: row.name,
    category,
    pricePence: row.pricePence,
    image: row.imageUrl || fallbackImages[category],
    summary: row.summary || row.description.slice(0, 140),
    description: row.description,
    details: row.details,
    dimensions: row.dimensions,
    leadTime: row.leadTime || "Delivered in 2 to 3 weeks",
  };

  return row.wasPence ? { ...base, wasPence: row.wasPence } : base;
}

type CatalogValue = {
  loading: boolean;
  products: Product[];
  getProduct: (slug: string) => Product | undefined;
  inCategory: (slug: string) => Product[];
};

const CatalogContext = createContext<CatalogValue | null>(null);

export function CatalogProvider({ children }: { children: ReactNode }) {
  const { data, isPending } = useQuery({
    queryKey: ["store-products"],
    queryFn: () => listStoreProducts(),
    staleTime: 30_000,
  });

  const value = useMemo<CatalogValue>(() => {
    const live = (data ?? []).map(rowToProduct);
    const liveSlugs = new Set(live.map((p) => p.slug));
    const products = [...live, ...staticProducts.filter((p) => !liveSlugs.has(p.slug))];

    return {
      loading: isPending,
      products,
      getProduct: (slug) => products.find((p) => p.slug === slug),
      inCategory: (slug) => products.filter((p) => p.category === slug),
    };
  }, [data, isPending]);

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error("useCatalog must be used inside CatalogProvider");
  return ctx;
}
