import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Product } from "@/data/products";
import { ProductCanvas } from "@/components/three/ProductCanvas";
import { Plus, Minus, ShoppingBag, RotateCcw, Star, ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/store/cart";

interface Props {
  product: Product | null;
  onClose: () => void;
}

function StarRating({ rating, reviewCount }: { rating: number; reviewCount?: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            className={`h-3.5 w-3.5 ${
              s <= Math.round(rating)
                ? "fill-amber-400 text-amber-400"
                : "fill-none text-gray-300"
            }`}
          />
        ))}
      </div>
      <span className="text-sm font-semibold text-foreground">{rating.toFixed(1)}</span>
      {reviewCount && (
        <span className="text-xs text-muted-foreground">· {reviewCount} reviews</span>
      )}
    </div>
  );
}

export const ProductDialog = ({ product, onClose }: Props) => {
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [viewMode, setViewMode] = useState<"3d" | "photo">("3d");
  const { add } = useCart();

  const images = product?.images?.length ? product.images : product ? [product.image] : [];

  const prevImage = () => setActiveImage((i) => (i - 1 + images.length) % images.length);
  const nextImage = () => setActiveImage((i) => (i + 1) % images.length);

  const handleClose = () => {
    onClose();
    setQty(1);
    setActiveImage(0);
    setViewMode("3d");
  };

  return (
    <Dialog open={!!product} onOpenChange={(o) => { if (!o) handleClose(); }}>
      <DialogContent className="max-w-5xl p-0 border-0 rounded-[2rem] overflow-hidden shadow-float bg-background">
        {product && (
          <div className="flex flex-col md:flex-row max-h-[90vh]">

            {/* ── LEFT: viewer ── */}
            <div className="relative flex flex-col md:w-1/2 bg-gradient-to-br from-secondary/30 to-accent/20 min-h-[320px]">

              {/* 3D / Photo toggle */}
              <div className="absolute top-4 left-4 z-20 flex items-center gap-1 rounded-full bg-white/90 backdrop-blur p-1 shadow-soft">
                <button
                  onClick={() => setViewMode("3d")}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                    viewMode === "3d"
                      ? "bg-foreground text-background shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  3D View
                </button>
                <button
                  onClick={() => setViewMode("photo")}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                    viewMode === "photo"
                      ? "bg-foreground text-background shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Photos
                </button>
              </div>

              {/* Viewer */}
              <div className="relative flex-1" style={{ minHeight: 320 }}>
                {viewMode === "3d" ? (
                  <>
                    <ProductCanvas
                      category={product.category}
                      colors={product.colors}
                      image={product.image}
                      interactive
                      className="absolute inset-0 w-full h-full"
                    />
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 inline-flex items-center gap-2 rounded-full bg-white/80 backdrop-blur px-4 py-2 text-xs text-gray-600 shadow-soft whitespace-nowrap">
                      <RotateCcw className="h-3.5 w-3.5 shrink-0" />
                      Drag to rotate · Scroll to zoom
                    </div>
                  </>
                ) : (
                  /* Photo view */
                  <div className="absolute inset-0 w-full h-full bg-gray-50">
                    <img
                      key={images[activeImage]}
                      src={images[activeImage]}
                      alt={`${product.name} — photo ${activeImage + 1}`}
                      className="w-full h-full object-cover"
                    />

                    {/* Left / Right arrows */}
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-soft text-foreground hover:bg-white transition-colors"
                          aria-label="Previous image"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-soft text-foreground hover:bg-white transition-colors"
                          aria-label="Next image"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </>
                    )}

                    {/* Photo counter */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 inline-flex items-center gap-2 rounded-full bg-white/80 backdrop-blur px-4 py-2 text-xs text-gray-600 shadow-soft">
                      <ZoomIn className="h-3.5 w-3.5" />
                      Photo {activeImage + 1} of {images.length}
                    </div>
                  </div>
                )}
              </div>

              {/* Thumbnail strip (photo mode) */}
              {viewMode === "photo" && images.length > 1 && (
                <div className="flex items-center gap-2 px-4 pb-4 pt-2 overflow-x-auto bg-white/60 backdrop-blur">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`shrink-0 h-14 w-14 rounded-xl overflow-hidden ring-2 transition-all ${
                        activeImage === i
                          ? "ring-foreground scale-105"
                          : "ring-transparent opacity-60 hover:opacity-90"
                      }`}
                    >
                      <img src={img} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ── RIGHT: product info ── */}
            <div className="flex flex-col p-7 md:p-9 overflow-y-auto md:w-1/2 bg-background">

              {/* Category + badge */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-medium">
                  {product.category}
                </span>
                {product.badge && (
                  <span className="rounded-full bg-primary/15 text-primary px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide">
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Name + tagline */}
              <h2 className="mt-2 font-serif text-3xl text-foreground leading-tight">
                {product.name}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground italic">{product.tagline}</p>

              {/* Rating */}
              {product.rating && (
                <div className="mt-4">
                  <StarRating rating={product.rating} reviewCount={product.reviewCount} />
                </div>
              )}

              {/* Price */}
              <div className="mt-5 flex items-baseline gap-2">
                <span className="font-serif text-3xl text-foreground font-medium">
                  ₹{product.price.toLocaleString("en-IN")}
                </span>
                <span className="text-xs text-muted-foreground">incl. all taxes</span>
              </div>

              {/* Description */}
              <p className="mt-4 text-sm leading-relaxed text-foreground/80">
                {product.description}
              </p>

              {/* Material + palette */}
              <div className="mt-5 grid grid-cols-2 gap-3 rounded-2xl bg-secondary/25 p-4 text-xs">
                <div>
                  <div className="uppercase tracking-[0.18em] text-muted-foreground font-medium">Material</div>
                  <div className="mt-1 text-foreground font-medium">{product.material}</div>
                </div>
                <div>
                  <div className="uppercase tracking-[0.18em] text-muted-foreground font-medium">Palette</div>
                  <div className="mt-2 flex gap-2">
                    {product.colors.map((c, i) => (
                      <span
                        key={i}
                        className="h-5 w-5 rounded-full ring-2 ring-white shadow"
                        style={{ background: c }}
                        title={c}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Perks */}
              <div className="mt-4 flex flex-wrap gap-2">
                {["✓ Free gift wrap", "✓ Free shipping ₹2k+", "✓ Easy returns"].map((perk) => (
                  <span
                    key={perk}
                    className="rounded-full border border-border bg-card px-3 py-1 text-[10px] uppercase tracking-[0.1em] text-muted-foreground font-medium"
                  >
                    {perk}
                  </span>
                ))}
              </div>

              {/* Qty + Add to bag */}
              <div className="mt-auto pt-6 flex items-center gap-3">
                <div className="inline-flex items-center rounded-full border border-border bg-card shadow-soft">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="p-3 text-foreground hover:bg-secondary/40 transition-colors rounded-l-full"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-9 text-center text-sm font-semibold text-foreground">{qty}</span>
                  <button
                    onClick={() => setQty((q) => q + 1)}
                    className="p-3 text-foreground hover:bg-secondary/40 transition-colors rounded-r-full"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
                <button
                  onClick={() => {
                    for (let i = 0; i < qty; i++) add(product);
                    handleClose();
                  }}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-foreground py-3.5 text-sm font-medium text-background shadow-float transition-all hover:-translate-y-0.5 hover:shadow-glow active:scale-[0.98]"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Add to bag · ₹{(product.price * qty).toLocaleString("en-IN")}
                </button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
