import bedsImg from "@/assets/cat-beds.jpg";
import wardrobesImg from "@/assets/cat-wardrobes.jpg";
import sofasImg from "@/assets/cat-sofas.jpg";
import mattressesImg from "@/assets/cat-mattresses.jpg";

export type CategorySlug = "beds" | "wardrobes" | "sofas" | "mattresses";

export type Category = {
  slug: CategorySlug;
  name: string;
  tagline: string;
  image: string;
};

export type Product = {
  slug: string;
  name: string;
  category: CategorySlug;
  pricePence: number;
  wasPence?: number;
  image: string;
  summary: string;
  description: string;
  details: string[];
  dimensions: string;
  leadTime: string;
};

export const categories: Category[] = [
  {
    slug: "beds",
    name: "Beds",
    tagline: "Upholstered and wooden frames, made for deep sleep",
    image: bedsImg,
  },
  {
    slug: "wardrobes",
    name: "Wardrobes",
    tagline: "Sliding, hinged and mirrored storage",
    image: wardrobesImg,
  },
  {
    slug: "sofas",
    name: "Sofas",
    tagline: "Velvet, boucle and linen, built in the UK",
    image: sofasImg,
  },
  {
    slug: "mattresses",
    name: "Mattresses",
    tagline: "Pocket sprung, memory foam and hybrid comfort",
    image: mattressesImg,
  },
];

