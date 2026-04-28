import logo from "@/assets/logo.png";
import { Mail, Instagram, Twitter, Heart } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="relative border-t border-border/60 bg-gradient-to-b from-secondary/20 to-background">
      {/* Decorative top gradient line */}
      <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-4">
          {/* Brand col */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3">
              <img src={logo} alt="Swapn's Gift World" className="h-12 w-12 object-contain" />
              <div className="flex flex-col leading-none">
                <span className="font-serif text-2xl text-foreground">
                  Swapn's <span className="text-primary">Gift</span>
                </span>
                <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mt-1">world</span>
              </div>
            </div>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground leading-relaxed">
              A 3D-first gift boutique. Curated bracelets, pens, and keychains — every piece explored in immersive 3D before it reaches your door.
            </p>

            {/* Newsletter */}
            <form className="mt-6 flex max-w-sm gap-2" onSubmit={(e) => e.preventDefault()}>
              <div className="relative flex-1">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  type="email"
                  placeholder="Your email for soft launches"
                  className="w-full rounded-full border border-border bg-card pl-10 pr-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
              <button
                type="submit"
                className="rounded-full bg-foreground px-5 py-2.5 text-sm text-background hover:opacity-90 transition-opacity shadow-soft"
              >
                Join
              </button>
            </form>

            {/* Social icons */}
            <div className="mt-5 flex items-center gap-3">
              {[
                { icon: <Instagram className="h-4 w-4" />, label: "Instagram" },
                { icon: <Twitter className="h-4 w-4" />, label: "Twitter" },
              ].map(({ icon, label }) => (
                <button
                  key={label}
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Shop links */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-medium">Shop</h4>
            <ul className="mt-5 space-y-3 text-sm text-foreground/80">
              <li><a href="#bracelets" className="story-link hover:text-foreground transition-colors">Bracelets</a></li>
              <li><a href="#pens" className="story-link hover:text-foreground transition-colors">Pens</a></li>
              <li><a href="#keychains" className="story-link hover:text-foreground transition-colors">Keychains</a></li>
              <li><a href="#shop" className="story-link hover:text-foreground transition-colors">All gifts</a></li>
            </ul>
          </div>

          {/* Studio links */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-medium">Studio</h4>
            <ul className="mt-5 space-y-3 text-sm text-foreground/80">
              <li><a href="#story" className="story-link hover:text-foreground transition-colors">Our craft</a></li>
              <li><a href="#" className="story-link hover:text-foreground transition-colors">Wrap & shipping</a></li>
              <li><a href="#" className="story-link hover:text-foreground transition-colors">Returns</a></li>
              <li><a href="#" className="story-link hover:text-foreground transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col gap-3 border-t border-border/60 pt-6 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
          <span>© {new Date().getFullYear()} Swapn's Gift World · All rights reserved</span>
          <span className="flex items-center gap-1.5">
            Made with <Heart className="h-3 w-3 fill-primary text-primary" /> and wrapped with care.
          </span>
        </div>
      </div>
    </footer>
  );
};
