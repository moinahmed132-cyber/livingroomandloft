import { Link } from "@tanstack/react-router";
import { categories } from "@/data/products";

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-3">
        <div>
          <p className="font-display text-xl">
            Living Room <span className="text-brass">&amp;</span> Loft
          </p>
          <p className="mt-3 max-w-xs text-sm text-primary-foreground/70">
            Beds, wardrobes, sofas and mattresses delivered free across mainland UK, paid for in
            cash when they arrive.
          </p>
        </div>
        <div>
          <p className="text-[0.7rem] uppercase tracking-[0.2em] text-primary-foreground/60">
            Shop
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link
                  to="/category/$category"
                  params={{ category: c.slug }}
                  className="text-primary-foreground/80 hover:text-primary-foreground"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-[0.7rem] uppercase tracking-[0.2em] text-primary-foreground/60">
            Help
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link to="/delivery" className="text-primary-foreground/80 hover:text-primary-foreground">
                Delivery &amp; cash on delivery
              </Link>
            </li>
            <li>
              <Link to="/shop" className="text-primary-foreground/80 hover:text-primary-foreground">
                All furniture
              </Link>
            </li>
            <li>
              <Link to="/cart" className="text-primary-foreground/80 hover:text-primary-foreground">
                Your basket
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-primary-foreground/15 px-4 py-5 text-center text-xs text-primary-foreground/60">
        © {new Date().getFullYear()} Living Room &amp; Loft. Prices shown in GBP (£).
      </div>
    </footer>
  );
}
