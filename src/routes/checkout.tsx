import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { useCart } from "@/lib/cart";
import { gbp } from "@/lib/format";
import { placeCodOrder } from "@/lib/orders.functions";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Cash on Delivery Checkout — Living Room & Loft" },
      {
        name: "description",
        content:
          "Give us your UK delivery and contact details. No card payment — you pay cash when your furniture arrives.",
      },
      { property: "og:title", content: "Cash on Delivery Checkout — Living Room & Loft" },
      { property: "og:description", content: "Order now, pay cash on delivery." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const { items, subtotalPence, lines, clear } = useCart();
  const submitOrder = useServerFn(placeCodOrder);
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (lines.length === 0) return;
    setSubmitting(true);
    setError(null);

    const form = new FormData(event.currentTarget);
    const payload = {
      customerName: String(form.get("customerName") ?? ""),
      email: String(form.get("email") ?? ""),
      phone: String(form.get("phone") ?? ""),
      addressLine1: String(form.get("addressLine1") ?? ""),
      addressLine2: String(form.get("addressLine2") ?? ""),
      city: String(form.get("city") ?? ""),
      county: String(form.get("county") ?? ""),
      postcode: String(form.get("postcode") ?? ""),
      deliveryNotes: String(form.get("deliveryNotes") ?? ""),
      lines,
    };

    try {
      const result = await submitOrder({ data: payload });
      clear();
      toast.success("Order placed");
      navigate({
        to: "/order-confirmed",
        search: { order: result.orderNumber, total: result.totalPence },
      });
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error && err.message.includes("postcode")
          ? "Please check your UK postcode and try again."
          : "Something went wrong placing your order. Please check your details and try again.",
      );
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="font-display text-3xl">Your basket is empty</h1>
        <p className="mt-3 text-muted-foreground">Add something you love before checking out.</p>
        <Link to="/shop" className="btn-primary mt-8">
          Browse furniture
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <p className="eyebrow">Checkout</p>
      <h1 className="mt-2 font-display text-4xl">Cash on delivery</h1>
      <p className="mt-3 max-w-xl text-muted-foreground">
        No card details needed. Tell us where to deliver and how to reach you, and pay the driver in
        cash when your furniture arrives.
      </p>

      <form onSubmit={onSubmit} className="mt-10 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-8">
          <fieldset className="space-y-4">
            <legend className="font-display text-2xl">Contact details</legend>
            <Field name="customerName" label="Full name" autoComplete="name" required />
            <Field name="email" label="Email address" type="email" autoComplete="email" required />
            <Field
              name="phone"
              label="Mobile number"
              type="tel"
              autoComplete="tel"
              hint="We call to confirm your delivery slot."
              required
            />
          </fieldset>

          <fieldset className="space-y-4">
            <legend className="font-display text-2xl">Delivery address</legend>
            <Field
              name="addressLine1"
              label="Address line 1"
              autoComplete="address-line1"
              required
            />
            <Field name="addressLine2" label="Address line 2 (optional)" autoComplete="address-line2" />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field name="city" label="Town or city" autoComplete="address-level2" required />
              <Field name="county" label="County (optional)" autoComplete="address-level1" />
            </div>
            <Field
              name="postcode"
              label="Postcode"
              autoComplete="postal-code"
              hint="UK postcodes only, for example SW1A 1AA."
              required
            />
            <div>
              <label htmlFor="deliveryNotes" className="block text-sm font-medium">
                Delivery notes (optional)
              </label>
              <textarea
                id="deliveryNotes"
                name="deliveryNotes"
                rows={3}
                className="field mt-1"
                placeholder="Parking, access, buzzer code, preferred days…"
              />
            </div>
          </fieldset>

          <div className="border border-border bg-card p-5 text-sm">
            <p className="font-medium">Payment method: Cash on delivery</p>
            <p className="mt-1 text-muted-foreground">
              Have the exact total ready. Drivers cannot give change above £20.
            </p>
          </div>

          {error && (
            <p role="alert" className="border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
              {error}
            </p>
          )}
        </div>

        <aside className="h-fit border border-border bg-card p-6">
          <h2 className="font-display text-2xl">Your order</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {items.map(({ product, qty }) => (
              <li key={product.slug} className="flex justify-between gap-4">
                <span>
                  {product.name}
                  <span className="text-muted-foreground"> × {qty}</span>
                </span>
                <span>{gbp(product.pricePence * qty)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
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
            <span>Pay on delivery</span>
            <span>{gbp(subtotalPence)}</span>
          </div>
          <button type="submit" className="btn-primary mt-6 w-full" disabled={submitting}>
            {submitting ? "Placing order…" : "Place order"}
          </button>
        </aside>
      </form>
    </div>
  );
}

function Field({
  name,
  label,
  type = "text",
  hint,
  required,
  autoComplete,
}: {
  name: string;
  label: string;
  type?: string;
  hint?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        className="field mt-1"
      />
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
