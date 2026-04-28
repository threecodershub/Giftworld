import { useMemo, useState } from "react";
import { Category, Product, categoryLabel, products } from "@/data/products";
import { ProductCard } from "./ProductCard";
import { ProductDialog } from "./ProductDialog";
import { useCart } from "@/store/cart";
import { Search, SlidersHorizontal, Gem, PenLine, KeyRound } from "lucide-react";

const filters: ("all" | Category)[] = ["all", "bracelets", "pens", "keychains"];
const categories: Category[] = ["bracelets", "pens", "keychains"];

const categoryIcons: Record<Category, React.ReactNode> = {
  bracelets: <Gem className="h-4 w-4" />,
  pens: <PenLine className="h-4 w-4" />,
  keychains: <KeyRound className="h-4 w-4" />,
};

const categoryDescriptions: Record<Category, string> = {
  bracelets: "Handcrafted bangles and cuffs — from brushed steel to rose gold charms.",
  pens: "Luxury writing instruments that make every word feel important.",
  keychains: "Personalised keyrings that carry a memory, a name, or a promise.",
};

export const Shop = () => {
  const [active, setActive] = useState<"all" | Category>("all");
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<"default" | "price-asc" | "price-desc" | "rating">("default");
  const [open, setOpen] = useState<Product | null>(null);
  const { add } = useCart();

  const list = useMemo(() => {
    let filtered = products.filter((p) => {
      const matchCat = active === "all" || p.category === active;
      const q = query.trim().toLowerCase();
      const matchQ =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.material.toLowerCase().includes(q);
      return matchCat && matchQ;
    });

    if (sortBy === "price-asc") filtered = [...filtered].sort((a, b) => a.price - b.price);
    else if (sortBy === "price-desc") filtered = [...filtered].sort((a, b) => b.price - a.price);
    else if (sortBy === "rating") filtered = [...filtered].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));

    return filtered;
  }, [active, query, sortBy]);

  const grouped = useMemo(() => {
    return categories.reduce<Record<Category, Product[]>>(
      (acc, cat) => {
        acc[cat] = list.filter((p) => p.category === cat);
        return acc;
      },
      { bracelets: [], pens: [], keychains: [] }
    );
  }, [list]);

  return (
    <section id="shop" className="relative py-24">
      {/* Subtle background orbs */}
      <div className="pointer-events-none absolute -top-24 left-1/4 h-[30rem] w-[30rem] rounded-full bg-secondary/25 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-[25rem] w-[25rem] rounded-full bg-accent/20 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Section header */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              The collection
            </span>
            <h2 className="mt-2 font-serif text-5xl md:text-6xl text-foreground text-balance">
              Small wonders, <em className="text-primary">spun in 3D</em>
            </h2>
            <p className="mt-3 max-w-md text-sm text-muted-foreground">
              Every product spins in real-time 3D. Hover to drag & rotate — or tap to explore the full view.
            </p>
          </div>

          {/* Search + Sort */}
          <div className="flex flex-col sm:flex-row gap-3 max-w-sm w-full">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search gifts…"
                className="w-full rounded-full border border-border bg-card pl-11 pr-5 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 shadow-soft"
              />
            </div>
            <div className="relative">
              <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="rounded-full border border-border bg-card pl-9 pr-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 appearance-none shadow-soft cursor-pointer"
              >
                <option value="default">Featured</option>
                <option value="rating">Top Rated</option>
                <option value="price-asc">Price: Low–High</option>
                <option value="price-desc">Price: High–Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="mt-8 flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActive(f)}
              className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300 ${
                active === f
                  ? "bg-foreground text-background shadow-soft scale-[1.03]"
                  : "bg-card text-muted-foreground hover:text-foreground border border-border hover:border-foreground/30"
              }`}
            >
              {f !== "all" && categoryIcons[f]}
              {f === "all" ? "All gifts" : categoryLabel[f]}
              <span
                className={`rounded-full text-[10px] px-1.5 py-0.5 ${
                  active === f ? "bg-background/20 text-background" : "bg-secondary text-muted-foreground"
                }`}
              >
                {f === "all" ? products.length : products.filter((p) => p.category === f).length}
              </span>
            </button>
          ))}
        </div>

        {/* ALL view — column-per-category */}
        {active === "all" ? (
          <div className="mt-14 space-y-20">
            {categories.map((cat) => {
              const items = grouped[cat];
              if (items.length === 0) return null;
              const heroProduct = items[0];

              return (
                <div key={cat} id={cat}>
                  {/* Category sub-header */}
                  <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative h-16 w-16 overflow-hidden rounded-2xl bg-gradient-to-br from-secondary/40 to-accent/30 shadow-soft shrink-0">
                        <img
                          src={heroProduct.image}
                          alt={categoryLabel[cat]}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          {categoryIcons[cat]}
                          <h3 className="font-serif text-3xl text-foreground">{categoryLabel[cat]}</h3>
                          <span className="rounded-full bg-secondary/60 px-2.5 py-0.5 text-xs text-foreground/75">
                            {items.length} items
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground max-w-md">
                          {categoryDescriptions[cat]}
                        </p>
                      </div>
                    </div>
                    <a
                      href={`#${cat}`}
                      onClick={() => setActive(cat)}
                      className="shrink-0 rounded-full border border-border px-4 py-2 text-xs text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
                    >
                      View all {categoryLabel[cat].toLowerCase()} →
                    </a>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {items.map((p, i) => (
                      <div
                        key={p.id}
                        style={{ animationDelay: `${i * 60}ms` }}
                        className="animate-fade-up"
                      >
                        <ProductCard product={p} onOpen={setOpen} onAdd={add} />
                      </div>
                    ))}
                  </div>

                  {/* Divider */}
                  <div className="mt-12 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                </div>
              );
            })}
          </div>
        ) : (
          /* Single-category grid */
          <section className="mt-12">
            <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  {categoryIcons[active as Category]}
                  <h3 className="font-serif text-4xl text-foreground">{categoryLabel[active as Category]}</h3>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {categoryDescriptions[active as Category]}
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-secondary/60 px-4 py-1.5 text-xs uppercase tracking-[0.15em] text-foreground/80">
                {list.length} {list.length === 1 ? "item" : "items"} found
              </span>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {list.map((p, i) => (
                <div key={p.id} style={{ animationDelay: `${i * 60}ms` }} className="animate-fade-up">
                  <ProductCard product={p} onOpen={setOpen} onAdd={add} />
                </div>
              ))}
            </div>
          </section>
        )}

        {list.length === 0 && (
          <div className="mt-20 text-center">
            <p className="font-serif text-2xl text-muted-foreground">No gifts match that search.</p>
            <p className="mt-2 text-sm text-muted-foreground">Try a different word or browse all.</p>
            <button
              onClick={() => { setQuery(""); setActive("all"); }}
              className="mt-4 rounded-full border border-border px-6 py-2.5 text-sm text-foreground hover:bg-card transition-colors"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      <ProductDialog product={open} onClose={() => setOpen(null)} />
    </section>
  );
};
