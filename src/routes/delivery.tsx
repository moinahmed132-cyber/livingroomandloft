import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/delivery")({
  head: () => ({
    meta: [
      { title: "Delivery & Cash on Delivery — Living Room & Loft" },
      {
        name: "description",
        content:
          "How free UK delivery and cash on delivery work at Living Room & Loft: timings, coverage and what to have ready on the day.",
      },
      { property: "og:title", content: "Delivery & Cash on Delivery — Living Room & Loft" },
      {
        property: "og:description",
        content: "Free UK delivery on every order, paid for in cash at your door.",
      },
    ],
  }),
  component: DeliveryPage,
});

function DeliveryPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
      <p className="eyebrow">Delivery</p>
      <h1 className="mt-2 font-display text-4xl">Free UK delivery, paid in cash</h1>

      <div className="mt-8 space-y-8 text-muted-foreground">
        <section>
          <h2 className="font-display text-2xl text-foreground">What it costs</h2>
          <p className="mt-2">
            Nothing. Delivery is free on every order to any mainland UK address, whatever you buy
            and however many pieces you order.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground">Paying cash on delivery</h2>
          <p className="mt-2">
            You never enter card details on this site. Place your order with your delivery and
            contact details, we call to confirm a delivery slot, and you hand the exact amount to
            the driver when your furniture is in the room you want it.
          </p>
          <ul className="mt-4 space-y-2">
            <li>· Have the exact total ready in cash — drivers cannot give change above £20.</li>
            <li>· Someone over 18 needs to be home to accept and pay.</li>
            <li>· Check your items before paying; anything damaged goes straight back on the van.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground">Where we deliver</h2>
          <p className="mt-2">
            England, Scotland and Wales mainland addresses. For the Scottish Highlands and Islands,
            Northern Ireland and the Isle of Man, place your order and we will call you to arrange a
            date before dispatch.
          </p>
        </section>
      </div>

      <Link to="/shop" className="btn-primary mt-10">
        Start shopping
      </Link>
    </div>
  );
}
