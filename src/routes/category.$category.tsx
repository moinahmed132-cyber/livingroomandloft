import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getCategory } from "@/data/products";
import { useCatalog } from "@/lib/catalog";
import { ProductCard } from "@/components/ProductCard";

export const Route = createFileRoute("/category/$category")({
  loader: ({ params }) => {
    const category = getCategory(params.category);
    if (!category) throw notFound();
    return { name: category.name, tagline: category.tagline };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Category not found — Living Room & Loft" }, { name: "robots", content: "noindex" }],
      };
    }
    const title = `${loaderData.name} — Living Room & Loft`;
    const description = `${loaderData.tagline}. Free UK delivery and cash on delivery on every ${loaderData.name.toLowerCase()} order.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: CategoryPage,
});

function CategoryPage() {
  const { category } = Route.useParams();
  const info = getCategory(category)!;
  const items = useCatalog().inCategory(category);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <Link to="/shop" className="text-sm text-muted-foreground hover:text-foreground">
        ← All furniture
      </Link>
      <p className="eyebrow mt-6">Category</p>
      <h1 className="mt-2 font-display text-4xl">{info.name}</h1>
      <p className="mt-3 max-w-xl text-muted-foreground">{info.tagline}.</p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
    </div>
  );
}
