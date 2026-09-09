import { createFileRoute, Link } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import { useCart } from "@/lib/cart";
import { gbp } from "@/lib/format";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Basket — Living Room & Loft" },
      {
        name: "description",
        content: "Review the furniture in your basket before checking out with cash on delivery.",
      },
      { property: "og:title", content: "Your Basket — Living Room & Loft" },
      { property: "og:description", content: "Review your Living Room & Loft basket." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { items, subtotalPence, setQty, remove } = useCart();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <p className="eyebrow">Basket</p>
      <h1 className="mt-2 font-display text-4xl">Your basket</h1>

      {items.length === 0 ? (
        <div className="mt-10 border border-border bg-card p-10 text-center">
          <p className="text-muted-foreground">Your basket is empty.</p>
          <Link to="/shop" className="btn-primary mt-6">
            Browse furniture
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-10 lg:grid-cols-[1.6fr_1fr]">
          <ul className="divide-y divide-border border-y border-border">
            {items.map(({ product, qty }) => (
              <li key={product.slug} className="flex gap-4 py-5">
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                  width={1024}
                  height={1024}
                  className="h-24 w-24 shrink-0 object-cover"
                />
                <div className="flex-1">
                  <Link
                    to="/product/$slug"
                    params={{ slug: product.slug }}
                    className="font-display text-lg hover:underline"
                  >
                    {product.name}
                  </Link>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {gbp(product.pricePence)} each
                  </p>
                  <div className="mt-3 flex items-center gap-3">
                    <label htmlFor={`qty-${product.slug}`} className="sr-only">
                      Quantity for {product.name}
                    </label>
                    <select
                      id={`qty-${product.slug}`}
                      value={qty}
                      onChange={(e) => setQty(product.slug, Number(e.target.value))}
                      className="field w-20"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => remove(product.slug)}
                      className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                      Remove
                    </button>
                  </div>
                </div>
                <p className="font-semibold">{gbp(product.pricePence * qty)}</p>
              </li>
            ))}
          </ul>

          <aside className="h-fit border border-border bg-card p-6">
            <h2 className="font-display text-2xl">Summary</h2>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd>{gbp(subtotalPence)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">UK delivery</dt>
                <dd className="text-brass">Free</dd>
              </div>
            </dl>
            <div className="mt-4 flex justify-between border-t border-border pt-4 text-lg font-semibold">
              <span>Total to pay on delivery</span>
              <span>{gbp(subtotalPence)}</span>
            </div>
            <Link to="/checkout" className="btn-primary mt-6 w-full">
              Checkout
            </Link>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              No card needed — you pay the driver in cash.
            </p>
          </aside>
        </div>
      )}
    </div>
  );
}
