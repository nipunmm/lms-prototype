"use client";

import { useAppStore } from "@/lib/store";
import { useT, pick } from "@/lib/i18n";
import { Star, Quote, PlayCircle, Users, GraduationCap, ShieldCheck, Award } from "lucide-react";

export default function SiteResultsPage() {
  const db = useAppStore((s) => s.db);
  const siteLang = useAppStore((s) => s.siteLang);
  const t = useT(siteLang);
  const teacher = db.teacher;
  const results = db.resultsWall.filter((r) => r.approved);
  const testimonials = db.testimonials.filter((x) => x.approved);

  return (
    <div className="bg-background">
      <section className="relative overflow-hidden border-b border-border bg-[#07111f] text-white">
        <div className="absolute inset-0 opacity-30" style={{ background: "radial-gradient(circle at 20% 30%, rgba(245,158,11,.35), transparent 35%), radial-gradient(circle at 85% 20%, rgba(20,184,166,.3), transparent 30%)" }} />
        <div className="relative mx-auto max-w-6xl px-4 py-14 sm:py-18">
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-amber-300"><Award className="h-3.5 w-3.5" /> {siteLang === "si" ? "විශ්වාසය සහ ප්‍රතිඵල" : "Trust & outcomes"}</p>
          <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">{t("site.results.title")}</h1>
          <p className="mt-3 max-w-2xl text-white/70">{siteLang === "si" ? "සැබෑ සිසුන්ගේ ප්‍රතිඵල සහ අත්දැකීම් — ගුරුවරයා විසින් අනුමත කර ප්‍රකාශයට පත් කරයි." : "Real student outcomes and experiences — approved and published by the teacher."}</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3 sm:max-w-2xl">
            {[
              { icon: Users, value: `${teacher.studentsTaught.toLocaleString()}+`, label: t("site.results.studentsTaught") },
              { icon: GraduationCap, value: `${teacher.experienceYears}+`, label: t("site.results.years") },
              { icon: Star, value: `${results.length}`, label: siteLang === "si" ? "ප්‍රදර්ශිත ප්‍රතිඵල" : "Results on the wall" },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                  <Icon className="h-5 w-5 text-amber-300" />
                  <p className="mt-2 font-display text-2xl font-bold">{s.value}</p>
                  <p className="text-xs text-white/60">{s.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{t("site.results.wall")}</p>
            <h2 className="mt-2 font-display text-3xl font-bold text-foreground">{siteLang === "si" ? "ප්‍රතිඵල පුවරුව" : "Results wall"}</h2>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {results.map((r, i) => (
            <div key={r.id} className={`relative overflow-hidden rounded-3xl border p-5 shadow-sm ${i % 3 === 0 ? "border-amber-200 bg-gradient-to-br from-amber-50 to-white" : "border-border bg-surface"}`}>
              <Star className={`h-5 w-5 ${i % 3 === 0 ? "text-amber-500" : "text-primary"}`} />
              <p className="mt-3 font-display text-xl font-bold text-foreground">{r.studentName}</p>
              <p className="mt-1 text-sm text-muted-foreground">{pick(r.achievement, siteLang)}</p>
              <p className="mt-3 inline-flex rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">{r.year}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{t("site.results.testimonials")}</p>
          <h2 className="mt-2 font-display text-3xl font-bold text-foreground">{siteLang === "si" ? "සිසුන් පවසන දේ" : "What students say"}</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {testimonials.map((tm) => (
            <div key={tm.id} className="relative overflow-hidden rounded-3xl border border-border bg-surface p-6 sm:p-7 shadow-sm">
              <Quote className="absolute right-6 top-6 h-10 w-10 text-primary/10" />
              <p className="relative pr-8 text-base leading-relaxed text-foreground sm:text-lg">{pick(tm.quote, siteLang)}</p>
              <div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-sm">
                <span className="font-semibold">{tm.studentName}</span>
                {tm.video ? <span className="inline-flex items-center gap-1.5 rounded-full bg-danger/10 px-2.5 py-1 text-xs font-medium text-danger"><PlayCircle className="h-3.5 w-3.5" /> Video</span> : <span className="text-xs text-muted-foreground">{siteLang === "si" ? "ලිඛිත සාක්ෂිය" : "Written"}</span>}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex items-start gap-3 rounded-2xl border border-primary/15 bg-primary/5 p-4 text-sm text-muted-foreground">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <p>{siteLang === "si" ? "සෑම ප්‍රතිඵලයක්ම සහ සාක්ෂියක්ම ප්‍රදර්ශනයට පෙර ගුරුවරයා විසින් අනුමත කරනු ලබන අතර, සිසුවාගේ ලිඛිත අවසරය රඳවා ගනී." : "Every result and testimonial is approved by the teacher before it is shown, with the student's written permission held on record."}</p>
        </div>
      </section>
      <div className="h-20 lg:hidden" />
    </div>
  );
}
