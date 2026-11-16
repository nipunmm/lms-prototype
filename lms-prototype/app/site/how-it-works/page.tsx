"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { useT, pick } from "@/lib/i18n";
import { Video, FileText, Package, ClipboardCheck, Landmark, Smartphone, ChevronDown, UserPlus, Search, ShieldCheck, Rocket } from "lucide-react";

export default function SiteHowPage() {
  const db = useAppStore((s) => s.db);
  const siteLang = useAppStore((s) => s.siteLang);
  const t = useT(siteLang);
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const si = siteLang === "si";

  const steps = [
    { icon: Video, title: si ? "Zoom මඟින් සජීවී පන්ති" : "Live on Zoom", desc: si ? "නිවසේ සිටම සජීවීව සහභාගී වන්න; එක ටැප් එකකින් එකතු වන්න." : "Attend live classes from home and join with one tap." },
    { icon: FileText, title: si ? "පටිගත කිරීම් සහ සටහන්" : "Recordings & notes", desc: si ? "පන්තියක් මගහැරුනොත් පටිගත කිරීම නැරඹීමට සහ සටහන් කියවීමට හැක." : "Missed a class? Watch the recording and read the notes anytime." },
    { icon: Package, title: si ? "ටියුට් තැපෑලෙන්" : "Tutes by post", desc: si ? "සෑම මාසයකම මුද්‍රිත ටියුට් එකක් තැපෑලෙන් ලැබේ (ගාස්තුවට ඇතුළත්)." : "A printed tute is posted every month, included in the fee." },
    { icon: ClipboardCheck, title: si ? "විභාග සහ ප්‍රතිපෝෂණ" : "Exams & feedback", desc: si ? "කාලගත විභාග, ලකුණු, පන්ති ශ්‍රේණිය සහ ගුරු අදහස් ලබාගන්න." : "Timed exams with marks, class ranking and teacher feedback." },
  ];

  const joinSteps = [
    { icon: UserPlus, title: si ? "නොමිලේ ගිණුමක් සාදන්න" : "Create a free account", desc: si ? "Google හෝ ජංගම දුරකථන අංකයෙන් ලියාපදිංචි වන්න." : "Register with Google or your mobile number." },
    { icon: Search, title: si ? "පන්තියක් තෝරා ඉල්ලන්න" : "Choose & request a class", desc: si ? "ඔබට ගැලපෙන පන්තිය තෝරා එකතු වීමට ඉල්ලීමක් යවන්න." : "Pick the right class and send a join request." },
    { icon: ShieldCheck, title: si ? "අනුමැතිය ලබාගන්න" : "Get approved", desc: si ? "කාර්ය මණ්ඩලය ඔබගේ ඉල්ලීම සමාලෝචනය කර අනුමත කරයි." : "Staff review and approve your request." },
    { icon: Rocket, title: si ? "ගෙවා ආරම්භ කරන්න" : "Pay & start learning", desc: si ? "මාසික ගාස්තුව ගෙවා ඉගෙනීම ආරම්භ කරන්න." : "Pay for the month and start learning." },
  ];

  return (
    <div className="bg-background">
      <section className="relative overflow-hidden border-b border-border bg-[#07111f] text-white">
        <div className="absolute inset-0 opacity-30" style={{ background: "radial-gradient(circle at 15% 30%, rgba(20,184,166,.35), transparent 35%), radial-gradient(circle at 85% 10%, rgba(245,158,11,.25), transparent 30%)" }} />
        <div className="relative mx-auto max-w-6xl px-4 py-14 sm:py-18">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-300">{si ? "ක්‍රියා කරන ආකාරය" : "How it works"}</p>
          <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">{t("site.how.title")}</h1>
          <p className="mt-3 max-w-2xl text-white/70">{si ? "Zoom පන්ති, පටිගත කිරීම්, ටියුට්, විභාග සහ ගෙවීම් — පැහැදිලිව සහ සරලව." : "Zoom classes, recordings, tutes, exams and payments — clear and simple."}</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <h2 className="font-display text-2xl font-bold sm:text-3xl">{si ? "ඔබට ලැබෙන දේ" : "What you get"}</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.title} className="rounded-3xl border border-border bg-surface p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary"><Icon className="h-5 w-5" /></div>
                <p className="mt-4 font-semibold text-foreground">{s.title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="border-y border-border bg-muted/40">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">{t("site.how.join.title")}</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {joinSteps.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={s.title} className="relative rounded-3xl border border-border bg-surface p-5">
                  <span className="absolute right-4 top-4 font-display text-3xl font-bold text-primary/10">0{i + 1}</span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-foreground text-background"><Icon className="h-4.5 w-4.5" /></div>
                  <p className="mt-4 font-semibold">{s.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <h2 className="font-display text-2xl font-bold sm:text-3xl">{si ? "ගෙවීමේ ක්‍රම" : "Payment methods"}</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="flex items-start gap-4 rounded-3xl border border-border bg-surface p-5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary"><Landmark className="h-5 w-5" /></div>
            <div>
              <p className="font-semibold">{si ? "බැංකු තැන්පතු" : "Bank deposit"}</p>
              <p className="mt-1 text-sm text-muted-foreground">{si ? "රිසිට් පත උඩුගත කරන්න; කාර්ය මණ්ඩලය සමාලෝචනය කර අනුමත කරයි." : "Upload your payment slip; staff review and approve it."}</p>
              <p className="mt-2 inline-flex rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">LKR</p>
            </div>
          </div>
          <div className="flex items-start gap-4 rounded-3xl border border-border bg-surface p-5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary"><Smartphone className="h-5 w-5" /></div>
            <div>
              <p className="font-semibold">{si ? "මාර්ගගත ගෙවීම" : "Online payment"}</p>
              <p className="mt-1 text-sm text-muted-foreground">{si ? "කාඩ් හෝ මාර්ගගත බැංකු ගෙවීම්, LKR වලින්, ක්ෂණිකව තහවුරු වේ." : "Card or online banking in LKR, confirmed instantly."}</p>
              <p className="mt-2 inline-flex rounded-full bg-success/10 px-2.5 py-1 text-xs font-medium text-success">{si ? "ක්ෂණික" : "Instant"}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-muted/30">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
          <h2 className="font-display text-2xl font-bold sm:text-3xl text-center">{t("site.how.faq")}</h2>
          <div className="mt-8 divide-y divide-border rounded-3xl border border-border bg-surface shadow-sm">
            {db.faqs.map((f) => (
              <div key={f.id}>
                <button
                  onClick={() => setOpenFaq(openFaq === f.id ? null : f.id)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="font-medium text-foreground">{pick(f.question, siteLang)}</span>
                  <ChevronDown className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${openFaq === f.id ? "rotate-180" : ""}`} />
                </button>
                {openFaq === f.id ? (
                  <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">{pick(f.answer, siteLang)}</p>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>
      <div className="h-20 lg:hidden" />
    </div>
  );
}
