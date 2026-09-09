import { Link } from "@tanstack/react-router";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import { categories } from "@/data/products";
import { useCart } from "@/lib/cart";

export function SiteHeader() {
  const { count } = useCart();
  const [open, setOpen] = useState(false);

  const links = [
    { to: "/shop" as const, label: "All furniture", params: undefined },
    ...categories.map((c) => ({
      to: "/category/$category" as const,
      label: c.name,
      params: { category: c.slug },
    })),
    { to: "/delivery" as const, label: "Delivery", params: undefined },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <p className="bg-primary px-4 py-2 text-center text-[0.7rem] tracking-[0.18em] uppercase text-primary-foreground">
        Free delivery anywhere in the UK · Pay cash on delivery
      </p>
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <Link to="/" className="leading-none">
          <span className="block font-display text-xl tracking-wide text-foreground">
            Living Room <span className="text-brass">&amp;</span> Loft
          </span>
          <span className="eyebrow mt-1 block text-[0.6rem]">British furniture</span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {links.map((l) => (
            <Link
              key={l.label}
              to={l.to}
              params={l.params as never}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "text-sm text-foreground" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/cart"
            className="relative inline-flex items-center gap-2 rounded-sm border border-border px-3 py-2 text-sm"
            aria-label="View basket"
          >
            <ShoppingBag className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Basket</span>
            {count > 0 && (
              <span className="min-w-5 rounded-full bg-brass px-1.5 text-center text-xs font-semibold text-accent-foreground">
                {count}
              </span>
            )}
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="rounded-sm border border-border p-2 lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-border bg-background px-4 py-3 lg:hidden">
          {links.map((l) => (
            <Link
              key={l.label}
              to={l.to}
              params={l.params as never}
              onClick={() => setOpen(false)}
              className="block border-b border-border/60 py-3 text-sm last:border-0"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
