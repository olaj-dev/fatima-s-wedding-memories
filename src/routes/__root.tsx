import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { Heart, Menu, X } from "lucide-react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { wedding } from "@/lib/wedding";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: `${wedding.bride} & ${wedding.groom} — Our Nikkah` },
      {
        name: "description",
        content: `Join us as ${wedding.bride} and ${wedding.groom} begin their journey together, ${wedding.dateLabel}, at ${wedding.venue}, Kano.`,
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Jost:wght@300;400;500&family=Amiri:wght@400;700&family=Great+Vibes&display=swap",
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const links = [
    { to: "/", label: "Home" },
    { to: "/note", label: "A Note for Fatima" },
    { to: "/memories", label: "Share Photos" },
    { to: "/quiz", label: "How Well Do You Know Her?" },
  ] as const;

  return (
    <header className="sticky top-0 z-40 border-b border-gold/25 bg-background/85 backdrop-blur">
      <nav className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-5 py-4">
        <Link
          to="/"
          className="font-script text-2xl text-foreground"
          onClick={() => setMenuOpen(false)}
        >
          {wedding.bride[0]} &amp; {wedding.groom[0]}
        </Link>

        {/* Desktop links */}
        <div className="hidden flex-wrap gap-5 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="eyebrow transition-colors hover:text-foreground"
              activeProps={{ className: "eyebrow text-foreground" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-sm border border-gold/40 text-foreground transition-colors hover:bg-accent/20 md:hidden"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {menuOpen && (
        <div className="border-t border-gold/25 bg-background/95 px-5 py-4 backdrop-blur md:hidden">
          <div className="flex flex-col gap-4">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setMenuOpen(false)}
                className="eyebrow transition-colors hover:text-foreground"
                activeProps={{ className: "eyebrow text-foreground" }}
                activeOptions={{ exact: l.to === "/" }}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t border-gold/25 py-10 text-center">
      <p className="font-script text-3xl text-foreground">
        {wedding.bride} &amp; {wedding.groom}
      </p>
      <p className="eyebrow mt-3">{wedding.dateLabel}</p>
      <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
        Built with
        <Heart className="h-3.5 w-3.5 fill-gold text-gold" aria-label="love" />
        by
        <a
          href="https://github.com/olajcodes"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-foreground underline decoration-gold/60 underline-offset-4 transition-colors hover:text-gold"
        >
          Olajcodes
        </a>
      </p>
    </footer>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <SiteHeader />
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
      <SiteFooter />
    </QueryClientProvider>
  );
}
