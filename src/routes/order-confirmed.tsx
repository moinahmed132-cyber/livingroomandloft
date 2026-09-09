import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { gbp } from "@/lib/format";

type OrderSearch = { order: string | undefined; total: number | undefined };

export const Route = createFileRoute("/order-confirmed")({
  validateSearch: (search: Record<string, unknown>): OrderSearch => ({
    order: typeof search['order'] === "string" ? search['order'] : undefined,
    total: typeof search['total'] === "number" ? search['total'] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Order Confirmed — Living Room & Loft" },
      { name: "description", content: "Your cash on delivery order has been received." },
      { property: "og:title", content: "Order Confirmed — Living Room & Loft" },
      { property: "og:description", content: "Your cash on delivery order has been received." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: OrderConfirmedPage,
});

function OrderConfirmedPage() {
  const { order, total } = Route.useSearch();

  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center">
      <CheckCircle2 className="mx-auto h-10 w-10 text-brass" aria-hidden="true" />
      <h1 className="mt-6 font-display text-4xl">Thank you, your order is placed</h1>

      {order ? (
        <p className="mt-4 text-muted-foreground">
          Your order reference is{" "}
          <strong className="font-semibold text-foreground">{order}</strong>
          {typeof total === "number" && (
            <>
              {" "}
              and the amount to pay the driver in cash is{" "}
              <strong className="font-semibold text-foreground">{gbp(total)}</strong>
            </>
          )}
          .
        </p>
      ) : (
        <p className="mt-4 text-muted-foreground">
          We have your order. Check your email for the confirmation.
        </p>
      )}

      <div className="mt-8 border border-border bg-card p-6 text-left text-sm">
        <h2 className="font-display text-xl">What happens next</h2>
        <ol className="mt-3 space-y-2 text-muted-foreground">
          <li>1. We call or text you within one working day to agree a delivery slot.</li>
          <li>2. Your furniture is delivered free to the room of your choice.</li>
          <li>3. You check everything, then pay the driver in cash.</li>
        </ol>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/shop" className="btn-primary">
          Continue shopping
        </Link>
        <Link to="/delivery" className="btn-outline">
          Delivery information
        </Link>
      </div>
    </div>
  );
}
