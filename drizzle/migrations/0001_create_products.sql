CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  category text NOT NULL,
  price_pence integer NOT NULL,
  was_pence integer,
  image_url text,
  summary text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  details jsonb NOT NULL DEFAULT '[]'::jsonb,
  dimensions text NOT NULL DEFAULT '',
  lead_time text NOT NULL DEFAULT 'Delivered in 2-3 weeks',
  visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.products TO anon;
GRANT SELECT ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public can read visible products"
  ON public.products FOR SELECT
  USING (visible = true);

CREATE POLICY "service role manages products"
  ON public.products FOR ALL
  TO service_role
  USING (true) WITH CHECK (true);

CREATE INDEX products_category_idx ON public.products (category);