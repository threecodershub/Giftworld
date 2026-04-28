import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCart } from "@/store/cart";
import { ProductCanvas } from "@/components/three/ProductCanvas";
import { Minus, Plus, X, ShoppingBag, Gift, Truck } from "lucide-react";

export const CartDrawer = () => {
  const { items, open, setOpen, setQty, remove, total, clear, count } = useCart();
  const freeShippingThreshold = 2000;
  const progress = Math.min(100, (total / freeShippingThreshold) * 100);
  const remaining = Math.max(0, freeShippingThreshold - total);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="w-full sm:max-w-md p-0 flex flex-col bg-background/98 backdrop-blur-xl">
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-border">
          <SheetTitle className="font-serif text-3xl text-foreground flex items-center gap-3">
            <ShoppingBag className="h-6 w-6" />
            Your bag
            <span className="text-sm text-muted-foreground font-sans ml-1">
              {count} {count === 1 ? "gift" : "gifts"}
            </span>
          </SheetTitle>
        </SheetHeader>

        {/* Free shipping progress */}
        {items.length > 0 && (
          <div className="px-6 py-3 bg-secondary/30 border-b border-border">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
              <Truck className="h-3.5 w-3.5 shrink-0" />
              {remaining > 0
                ? `Add ₹${remaining.toLocaleString("en-IN")} more for free shipping`
                : <span className="text-green-600 font-medium">🎉 You've unlocked free shipping!</span>
              }
            </div>
            <div className="h-1.5 rounded-full bg-border overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-amber-400 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center text-muted-foreground py-20 gap-4">
              <div className="rounded-full bg-secondary/40 p-6">
                <ShoppingBag className="h-10 w-10 opacity-50" />
              </div>
              <div>
                <p className="font-serif text-2xl text-foreground">Nothing wrapped yet.</p>
                <p className="mt-1 text-sm">Add a little wonder from the shop.</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="mt-2 rounded-full border border-border px-6 py-2.5 text-sm text-foreground hover:bg-card transition-colors"
              >
                Browse gifts →
              </button>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map(({ product, qty }) => (
                <li key={product.id} className="flex gap-4 rounded-2xl glass p-3 shadow-soft">
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-secondary/40 to-accent/30">
                    <ProductCanvas
                      category={product.category}
                      colors={product.colors}
                      image={product.image}
                      className="absolute inset-0"
                      scale={0.85}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h4 className="font-serif text-base text-foreground line-clamp-1">{product.name}</h4>
                        <p className="text-xs text-muted-foreground line-clamp-1">{product.tagline}</p>
                        {product.badge && (
                          <span className="mt-1 inline-block rounded-full bg-primary/10 text-primary px-2 py-0.5 text-[10px] font-medium">
                            {product.badge}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => remove(product.id)}
                        className="text-muted-foreground hover:text-foreground transition-colors shrink-0 mt-0.5"
                        aria-label={`Remove ${product.name}`}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="inline-flex items-center rounded-full border border-border bg-card shadow-soft">
                        <button
                          onClick={() => setQty(product.id, qty - 1)}
                          className="p-1.5 hover:text-foreground transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-7 text-center text-xs font-medium">{qty}</span>
                        <button
                          onClick={() => setQty(product.id, qty + 1)}
                          className="p-1.5 hover:text-foreground transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <span className="font-serif text-base text-foreground">
                        ₹{(product.price * qty).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-border p-6 space-y-4">
            {/* Gift wrap note */}
            <div className="flex items-center gap-2 rounded-2xl bg-secondary/30 px-4 py-3 text-xs text-muted-foreground">
              <Gift className="h-3.5 w-3.5 shrink-0 text-primary" />
              Every order arrives in a recycled-petal envelope, gift-ready.
            </div>

            {/* Subtotal */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Subtotal</span>
              <span className="font-serif text-2xl text-foreground">₹{total.toLocaleString("en-IN")}</span>
            </div>

            {/* Checkout */}
            <button className="w-full rounded-full bg-foreground py-3.5 text-sm text-background shadow-float transition-all hover:-translate-y-0.5 hover:shadow-glow font-medium">
              Proceed to Checkout
            </button>
            <button
              onClick={clear}
              className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Clear bag
            </button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
