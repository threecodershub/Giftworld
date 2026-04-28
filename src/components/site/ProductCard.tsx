import { useState, useRef, useCallback } from "react";
import { Product } from "@/data/products";
import { Plus, Star, RotateCcw } from "lucide-react";

interface Props {
  product: Product;
  onOpen: (p: Product) => void;
  onAdd: (p: Product) => void;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`h-3 w-3 ${
            s <= Math.round(rating)
              ? "fill-amber-400 text-amber-400"
              : "fill-none text-border"
          }`}
        />
      ))}
    </div>
  );
}

/**
 * CSS-based 360° image rotation effect.
 * - On hover: applies a continuous Y-rotate animation via CSS perspective.
 * - No WebGL / Three.js used here — all product photos show immediately.
 * - True interactive 3D stays in the ProductDialog.
 */
export const ProductCard = ({ product, onOpen, onAdd }: Props) => {
  const [hovered, setHovered] = useState(false);
  const [imgIndex, setImgIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const images = product.images?.length ? product.images : [product.image];

  const handleMouseEnter = useCallback(() => {
    setHovered(true);
    // Cycle through product angles every 600ms to simulate 360° view
    if (images.length > 1) {
      intervalRef.current = setInterval(() => {
        setImgIndex((i) => (i + 1) % images.length);
      }, 600);
    }
  }, [images.length]);

  const handleMouseLeave = useCallback(() => {
    setHovered(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setImgIndex(0);
  }, []);

  return (
    <article
      className="group card-3d-hover relative flex flex-col overflow-hidden rounded-[2rem] glass shadow-soft transition-all duration-500 hover:-translate-y-2 hover:shadow-float"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Image area */}
      <button
        onClick={() => onOpen(product)}
        className="relative aspect-[4/5] w-full overflow-hidden cursor-pointer bg-gradient-to-br from-secondary/40 to-accent/30"
        aria-label={`View ${product.name} details`}
        style={{ perspective: "800px" }}
      >
        {/* Product photo — cycles on hover for 360 feel */}
        <img
          src={images[imgIndex]}
          alt={product.name}
          className={[
            "absolute inset-0 h-full w-full object-cover transition-all duration-500",
            hovered
              ? "scale-[1.08]"
              : "scale-100",
          ].join(" ")}
          loading="lazy"
          draggable={false}
        />

        {/* Subtle shimmer overlay on hover (simulates light rotating) */}
        {hovered && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.18) 50%, transparent 70%)",
              animation: "shimmer-sweep 1.2s ease-in-out infinite",
            }}
          />
        )}

        {/* Dot indicators for multi-angle images */}
        {images.length > 1 && hovered && (
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === imgIndex ? "w-4 bg-white" : "w-1.5 bg-white/50"
                }`}
              />
            ))}
          </div>
        )}

        {/* Bottom gradient */}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />

        {/* Badge */}
        {product.badge && (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-foreground/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-background shadow-sm">
            {product.badge}
          </span>
        )}

        {/* 360° badge */}
        <span
          className={[
            "absolute right-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] uppercase tracking-[0.1em] backdrop-blur transition-all duration-300",
            hovered
              ? "bg-primary text-primary-foreground"
              : "bg-background/80 text-muted-foreground",
          ].join(" ")}
        >
          <RotateCcw className={`h-3 w-3 ${hovered ? "animate-spin" : ""}`} style={hovered ? { animationDuration: "1.5s" } : {}} />
          <span>{hovered ? "360° View" : "360°"}</span>
        </span>

        {/* Out of stock */}
        {product.inStock === false && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/60 backdrop-blur-sm">
            <span className="rounded-full bg-destructive/90 px-4 py-1.5 text-xs text-white uppercase tracking-widest">
              Out of Stock
            </span>
          </div>
        )}

        {/* "Click for 3D" hint on hover */}
        {hovered && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-background/80 backdrop-blur px-3 py-1.5 text-[10px] text-muted-foreground whitespace-nowrap shadow-soft animate-fade-in">
            Click for interactive 3D view
          </div>
        )}
      </button>

      {/* Info */}
      <div className="flex flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="font-serif text-xl leading-tight text-foreground line-clamp-1">
              {product.name}
            </h3>
            <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">{product.tagline}</p>
          </div>
          <span className="shrink-0 font-serif text-lg font-medium text-foreground whitespace-nowrap">
            ₹{product.price.toLocaleString("en-IN")}
          </span>
        </div>

        {/* Stars + swatches */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {product.rating && <StarRating rating={product.rating} />}
            {product.reviewCount && (
              <span className="text-[10px] text-muted-foreground">({product.reviewCount})</span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {product.colors.slice(0, 3).map((c, i) => (
              <span
                key={i}
                className="h-3.5 w-3.5 rounded-full ring-1 ring-border/60 shadow-sm"
                style={{ background: c }}
              />
            ))}
          </div>
        </div>

        {/* CTAs */}
        <div className="flex items-center gap-2 mt-1">
          <button
            onClick={() => onOpen(product)}
            className="flex-1 rounded-full border border-border py-2 text-xs text-muted-foreground hover:border-foreground hover:text-foreground transition-all duration-200"
          >
            Quick View
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onAdd(product); }}
            disabled={product.inStock === false}
            className="pulse-ring shrink-0 inline-flex h-10 w-10 items-center justify-center rounded-full bg-foreground text-background shadow-soft transition-transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={`Add ${product.name} to cart`}
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
};
