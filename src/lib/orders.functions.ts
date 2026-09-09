import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const lineSchema = z.object({
  slug: z.string().min(1).max(120),
  qty: z.number().int().min(1).max(20),
});

const orderSchema = z.object({
  customerName: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().min(7).max(40),
  addressLine1: z.string().trim().min(3).max(200),
  addressLine2: z.string().trim().max(200).optional().or(z.literal("")),
  city: z.string().trim().min(2).max(100),
  county: z.string().trim().max(100).optional().or(z.literal("")),
  postcode: z
    .string()
    .trim()
    .min(5)
    .max(10)
    .regex(/^[A-Za-z]{1,2}\d[A-Za-z\d]?\s*\d[A-Za-z]{2}$/, "Enter a valid UK postcode"),
  deliveryNotes: z.string().trim().max(1000).optional().or(z.literal("")),
  lines: z.array(lineSchema).min(1).max(30),
});

function makeOrderNumber() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let suffix = "";
  for (let i = 0; i < 6; i += 1) {
    suffix += chars[Math.floor(Math.random() * chars.length)];
  }
  return `LRL-${suffix}`;
}

export const placeCodOrder = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => orderSchema.parse(data))
  .handler(async ({ data }) => {
    const { products } = await import("@/data/products");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const items = data.lines.map((line) => {
      const product = products.find((p) => p.slug === line.slug);
      if (!product) throw new Error(`Unknown product: ${line.slug}`);
      return {
        slug: product.slug,
        name: product.name,
        qty: line.qty,
        unit_price_pence: product.pricePence,
        line_total_pence: product.pricePence * line.qty,
      };
    });

    const subtotal = items.reduce((n, i) => n + i.line_total_pence, 0);
    const orderNumber = makeOrderNumber();

    const { error } = await supabaseAdmin.from("orders").insert({
      order_number: orderNumber,
      customer_name: data.customerName,
      email: data.email,
      phone: data.phone,
      address_line1: data.addressLine1,
      address_line2: data.addressLine2 || null,
      city: data.city,
      county: data.county || null,
      postcode: data.postcode.toUpperCase(),
      delivery_notes: data.deliveryNotes || null,
      items,
      subtotal_pence: subtotal,
      total_pence: subtotal,
      payment_method: "cod",
      status: "pending",
    });

    if (error) {
      console.error("Failed to save order", error);
      throw new Error("We could not save your order. Please try again.");
    }

    return { orderNumber, totalPence: subtotal };
  });
