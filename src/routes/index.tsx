import { createFileRoute, Link } from "@tanstack/react-router";
import { Truck, BadgePoundSterling, ShieldCheck } from "lucide-react";
import heroImg from "@/assets/hero.jpg";
import { categories } from "@/data/products";
import { useCatalog } from "@/lib/catalog";
import { ProductCard } from "@/components/ProductCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Living Room & Loft — Beds, Wardrobes, Sofas & Mattresses" },
      {
        name: "description",
        content:
          "Shop British-made beds, wardrobes, sofas and mattresses in GBP. Free UK delivery and cash on delivery — no card needed.",
      },
      { property: "og:title", content: "Living Room & Loft — UK Furniture Store" },
      {
        property: "og:description",
        content: "Free UK delivery and cash on delivery on beds, wardrobes, sofas and mattresses.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const { products } = useCatalog();
  const featured = products.filter((p) => p.wasPence).slice(0, 4);

  return (
    <div>
      <section className="relative">
        <img
          src={heroImg}
          alt="Cream boucle sofa in a deep green living room lit by a brass floor lamp"
          width={1920}
          height={1088}
          className="h-[62vh] min-h-[420px] w-full object-cover"
        />
        <div className="absolute inset-0 bg-primary/55" />
        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto w-full max-w-6xl px-4">
            <p className="text-[0.7rem] uppercase tracking-[0.24em] text-primary-foreground/75">
              Free delivery across mainland UK
            </p>
            <h1 className="mt-4 max-w-2xl font-display text-4xl leading-tight text-primary-foreground sm:text-6xl">
              Furniture worth waiting up for
            </h1>
            <p className="mt-4 max-w-lg text-primary-foreground/80">
              Beds, wardrobes, sofas and mattresses made for British homes. Pay in cash when your
              order reaches your door.
            </p>
            <Link to="/shop" className="btn-primary mt-8 bg-brass text-accent-foreground hover:bg-brass/90">
              Browse the collection
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-12 sm:grid-cols-3">
        {[
          { icon: Truck, title: "Free UK delivery", copy: "On every order, to every mainland address." },
          {
            icon: BadgePoundSterling,
            title: "Cash on delivery",
            copy: "No card details. Pay the driver when it arrives.",
          },
          {
            icon: ShieldCheck,
            title: "Guaranteed for years",
            copy: "Up to 15 years on frames, 100 nights on mattresses.",
          },
        ].map(({ icon: Icon, title, copy }) => (
          <div key={title} className="flex gap-4 border border-border bg-card p-6">
            <Icon className="mt-1 h-5 w-5 shrink-0 text-brass" aria-hidden="true" />
            <div>
              <h2 className="font-display text-lg">{title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{copy}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8">
        <p className="eyebrow">Browse by room</p>
        <h2 className="mt-2 font-display text-3xl">Four things done properly</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((c) => (
            <Link
              key={c.slug}
              to="/category/$category"
              params={{ category: c.slug }}
              className="group block"
            >
              <img
                src={c.image}
                alt={c.name}
                loading="lazy"
                width={1024}
                height={1024}
                className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
              <h3 className="mt-4 font-display text-xl">{c.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{c.tagline}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <p className="eyebrow">This month</p>
        <h2 className="mt-2 font-display text-3xl">Reduced pieces</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
