import { createFileRoute, Link } from "@tanstack/react-router";
import { categories, products } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "All Furniture — Living Room & Loft" },
      {
        name: "description",
        content:
          "Every bed, wardrobe, sofa and mattress we make, priced in GBP with free UK delivery and cash on delivery.",
      },
      { property: "og:title", content: "All Furniture — Living Room & Loft" },
      {
        property: "og:description",
        content: "Browse the full Living Room & Loft range with free UK delivery.",
      },
    ],
  }),
  component: ShopPage,
});

function ShopPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <p className="eyebrow">The full range</p>
      <h1 className="mt-2 font-display text-4xl">All furniture</h1>
      <p className="mt-3 max-w-xl text-muted-foreground">
        {products.length} pieces, all with free delivery anywhere in mainland UK and cash payment on
        arrival.
      </p>

      <div className="mt-8 flex flex-wrap gap-2">
        {categories.map((c) => (
          <Link
            key={c.slug}
            to="/category/$category"
            params={{ category: c.slug }}
            className="rounded-full border border-border px-4 py-2 text-sm hover:bg-muted"
          >
            {c.name}
          </Link>
        ))}
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
    </div>
  );
}