export const products: Product[] = [
  {
    slug: "hartley-upholstered-bed",
    name: "Hartley Upholstered Bed",
    category: "beds",
    pricePence: 74900,
    wasPence: 89900,
    image: bedsImg,
    summary: "Channel-tufted headboard in warm cream linen with solid brass feet.",
    description:
      "The Hartley is our signature bed frame: a tall, channel-tufted headboard wrapped in a soft cream weave, set on tapered solid brass feet. A sprung slatted base gives your mattress even support and a little extra bounce.",
    details: [
      "Kiln-dried hardwood frame",
      "Sprung slatted base included",
      "Solid brass tapered feet",
      "10 year frame guarantee",
    ],
    dimensions: "King 150 x 200 cm sleeping area, 135 cm headboard height",
    leadTime: "Delivered in 3 to 5 working days",
  },
  {
    slug: "elmswood-oak-bed-frame",
    name: "Elmswood Oak Bed Frame",
    category: "beds",
    pricePence: 62900,
    image: bedsImg,
    summary: "Low-profile solid oak frame with a softly rounded headboard.",
    description:
      "Cut from solid European oak and finished with a natural hardwax oil, the Elmswood keeps things low, calm and quiet. The rounded headboard is comfortable to lean against and the frame arrives flat-packed for easy access up UK stairwells.",
    details: [
      "Solid European oak",
      "Natural hardwax oil finish",
      "Flat-packed, assembles in around 40 minutes",
      "10 year frame guarantee",
    ],
    dimensions: "Double 135 x 190 cm sleeping area, 95 cm headboard height",
    leadTime: "Delivered in 5 to 7 working days",
  },
  {
    slug: "marlow-storage-ottoman-bed",
    name: "Marlow Storage Ottoman Bed",
    category: "beds",
    pricePence: 89900,
    image: bedsImg,
    summary: "Gas-lift ottoman base with a full-width storage compartment.",
    description:
      "Built for smaller UK homes, the Marlow lifts smoothly on twin gas struts to reveal a full-width storage void deep enough for spare bedding, suitcases and seasonal clothing.",
    details: [
      "Twin gas-lift struts",
      "Full-width side-opening storage",
      "Deep buttoned headboard",
      "5 year mechanism guarantee",
    ],
    dimensions: "King 150 x 200 cm, 38 cm internal storage depth",
    leadTime: "Delivered in 7 to 10 working days",
  },
  {
    slug: "kingsley-mirrored-wardrobe",
    name: "Kingsley Mirrored Wardrobe",
    category: "wardrobes",
    pricePence: 109900,
    wasPence: 124900,
    image: wardrobesImg,
    summary: "Two-door sliding wardrobe with full-height mirrors and brass trim.",
    description:
      "Soft-close sliding doors mean no swing space is needed, so the Kingsley works in narrow bedrooms. Full-height mirrors bounce light around the room and the interior splits into hanging and shelved halves.",
    details: [
      "Soft-close sliding runners",
      "Full-height safety-backed mirrors",
      "Brushed brass trim and handles",
      "Adjustable interior shelving",
    ],
    dimensions: "W 180 x D 62 x H 216 cm",
    leadTime: "Delivered in 7 to 10 working days",
  },
  {
    slug: "belgrave-three-door-wardrobe",
    name: "Belgrave Three Door Wardrobe",
    category: "wardrobes",
    pricePence: 134900,
    image: wardrobesImg,
    summary: "Painted three-door wardrobe with two deep drawers.",
    description:
      "A generous hinged wardrobe hand-painted in a deep heritage green, with panelled doors, two soft-close drawers and a double hanging rail. A proper wardrobe for a proper bedroom.",
    details: [
      "Hand-painted panelled doors",
      "Two soft-close drawers",
      "Double hanging rail plus shelving",
      "Anti-tip wall fixings included",
    ],
    dimensions: "W 152 x D 60 x H 210 cm",
    leadTime: "Delivered in 10 to 14 working days",
  },
  {
    slug: "ashcroft-single-wardrobe",
    name: "Ashcroft Single Wardrobe",
    category: "wardrobes",
    pricePence: 54900,
    image: wardrobesImg,
    summary: "Compact single wardrobe with a drawer and top shelf.",
    description:
      "Slim enough for a spare room or a child's bedroom, the Ashcroft still gives you a full hanging rail, a top shelf and a deep drawer at the base.",
    details: [
      "Single hanging rail",
      "One deep base drawer",
      "Top storage shelf",
      "Anti-tip wall fixings included",
    ],
    dimensions: "W 80 x D 55 x H 190 cm",
    leadTime: "Delivered in 5 to 7 working days",
  },
  {
    slug: "verdant-velvet-three-seater",
    name: "Verdant Velvet Three Seater",
    category: "sofas",
    pricePence: 129900,
    wasPence: 149900,
    image: sofasImg,
    summary: "Deep forest velvet sofa with feather-blend cushions and brass legs.",
    description:
      "Our best-selling sofa. A tailored three seater in dense cotton-backed velvet, with feather-blend seat cushions that sink just enough and a hardwood frame built to last decades.",
    details: [
      "Feather-blend seat and back cushions",
      "Cotton-backed velvet, 40,000 rub tested",
      "Solid brass tapered legs",
      "15 year frame guarantee",
    ],
    dimensions: "W 218 x D 95 x H 84 cm, seat height 46 cm",
    leadTime: "Delivered in 10 to 14 working days",
  },
  {
    slug: "linden-boucle-corner-sofa",
    name: "Linden Boucle Corner Sofa",
    category: "sofas",
    pricePence: 189900,
    image: sofasImg,
    summary: "Curved corner sofa in cream boucle with a chaise end.",
    description:
      "Softly curved and generously deep, the Linden wraps around a living room without feeling bulky. The chaise end can be ordered left or right handed at no extra cost.",
    details: [
      "Left or right hand chaise",
      "Textured cream boucle",
      "Removable, washable covers",
      "15 year frame guarantee",
    ],
    dimensions: "W 265 x D 165 x H 82 cm",
    leadTime: "Delivered in 14 to 21 working days",
  },
  {
    slug: "clerkenwell-two-seater",
    name: "Clerkenwell Two Seater",
    category: "sofas",
    pricePence: 94900,
    image: sofasImg,
    summary: "Compact linen two seater sized for flats and snugs.",
    description:
      "A neat two seater in heavyweight natural linen with slim arms, designed to fit through standard UK doorways without removing the legs.",
    details: [
      "Heavyweight natural linen",
      "Slim 12 cm arms",
      "Fits through a 76 cm doorway",
      "15 year frame guarantee",
    ],
    dimensions: "W 165 x D 90 x H 82 cm",
    leadTime: "Delivered in 10 to 14 working days",
  },
  {
    slug: "heritage-1500-pocket-mattress",
    name: "Heritage 1500 Pocket Mattress",
    category: "mattresses",
    pricePence: 54900,
    wasPence: 64900,
    image: mattressesImg,
    summary: "1500 individually wrapped pocket springs with a wool comfort layer.",
    description:
      "Individually wrapped springs respond to each sleeper separately, so you are not disturbed when your partner moves. Layers of British wool and cotton regulate temperature through the year.",
    details: [
      "1500 pocket springs",
      "British wool and cotton fillings",
      "Medium-firm tension",
      "100 night comfort trial",
    ],
    dimensions: "King 150 x 200 cm, 28 cm depth",
    leadTime: "Delivered in 3 to 5 working days",
  },
  {
    slug: "cloudrest-memory-hybrid",
    name: "Cloudrest Memory Hybrid",
    category: "mattresses",
    pricePence: 69900,
    image: mattressesImg,
    summary: "Cooling memory foam over a 2000 pocket spring core.",
    description:
      "A gel-infused memory foam top layer contours to your shape while the 2000 spring core keeps your spine supported. Ideal for side sleepers who run warm.",
    details: [
      "2000 pocket springs",
      "Gel-infused cooling memory foam",
      "Medium tension",
      "100 night comfort trial",
    ],
    dimensions: "King 150 x 200 cm, 30 cm depth",
    leadTime: "Delivered in 3 to 5 working days",
  },
  {
    slug: "orchard-firm-support-mattress",
    name: "Orchard Firm Support Mattress",
    category: "mattresses",
    pricePence: 44900,
    image: mattressesImg,
    summary: "Firm open-coil mattress for back sleepers and guest rooms.",
    description:
      "A dependable, firmer mattress with a reinforced edge so you can sit on the side without roll-off. A sensible choice for guest rooms and growing teenagers.",
    details: [
      "Reinforced edge support",
      "Firm tension",
      "Hypoallergenic fillings",
      "100 night comfort trial",
    ],
    dimensions: "Double 135 x 190 cm, 24 cm depth",
    leadTime: "Delivered in 3 to 5 working days",
  },
];

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}

export function productsInCategory(slug: string) {
  return products.filter((p) => p.category === slug);
}
