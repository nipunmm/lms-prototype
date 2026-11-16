"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { useT, pick } from "@/lib/i18n";
import { money, shortDate } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SiteClassCard } from "@/components/site/class-card";
import {
  GraduationCap, Users, Star, PlayCircle, CheckCircle2, ArrowRight, Quote,
  Sparkles, CalendarDays, MessageCircle, ShieldCheck, Zap, Phone,
} from "lucide-react";

export default function SiteHomePage() {
  const router = useRouter();
  const db = useAppStore((s) => s.db);
  const siteLang = useAppStore((s) => s.siteLang);
  const setLmsLang = useAppStore((s) => s.setLmsLang);
  const t = useT(siteLang);

  const teacher = db.teacher;
  const featured = db.classes.filter((c) => c.active && c.shownOnWebsite && c.type === "Theory").slice(0, 3);
  const updates = db.updates.filter((u) => u.published).slice(0, 3);
  const testimonials = db.testimonials.filter((x) => x.approved).slice(0, 2);
  const results = db.resultsWall.filter((r) => r.approved);
  const marquee = [...results, ...results];

  const join = () => {
    setLmsLang(siteLang);
    router.push("/lms/home");
  };

  const joinSteps = siteLang === "si"
    ? ["නොමිලේ එකතු වන්න", "පන්තියක් තෝරන්න", "අනුමැතිය ලබාගන්න", "ගෙවා ආරම්භ කරන්න"]
    : ["Join free", "Choose a class", "Get approved", "Pay & start"];

  return (
    <div className="bg-background">
      {/* HERO */}
      <section className="relative isolate overflow-hidden bg-[#07111f] text-white">
        <div className="absolute inset-0" style={{ background: "var(--site-hero)" }} />
        <div className="absolute inset-0 opacity-[0.18]" style={{ backgroundImage: "var(--site-grid)", backgroundSize: "42px 42px" }} />
        <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-teal-400/20 blur-3xl" />
        <div className="absolute bottom-0 -left-16 h-72 w-72 rounded-full bg-amber-400/15 blur-3xl" />

        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pb-16 pt-14 lg:grid-cols-[1.1fr_.9fr] lg:pb-24 lg:pt-20">
          <div>
            <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/80 backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" /> {t("site.hero.eyebrow")}
            </div>
            <h1 className="animate-fade-up-delay mt-5 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              <span className="bg-gradient-to-r from-white via-white to-teal-200 bg-clip-text text-transparent">
                {pick(teacher.headline, siteLang)}
              </span>
            </h1>
            <p className="animate-fade-up-delay-2 mt-5 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
              {pick(teacher.promise, siteLang)}
            </p>
            <div className="animate-fade-up-delay-2 mt-8 flex flex-wrap gap-3">
              <Button size="lg" onClick={join} className="h-12 bg-amber-400 px-6 text-[#07111f] hover:bg-amber-300 shadow-[0_12px_30px_-10px_rgba(245,158,11,0.7)]">
                {t("site.hero.cta")} <ArrowRight className="h-4 w-4" />
              </Button>
              <Link href="/site/classes">
                <Button size="lg" variant="outline" className="h-12 border-white/25 bg-white/5 px-6 text-white hover:bg-white/10 hover:text-white">
                  {t("site.hero.secondary")}
                </Button>
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-3 sm:max-w-lg">
              {[
                { value: `${teacher.studentsTaught.toLocaleString()}+`, label: t("site.results.studentsTaught"), icon: Users },
                { value: `${teacher.experienceYears}+`, label: t("site.results.years"), icon: GraduationCap },
                { value: `${results.length}+`, label: siteLang === "si" ? "ප්‍රතිඵල" : "Top results", icon: Star },
              ].map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.label} className="rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-4 backdrop-blur">
                    <Icon className="h-4 w-4 text-teal-300" />
                    <p className="mt-2 font-display text-xl font-bold sm:text-2xl">{s.value}</p>
                    <p className="text-[11px] leading-snug text-white/55 sm:text-xs">{s.label}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="relative lg:pl-4">
            <div className="animate-float relative rounded-[2rem] border border-white/10 bg-white/5 p-3 shadow-2xl backdrop-blur">
              <div
                className="relative flex h-64 items-center justify-center overflow-hidden rounded-[1.5rem] sm:h-80"
                style={{ background: `linear-gradient(140deg, hsl(${teacher.avatarHue} 60% 42%), hsl(${(teacher.avatarHue + 50) % 360} 65% 28%))` }}
              >
                <div className="absolute inset-0 opacity-25" style={{ backgroundImage: "radial-gradient(circle at 30% 20%, #fff, transparent 35%), radial-gradient(circle at 80% 80%, #fff, transparent 30%)" }} />
                <span className="font-display text-7xl font-bold text-white/95 sm:text-8xl">{teacher.name.split(" ").slice(-1)[0][0]}</span>
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                  <div className="rounded-xl bg-black/25 px-3 py-2 backdrop-blur">
                    <p className="text-sm font-semibold">{teacher.name}</p>
                    <p className="text-[11px] text-white/70">{pick(teacher.subject, siteLang)}</p>
                  </div>
                  <div className="flex items-center gap-1 rounded-full bg-amber-400 px-2.5 py-1 text-[11px] font-semibold text-[#07111f]">
                    <ShieldCheck className="h-3.5 w-3.5" /> {siteLang === "si" ? "විශ්වාසනීය" : "Trusted"}
                  </div>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                  <p className="text-[11px] text-white/50">{siteLang === "si" ? "සජීවී පන්ති" : "Live on"}</p>
                  <p className="font-semibold">Zoom + LMS</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                  <p className="text-[11px] text-white/50">{siteLang === "si" ? "මාධ්‍යය" : "Medium"}</p>
                  <p className="font-semibold">Sinhala / English</p>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-5 -left-2 hidden rounded-2xl border border-white/10 bg-[#0f2138]/90 p-4 shadow-xl backdrop-blur sm:block">
              <p className="text-xs text-white/60">{siteLang === "si" ? "ආරම්භයට සරලයි" : "Simple to start"}</p>
              <p className="mt-1 font-semibold">{siteLang === "si" ? "නොමිලේ ගිණුමක් → පන්තියක් ඉල්ලන්න" : "Free account → request a class"}</p>
            </div>
          </div>
        </div>

        {/* proof marquee */}
        {results.length > 0 ? (
          <div className="relative border-t border-white/10 bg-white/[0.03] py-4">
            <div className="flex overflow-hidden">
              <div className="animate-marquee flex min-w-full shrink-0 items-center gap-4 px-4">
                {marquee.map((r, i) => (
                  <div key={`${r.id}-${i}`} className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm whitespace-nowrap">
                    <Star className="h-3.5 w-3.5 text-amber-300" />
                    <span className="font-medium">{r.studentName}</span>
                    <span className="text-white/50">· {pick(r.achievement, siteLang)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </section>

      {/* CLASSES */}
      <section className="relative mx-auto max-w-6xl px-4 py-16 sm:py-20">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{siteLang === "si" ? "පන්ති සහ ගාස්තු" : "Classes & fees"}</p>
            <h2 className="mt-2 font-display text-3xl font-bold text-foreground sm:text-4xl">{t("site.classes.title")}</h2>
            <p className="mt-2 max-w-2xl text-muted-foreground">{t("site.classes.subtitle")}</p>
          </div>
          <Link href="/site/classes" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
            {t("common.viewClasses")} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {featured.map((c) => (
            <SiteClassCard key={c.id} cls={c} featured />
          ))}
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5"><Zap className="h-4 w-4 text-amber-500" /> {siteLang === "si" ? "විවෘත / පිරී / වසා — තත්ත්වය පැහැදිලියි" : "Open / Full / Closed status shown clearly"}</span>
          <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-primary" /> {siteLang === "si" ? "ගාස්තු සහ කාලසටහන් එකම තැනින්" : "Fees & timetables from a single source"}</span>
        </div>
      </section>

      {/* PROOF + TESTIMONIALS */}
      <section className="border-y border-border bg-muted/40">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:py-20 lg:grid-cols-[1fr_1.05fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{t("site.results.wall")}</p>
            <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">{siteLang === "si" ? "ප්‍රතිඵල කතා කරයි" : "Results that speak"}</h2>
            <p className="mt-2 text-muted-foreground">{siteLang === "si" ? "අනුමත කළ ප්‍රතිඵල සහ සිසුන්ගේ අත්දැකීම්." : "Approved outcomes and real student experiences."}</p>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4">
              {results.slice(0, 4).map((r, i) => (
                <div key={r.id} className={cn("rounded-2xl border border-border bg-surface p-4 shadow-sm", i === 0 ? "col-span-2 sm:col-span-1 bg-gradient-to-br from-primary/5 to-amber-50/50" : "")}>
                  <Star className="h-5 w-5 text-amber-500" />
                  <p className="mt-2 font-semibold">{r.studentName}</p>
                  <p className="text-sm text-muted-foreground">{pick(r.achievement, siteLang)}</p>
                </div>
              ))}
            </div>
            <Link href="/site/results" className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
              {t("site.nav.results")} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{t("site.results.testimonials")}</p>
            <div className="mt-4 grid gap-4">
              {testimonials.map((tm) => (
                <Card key={tm.id} className="overflow-hidden border-border/80 shadow-sm">
                  <CardContent className="relative pt-6">
                    <Quote className="absolute right-5 top-5 h-8 w-8 text-primary/10" />
                    <p className="pr-8 text-base leading-relaxed text-foreground">{pick(tm.quote, siteLang)}</p>
                    <div className="mt-4 flex items-center justify-between text-sm">
                      <span className="font-semibold">{tm.studentName}</span>
                      {tm.video ? <span className="inline-flex items-center gap-1 text-muted-foreground"><PlayCircle className="h-4 w-4 text-danger" /> Video</span> : null}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* UPDATES */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{siteLang === "si" ? "නවතම" : "Latest"}</p>
            <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">{t("site.updates.title")}</h2>
          </div>
          <Link href="/site/updates" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
            {t("site.nav.updates")} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {updates.map((u, i) => (
            <Card key={u.id} className={cn("border-border transition-shadow hover:shadow-md", i === 0 ? "md:col-span-2 md:row-span-1 bg-gradient-to-br from-surface to-primary/5" : "")}>
              <CardContent className="pt-5">
                <div className="flex items-center gap-2">
                  <Badge tone={u.kind === "event" ? "info" : "default"}>{u.kind === "event" ? "Event" : "Update"}</Badge>
                  {u.eventDate ? (
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground"><CalendarDays className="h-3.5 w-3.5" /> {shortDate(u.eventDate, siteLang)}</span>
                  ) : null}
                </div>
                <h3 className={cn("mt-3 font-semibold", i === 0 ? "font-display text-xl" : "text-base")}>{pick(u.title, siteLang)}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{pick(u.body, siteLang)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* HOW TO JOIN + CTA */}
      <section className="relative overflow-hidden bg-[#07111f] text-white">
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 10% 20%, rgba(20,184,166,.4), transparent 30%), radial-gradient(circle at 90% 80%, rgba(245,158,11,.3), transparent 25%)" }} />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-300">{t("site.how.join.title")}</p>
            <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">{siteLang === "si" ? "පියවර 4කින් ආරම්භ කරන්න" : "Start in 4 simple steps"}</h2>
            <p className="mt-3 text-white/65">{siteLang === "si" ? "නොමිලේ ගිණුමක් සාදා, ඔබට ගැලපෙන පන්තියක් ඉල්ලා, ගෙවීමෙන් පසු ඉගෙනීම ආරම්භ කරන්න." : "Create a free account, request the right class, get approved, and start learning."}</p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {joinSteps.map((step, i) => (
              <div key={i} className="relative rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 text-sm font-bold text-[#07111f]">{i + 1}</div>
                <p className="mt-3 font-medium">{step}</p>
                {i < 3 ? <div className="absolute right-4 top-7 hidden h-px w-8 bg-white/20 lg:block" /> : null}
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" onClick={join} className="h-12 bg-amber-400 px-8 text-[#07111f] hover:bg-amber-300">
              {t("site.hero.cta")} <ArrowRight className="h-4 w-4" />
            </Button>
            <Link href="/site/contact" className="inline-flex items-center gap-2 text-sm font-medium text-white/80 hover:text-white">
              <MessageCircle className="h-4 w-4" /> {siteLang === "si" ? "WhatsApp / ඇමතුමක් ඉල්ලන්න" : "WhatsApp or request a call-back"}
            </Link>
          </div>
          <p className="mt-4 text-center text-xs text-white/45 inline-flex w-full items-center justify-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5" /> {siteLang === "si" ? "නොමිලේ ගිණුම • බලහත්කාරයක් නැත" : "Free account • No commitment to join"}</p>
        </div>
      </section>

      {/* MOBILE STICKY CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-surface/95 p-3 backdrop-blur-xl lg:hidden">
        <div className="mx-auto flex max-w-6xl gap-2">
          <Link href="/site/contact" className="flex-1">
            <Button variant="outline" className="w-full gap-2"><Phone className="h-4 w-4" /> {siteLang === "si" ? "අමතන්න" : "Contact"}</Button>
          </Link>
          <Button className="flex-1 gap-2 bg-amber-400 text-[#07111f] hover:bg-amber-300" onClick={join}>
            {t("common.joinFree")} <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="h-20 lg:hidden" />
    </div>
  );
}

function cn(...c: (string | false | undefined)[]) { return c.filter(Boolean).join(" "); }
