"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAppStore } from "@/lib/store";
import { useT, pick } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { DemoBar } from "@/components/shared/demo-bar";
import { LangToggle } from "@/components/shared/lang-toggle";
import { Toaster } from "@/components/shared/toast";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone, Mail, MessageCircle, ArrowRight } from "lucide-react";

const navItems = [
  { href: "/site", key: "site.nav.home" },
  { href: "/site/classes", key: "site.nav.classes" },
  { href: "/site/updates", key: "site.nav.updates" },
  { href: "/site/results", key: "site.nav.results" },
  { href: "/site/how-it-works", key: "site.nav.how" },
  { href: "/site/about", key: "site.nav.about" },
  { href: "/site/contact", key: "site.nav.contact" },
];

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const siteLang = useAppStore((s) => s.siteLang);
  const setLmsLang = useAppStore((s) => s.setLmsLang);
  const teacher = useAppStore((s) => s.db.teacher);
  const t = useT(siteLang);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goToLms = (path: string) => {
    setLmsLang(siteLang);
    router.push(path);
  };

  const isHome = pathname === "/site";

  return (
    <div className={cn("app-site flex min-h-screen flex-col", isHome ? "bg-[#07111f]" : "bg-background")}>
      <DemoBar app="site" />

      <header
        className={cn(
          "sticky top-0 z-40 transition-all duration-300",
          scrolled || !isHome
            ? "border-b border-border/80 bg-surface/90 backdrop-blur-xl shadow-[0_10px_30px_-20px_rgba(7,17,31,0.4)]"
            : "border-b border-transparent bg-transparent",
        )}
      >
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
          <Link href="/site" className="flex items-center gap-2.5">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold text-white shadow-inner"
              style={{ background: `linear-gradient(135deg, hsl(${teacher.avatarHue} 65% 45%), hsl(${(teacher.avatarHue + 40) % 360} 70% 35%))` }}
            >
              {teacher.name.split(" ").slice(-1)[0][0]}
            </div>
            <div className="leading-tight">
              <p className={cn("text-sm font-bold", !scrolled && isHome ? "text-white" : "text-foreground")}>{teacher.name}</p>
              <p className={cn("text-[11px]", !scrolled && isHome ? "text-white/60" : "text-muted-foreground")}>{pick(teacher.subject, siteLang)}</p>
            </div>
          </Link>

          <nav className="ml-4 hidden items-center gap-0.5 lg:flex">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? (!scrolled && isHome ? "bg-white/15 text-white" : "bg-primary/10 text-primary")
                      : (!scrolled && isHome ? "text-white/75 hover:bg-white/10 hover:text-white" : "text-muted-foreground hover:bg-muted hover:text-foreground"),
                  )}
                >
                  {t(item.key)}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <div className={cn(!scrolled && isHome ? "[&_button]:text-white/80 [&_.bg-primary]:bg-white [&_.bg-primary]:text-[#07111f]" : "") }>
              <LangToggle scope="site" />
            </div>
            <button
              onClick={() => goToLms("/lms/login")}
              className={cn(
                "hidden text-sm font-medium sm:block transition-colors",
                !scrolled && isHome ? "text-white/80 hover:text-white" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {t("common.studentLogin")}
            </button>
            <Button
              size="sm"
              className={cn(
                "gap-1.5 shadow-lg",
                !scrolled && isHome ? "bg-accent text-[#07111f] hover:bg-amber-400 shadow-amber-500/20" : "shadow-primary/20",
              )}
              onClick={() => goToLms("/lms/home")}
            >
              {t("common.joinFree")} <ArrowRight className="h-3.5 w-3.5" />
            </Button>
            <button
              className={cn("lg:hidden p-1", !scrolled && isHome ? "text-white" : "text-foreground")}
              onClick={() => setOpen((o) => !o)}
              aria-label="Menu"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {open ? (
          <div className="border-t border-border bg-surface/98 backdrop-blur-xl lg:hidden">
            <div className="mx-auto grid max-w-6xl gap-1 px-4 py-3">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-xl px-3 py-2.5 text-sm font-medium",
                    pathname === item.href ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted",
                  )}
                >
                  {t(item.key)}
                </Link>
              ))}
              <button onClick={() => { setOpen(false); goToLms("/lms/login"); }} className="rounded-xl px-3 py-2.5 text-left text-sm font-medium text-muted-foreground hover:bg-muted">
                {t("common.studentLogin")}
              </button>
            </div>
          </div>
        ) : null}
      </header>

      <main className={cn("flex-1", isHome ? "bg-background" : "")}>{children}</main>

      <footer className="relative overflow-hidden border-t border-white/10 bg-[#07111f] text-white">
        <div className="pointer-events-none absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 20% 0%, rgba(20,184,166,.35), transparent 35%), radial-gradient(circle at 80% 100%, rgba(245,158,11,.25), transparent 30%)" }} />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <p className="font-display text-xl font-semibold">{teacher.name}</p>
            <p className="mt-2 text-sm leading-relaxed text-white/65">{pick(teacher.headline, siteLang)}</p>
            <Button size="sm" className="mt-5 bg-accent text-[#07111f] hover:bg-amber-400" onClick={() => goToLms("/lms/home")}>
              {t("common.joinFree")}
            </Button>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">{t("site.nav.classes")}</p>
            <div className="mt-3 grid gap-2 text-sm text-white/70">
              <Link href="/site/classes" className="hover:text-white">{t("site.nav.classes")}</Link>
              <Link href="/site/updates" className="hover:text-white">{t("site.nav.updates")}</Link>
              <Link href="/site/results" className="hover:text-white">{t("site.nav.results")}</Link>
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">{t("site.nav.how")}</p>
            <div className="mt-3 grid gap-2 text-sm text-white/70">
              <Link href="/site/how-it-works" className="hover:text-white">{t("site.nav.how")}</Link>
              <Link href="/site/about" className="hover:text-white">{t("site.nav.about")}</Link>
              <Link href="/site/contact" className="hover:text-white">{t("site.nav.contact")}</Link>
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">{t("site.nav.contact")}</p>
            <div className="mt-3 grid gap-2.5 text-sm text-white/70">
              <span className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-accent" /> {teacher.phone}</span>
              <span className="flex items-center gap-2"><Mail className="h-3.5 w-3.5 text-accent" /> {teacher.email}</span>
              <span className="flex items-center gap-2"><MessageCircle className="h-3.5 w-3.5 text-accent" /> WhatsApp: {teacher.whatsapp}</span>
            </div>
          </div>
        </div>
        <div className="relative border-t border-white/10 py-4 text-center text-xs text-white/45">
          © {new Date().getFullYear()} {teacher.name} · {pick(teacher.subject, siteLang)}
        </div>
      </footer>

      <Toaster />
    </div>
  );
}
