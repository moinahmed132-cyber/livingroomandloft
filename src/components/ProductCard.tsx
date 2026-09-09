import { Link } from "@tanstack/react-router";
import type { Product } from "@/data/products";
import { gbp } from "@/lib/format";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      to="/product/$slug"
      params={{ slug: product.slug }}
      className="group block bg-card"
    >
      <div className="overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          width={1024}
          height={1024}
          className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className="px-4 py-4">
        <h3 className="font-display text-lg leading-tight">{product.name}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{product.summary}</p>
        <p className="mt-3 flex items-baseline gap-2">
          <span className="text-base font-semibold">{gbp(product.pricePence)}</span>
          {product.wasPence && (
            <span className="text-sm text-muted-foreground line-through">
              {gbp(product.wasPence)}
            </span>
          )}
        </p>
      </div>
    </Link>
  );
}
