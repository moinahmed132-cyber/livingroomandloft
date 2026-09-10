import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Truck, BadgePoundSterling } from "lucide-react";
import { getCategory } from "@/data/products";
import { getProductMeta } from "@/lib/catalog.functions";
import { useCatalog } from "@/lib/catalog";
import { gbp } from "@/lib/format";
import { useCart } from "@/lib/cart";
import { ProductCard } from "@/components/ProductCard";

export const Route = createFileRoute("/product/$slug")({
  loader: async ({ params }) => {
    const meta = await getProductMeta({ data: { slug: params.slug } });
    if (!meta) throw notFound();
    return meta;
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Product not found — Living Room & Loft" }, { name: "robots", content: "noindex" }],
      };
    }
    const title = `${loaderData.name} — Living Room & Loft`;
    return {
      meta: [
        { title },
        { name: "description", content: loaderData.summary },
        { property: "og:title", content: title },
        { property: "og:description", content: loaderData.summary },
      ],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const { slug } = Route.useParams();
  const product = getProduct(slug)!;
  const category = getCategory(product.category)!;
  const { add } = useCart();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);

  const related = productsInCategory(product.category).filter((p) => p.slug !== product.slug);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <nav className="text-sm text-muted-foreground">
        <Link to="/shop" className="hover:text-foreground">
          Shop
        </Link>
        <span className="px-2">/</span>
        <Link
          to="/category/$category"
          params={{ category: category.slug }}
          className="hover:text-foreground"
        >
          {category.name}
        </Link>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <img
          src={product.image}
          alt={product.name}
          width={1024}
          height={1024}
          className="w-full object-cover"
        />

        <div>
          <h1 className="font-display text-4xl leading-tight">{product.name}</h1>
          <p className="mt-3 text-muted-foreground">{product.summary}</p>

          <p className="mt-6 flex items-baseline gap-3">
            <span className="text-3xl font-semibold">{gbp(product.pricePence)}</span>
            {product.wasPence && (
              <span className="text-lg text-muted-foreground line-through">
                {gbp(product.wasPence)}
              </span>
            )}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <label htmlFor="qty" className="text-sm text-muted-foreground">
              Quantity
            </label>
            <select
              id="qty"
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
              className="field w-20"
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              className="btn-primary"
              onClick={() => {
                add(product.slug, qty);
                toast.success(`${product.name} added to your basket`);
              }}
            >
              Add to basket
            </button>
            <button
              type="button"
              className="btn-outline"
              onClick={() => {
                add(product.slug, qty);
                navigate({ to: "/checkout" });
              }}
            >
              Buy with cash on delivery
            </button>
          </div>

          <div className="mt-8 space-y-3 border-t border-border pt-6 text-sm">
            <p className="flex items-center gap-3">
              <Truck className="h-4 w-4 text-brass" aria-hidden="true" />
              Free UK delivery · {product.leadTime}
            </p>
            <p className="flex items-center gap-3">
              <BadgePoundSterling className="h-4 w-4 text-brass" aria-hidden="true" />
              Pay the driver in cash when it arrives
            </p>
          </div>

          <div className="mt-8 border-t border-border pt-6">
            <h2 className="font-display text-2xl">About this piece</h2>
            <p className="mt-3 text-muted-foreground">{product.description}</p>
            <ul className="mt-4 space-y-2 text-sm">
              {product.details.map((d) => (
                <li key={d} className="flex gap-2">
                  <span className="text-brass">·</span>
                  {d}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-muted-foreground">
              <strong className="font-medium text-foreground">Dimensions:</strong>{" "}
              {product.dimensions}
            </p>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="font-display text-2xl">More {category.name.toLowerCase()}</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
