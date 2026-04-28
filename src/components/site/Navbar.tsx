import { ShoppingBag, Search, User, Menu, X } from "lucide-react";
import { useCart } from "@/store/cart";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";
import { useState } from "react";

export const Navbar = () => {
  const { count, setOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 inset-x-0 z-40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3">
        <nav className="glass shadow-soft rounded-full pl-3 pr-3 py-2 flex items-center justify-between">
          {/* Logo */}
          <a href="#top" className="flex items-center gap-2.5 shrink-0" aria-label="Swapn's Gift World — home">
            <img src={logo} alt="Swapn's Gift World logo" className="h-10 w-10 object-contain" />
            <span className="hidden sm:flex flex-col leading-none">
              <span className="font-serif text-lg text-foreground">
                Swapn's <span className="text-primary">Gift</span>
              </span>
              <span className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground mt-0.5">world</span>
            </span>
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-7 text-sm">
            {[
              { href: "#shop", label: "Shop" },
              { href: "#bracelets", label: "Bracelets" },
              { href: "#pens", label: "Pens" },
              { href: "#keychains", label: "Keychains" },
              { href: "#story", label: "Our Story" },
            ].map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="story-link text-muted-foreground hover:text-foreground transition-colors font-medium"
              >
                {label}
              </a>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="rounded-full hidden sm:inline-flex" aria-label="Search">
              <Search className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full hidden sm:inline-flex" aria-label="Account">
              <User className="h-4 w-4" />
            </Button>
            <button
              onClick={() => setOpen(true)}
              className="relative ml-1 inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm text-background hover:opacity-90 transition-opacity shadow-soft"
              aria-label="Open cart"
            >
              <ShoppingBag className="h-4 w-4" />
              <span className="hidden sm:inline">Cart</span>
              {count > 0 && (
                <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground font-medium min-w-[1.25rem] text-center">
                  {count}
                </span>
              )}
            </button>
            {/* Mobile menu toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full md:hidden ml-1"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </nav>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="mt-2 glass shadow-soft rounded-3xl p-5 flex flex-col gap-3 md:hidden animate-fade-up">
            {[
              { href: "#shop", label: "Shop" },
              { href: "#bracelets", label: "Bracelets" },
              { href: "#pens", label: "Pens" },
              { href: "#keychains", label: "Keychains" },
              { href: "#story", label: "Our Story" },
            ].map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="text-sm text-foreground font-medium py-1.5 border-b border-border/50 last:border-0"
                onClick={() => setMobileMenuOpen(false)}
              >
                {label}
              </a>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};
