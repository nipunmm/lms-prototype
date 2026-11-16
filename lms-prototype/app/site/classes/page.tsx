"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { useT } from "@/lib/i18n";
import { SiteClassCard } from "@/components/site/class-card";
import { cn } from "@/lib/utils";
import { Layers, Filter, Sparkles } from "lucide-react";

export default function SiteClassesPage() {
  const db = useAppStore((s) => s.db);
  const siteLang = useAppStore((s) => s.siteLang);
  const t = useT(siteLang);
  const [type, setType] = useState("all");
  const [medium, setMedium] = useState("all");

  const list = db.classes.filter(
    (c) =>
      c.active &&
      c.shownOnWebsite &&
      (type === "all" || c.type === type) &&
      (medium === "all" || c.medium === medium),
  );

  const typeTabs = [
    { value: "all", label: siteLang === "si" ? "සියල්ල" : "All" },
    { value: "Theory", label: siteLang === "si" ? "සිද්ධාන්ත" : "Theory" },
    { value: "Revision", label: siteLang === "si" ? "පුනරීක්ෂණ" : "Revision" },
    { value: "Paper", label: siteLang === "si" ? "ප්‍රශ්න පත්‍ර" : "Paper" },
  ];
  const mediumTabs = [
    { value: "all", label: siteLang === "si" ? "සියලු මාධ්‍ය" : "All mediums" },
    { value: "Sinhala", label: "Sinhala" },
    { value: "English", label: "English" },
  ];

  return (
    <div className="bg-background">
      <section className="relative overflow-hidden border-b border-border bg-[#07111f] text-white">
        <div className="absolute inset-0 opacity-30" style={{ background: "radial-gradient(circle at 15% 20%, rgba(20,184,166,.4), transparent 35%), radial-gradient(circle at 85% 0%, rgba(245,158,11,.25), transparent 30%)" }} />
        <div className="relative mx-auto max-w-6xl px-4 py-14 sm:py-18">
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-teal-300"><Sparkles className="h-3.5 w-3.5" /> {siteLang === "si" ? "පන්ති සහ ගාස්තු" : "Classes & fees"}</p>
          <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">{t("site.classes.title")}</h1>
          <p className="mt-3 max-w-2xl text-white/70">{t("site.classes.subtitle")}</p>
          <div className="mt-6 flex flex-wrap gap-2 text-xs text-white/70">
            <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5">{siteLang === "si" ? "සජීවී Zoom පන්ති" : "Live on Zoom"}</span>
            <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5">{siteLang === "si" ? "මාසික ගාස්තු පැහැදිලියි" : "Clear monthly fees"}</span>
            <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5">{siteLang === "si" ? "විවෘත / පිරී / වසා තත්ත්වය" : "Open / Full / Closed status"}</span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
        <div className="mb-8 flex flex-col gap-4 rounded-3xl border border-border bg-surface p-4 sm:p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground"><Filter className="h-4 w-4 text-primary" /> {siteLang === "si" ? "පෙරහන්" : "Filters"}</div>
          <div className="flex flex-wrap gap-3">
            <div className="flex flex-wrap gap-1.5">
              {typeTabs.map((tab) => (
                <button key={tab.value} onClick={() => setType(tab.value)} className={cn("rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors", type === tab.value ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted text-muted-foreground hover:text-foreground")}>
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {mediumTabs.map((tab) => (
                <button key={tab.value} onClick={() => setMedium(tab.value)} className={cn("rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors", medium === tab.value ? "bg-foreground text-background shadow-sm" : "bg-muted text-muted-foreground hover:text-foreground")}>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {list.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-muted/30 px-6 py-16 text-center">
            <Layers className="h-8 w-8 text-muted-foreground" />
            <p className="mt-3 font-semibold text-foreground">{siteLang === "si" ? "ගැලපෙන පන්ති නැත" : "No classes match your filter"}</p>
            <p className="mt-1 text-sm text-muted-foreground">{siteLang === "si" ? "වෙනත් පෙරහනක් උත්සාහ කරන්න." : "Try a different filter."}</p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {list.map((c) => (
              <SiteClassCard key={c.id} cls={c} featured={c.type === "Theory"} />
            ))}
          </div>
        )}

        <div className="mt-10 grid gap-4 rounded-3xl border border-primary/15 bg-gradient-to-br from-primary/5 to-amber-50/40 p-6 sm:grid-cols-3">
          <div>
            <p className="font-semibold text-foreground">{siteLang === "si" ? "පන්ති ව්‍යුහය" : "How classes are structured"}</p>
            <p className="mt-1 text-sm text-muted-foreground">{siteLang === "si" ? "සිද්ධාන්ත, පුනරීක්ෂණ සහ ප්‍රශ්න පත්‍ර පන්ති — ඔබට අවශ්‍ය ඒවා තෝරන්න." : "Theory, Revision and Paper classes — choose what you need."}</p>
          </div>
          <div>
            <p className="font-semibold text-foreground">{siteLang === "si" ? "එකවර කිහිපයක්" : "Join more than one"}</p>
            <p className="mt-1 text-sm text-muted-foreground">{siteLang === "si" ? "සිසුවෙකුට එකවර පන්ති කිහිපයකට ඉල්ලිය හැක (උදා: සිද්ධාන්ත + පුනරීක්ෂණ)." : "A student can request several classes at once (e.g. Theory and Revision)."}</p>
          </div>
          <div>
            <p className="font-semibold text-foreground">{siteLang === "si" ? "ඇතුළත් ගාස්තු" : "Included access"}</p>
            <p className="mt-1 text-sm text-muted-foreground">{siteLang === "si" ? "සමහර පුනරීක්ෂණ/ප්‍රශ්න පත්‍ර පන්ති ක්‍රියාකාරී සිද්ධාන්ත සිසුන්ට නොමිලේ ඇතුළත් විය හැක." : "Some Revision/Paper classes may be included free for active Theory students."}</p>
          </div>
        </div>
      </section>
      <div className="h-20 lg:hidden" />
    </div>
  );
}
