"use client";

import { useAppStore } from "@/lib/store";
import { useT, pick } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Users, GraduationCap, ArrowRight, ShieldCheck, BookOpen, Globe } from "lucide-react";

export default function SiteAboutPage() {
  const router = useRouter();
  const db = useAppStore((s) => s.db);
  const siteLang = useAppStore((s) => s.siteLang);
  const setLmsLang = useAppStore((s) => s.setLmsLang);
  const t = useT(siteLang);
  const teacher = db.teacher;
  const si = siteLang === "si";

  return (
    <div className="bg-background">
      <section className="relative overflow-hidden border-b border-border bg-[#07111f] text-white">
        <div className="absolute inset-0 opacity-30" style={{ background: "radial-gradient(circle at 70% 20%, rgba(20,184,166,.35), transparent 35%), radial-gradient(circle at 10% 80%, rgba(245,158,11,.25), transparent 30%)" }} />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:py-18 lg:grid-cols-[320px_1fr]">
          <div>
            <div
              className="flex h-72 w-full items-center justify-center rounded-[2rem] border border-white/10 text-7xl font-display font-bold text-white shadow-2xl"
              style={{ background: `linear-gradient(140deg, hsl(${teacher.avatarHue} 60% 42%), hsl(${(teacher.avatarHue + 50) % 360} 65% 28%))` }}
            >
              {teacher.name.split(" ").slice(-1)[0][0]}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-300">{t("site.about.title")}</p>
            <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">{teacher.name}</h1>
            <p className="mt-2 text-lg text-white/80">{pick(teacher.subject, siteLang)}</p>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/70">{pick(teacher.headline, siteLang)}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              {[
                { icon: Users, value: `${teacher.studentsTaught.toLocaleString()}+`, label: t("site.results.studentsTaught") },
                { icon: GraduationCap, value: `${teacher.experienceYears}+`, label: t("site.results.years") },
              ].map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.label} className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur">
                    <Icon className="h-5 w-5 text-amber-300" />
                    <div>
                      <p className="font-display text-xl font-bold leading-none">{s.value}</p>
                      <p className="text-xs text-white/60">{s.label}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_.9fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{si ? "ගුරුතුමාගේ කතාව" : "The story"}</p>
            <h2 className="mt-2 font-display text-3xl font-bold text-foreground">{pick(teacher.headline, siteLang)}</h2>
            <p className="mt-5 whitespace-pre-line text-base leading-relaxed text-muted-foreground">{pick(teacher.story, siteLang)}</p>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                { icon: BookOpen, title: si ? "පැහැදිලි ඉගැන්වීම" : "Clear teaching", desc: si ? "සංකල්ප සරලව සහ ප්‍රායෝගිකව." : "Concepts made simple and practical." },
                { icon: ShieldCheck, title: si ? "විශ්වාසනීයත්වය" : "Trust", desc: si ? "අනුමත ප්‍රතිඵල සහ සාක්ෂි." : "Approved results and proof." },
                { icon: Globe, title: si ? "සජීවී + LMS" : "Live + LMS", desc: si ? "Zoom සහ LMS එකම පද්ධතියක." : "Zoom and LMS in one system." },
              ].map((x) => {
                const Icon = x.icon;
                return (
                  <div key={x.title} className="rounded-2xl border border-border bg-surface p-4">
                    <Icon className="h-5 w-5 text-primary" />
                    <p className="mt-2 font-semibold text-sm">{x.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{x.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="lg:pt-8">
            <div className="rounded-3xl border border-border bg-gradient-to-br from-surface to-primary/5 p-6 shadow-sm">
              <p className="font-display text-xl font-semibold">{si ? "සම්බන්ධ වන්න" : "Get in touch"}</p>
              <div className="mt-4 grid gap-3 text-sm">
                <div className="rounded-xl bg-muted/60 px-4 py-3"><span className="text-muted-foreground">Phone:</span> <span className="font-medium text-foreground">{teacher.phone}</span></div>
                <div className="rounded-xl bg-muted/60 px-4 py-3"><span className="text-muted-foreground">Email:</span> <span className="font-medium text-foreground">{teacher.email}</span></div>
                <div className="rounded-xl bg-muted/60 px-4 py-3"><span className="text-muted-foreground">WhatsApp:</span> <span className="font-medium text-foreground">{teacher.whatsapp}</span></div>
                <div className="rounded-xl bg-muted/60 px-4 py-3"><span className="text-muted-foreground">Facebook:</span> <span className="font-medium text-foreground">{teacher.facebook}</span></div>
                <div className="rounded-xl bg-muted/60 px-4 py-3"><span className="text-muted-foreground">YouTube:</span> <span className="font-medium text-foreground">{teacher.youtube}</span></div>
              </div>
              <Button
                className="mt-5 w-full gap-2"
                onClick={() => {
                  setLmsLang(siteLang);
                  router.push("/lms/home");
                }}
              >
                {t("common.joinFree")} <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>
      <div className="h-20 lg:hidden" />
    </div>
  );
}
