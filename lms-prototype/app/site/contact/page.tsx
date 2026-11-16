"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { useT } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Field } from "@/components/ui/input";
import { toast } from "@/components/shared/toast";
import { MessageCircle, CheckCircle2, Phone, Mail, Clock, ArrowRight } from "lucide-react";

export default function SiteContactPage() {
  const db = useAppStore((s) => s.db);
  const siteLang = useAppStore((s) => s.siteLang);
  const addCallback = useAppStore((s) => s.addCallback);
  const t = useT(siteLang);
  const teacher = db.teacher;
  const si = siteLang === "si";

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [interest, setInterest] = useState("");
  const [note, setNote] = useState("");
  const [sent, setSent] = useState(false);

  const submit = () => {
    if (!name.trim() || !phone.trim()) return;
    addCallback({ name, phone, interest, note });
    setSent(true);
    toast(si ? "ඉල්ලීම යවන ලදී (ආදර්ශන)." : "Request sent (demo).");
  };

  return (
    <div className="bg-background">
      <section className="relative overflow-hidden border-b border-border bg-[#07111f] text-white">
        <div className="absolute inset-0 opacity-30" style={{ background: "radial-gradient(circle at 20% 20%, rgba(20,184,166,.35), transparent 35%), radial-gradient(circle at 85% 80%, rgba(245,158,11,.25), transparent 30%)" }} />
        <div className="relative mx-auto max-w-6xl px-4 py-14 sm:py-18">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-300">{si ? "සම්බන්ධ වන්න" : "Get in touch"}</p>
          <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">{t("site.contact.title")}</h1>
          <p className="mt-3 max-w-2xl text-white/70">{si ? "WhatsApp, ඇමතුමක් හෝ call-back ඉල්ලීමක් — ඔබට පහසු ක්‍රමයෙන් අප හා සම්බන්ධ වන්න." : "WhatsApp, a call, or a call-back request — reach us in the way that suits you."}</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <div className="grid gap-8 lg:grid-cols-[.95fr_1.05fr]">
          <div className="grid gap-4 content-start">
            <div className="rounded-3xl border border-border bg-surface p-5 shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-success/10 text-success"><MessageCircle className="h-5 w-5" /></div>
              <p className="mt-4 font-semibold text-lg">WhatsApp</p>
              <p className="mt-1 text-sm text-muted-foreground">{teacher.whatsapp}</p>
              <p className="mt-2 text-sm text-muted-foreground">{si ? "පන්ති, ගාස්තු සහ එකතු වීම ගැන ඉක්මනින් විමසන්න." : "Ask quickly about classes, fees and joining."}</p>
              <Button
                className="mt-4 bg-success hover:bg-success/90"
                onClick={() => toast(si ? "WhatsApp විවෘත වේ (ආදර්ශන)." : "WhatsApp would open (demo).", "info")}
              >
                {t("common.whatsapp")} <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-3xl border border-border bg-surface p-5 shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><Phone className="h-5 w-5" /></div>
                <p className="mt-3 font-semibold">{si ? "දුරකථන" : "Phone"}</p>
                <p className="text-sm text-muted-foreground mt-0.5">{teacher.phone}</p>
              </div>
              <div className="rounded-3xl border border-border bg-surface p-5 shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><Mail className="h-5 w-5" /></div>
                <p className="mt-3 font-semibold">{si ? "විද්‍යුත් තැපෑල" : "Email"}</p>
                <p className="text-sm text-muted-foreground mt-0.5">{teacher.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              <Clock className="mt-0.5 h-4 w-4 shrink-0" />
              <p>{si ? "ඉල්ලීමක් යැවූ පසු කාර්ය මණ්ඩලය ඔබව නැවත සම්බන්ධ කරගනී (ආදර්ශන UI)." : "After you send a request, staff will call you back (demo UI flow)."}</p>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-surface p-6 sm:p-7 shadow-sm">
            {sent ? (
              <div className="flex flex-col items-center py-10 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-success/10 text-success"><CheckCircle2 className="h-7 w-7" /></div>
                <p className="mt-4 font-display text-2xl font-semibold">{t("site.contact.sent")}</p>
                <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                  {si ? "මෙම ඉල්ලීම Staff Portal inbox එකට එක් වේ (ආදර්ශන). කාර්ය මණ්ඩලය ඔබව සම්බන්ධ කරගනී." : "This request now appears in the Staff Portal inbox (demo). Staff will get back to you."}
                </p>
                <Button className="mt-6" variant="outline" onClick={() => setSent(false)}>
                  {si ? "තවත් ඉල්ලීමක් යවන්න" : "Send another"}
                </Button>
              </div>
            ) : (
              <>
                <h2 className="font-display text-2xl font-semibold">{t("site.contact.callback")}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{si ? "ඔබේ විස්තර ඇතුළත් කරන්න — අපි ඔබව අමතන්නෙමු." : "Leave your details and we’ll call you back."}</p>
                <div className="mt-6 grid gap-4">
                  <Field label={t("site.contact.name")}>
                    <Input value={name} onChange={(e) => setName(e.target.value)} placeholder={si ? "නම" : "Your name"} />
                  </Field>
                  <Field label={t("site.contact.phone")}>
                    <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+94 7X XXX XXXX" />
                  </Field>
                  <Field label={t("site.contact.interest")}>
                    <Input value={interest} onChange={(e) => setInterest(e.target.value)} placeholder={si ? "උදා: සිද්ධාන්ත පන්තිය" : "e.g. Theory class"} />
                  </Field>
                  <Field label={si ? "සටහන (විකල්ප)" : "Note (optional)"}>
                    <Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder={si ? "ඔබට දැනගැනීමට අවශ්‍ය දේ..." : "Anything we should know..."} />
                  </Field>
                  <Button onClick={submit} disabled={!name.trim() || !phone.trim()} className="h-11">
                    {t("common.submit")}
                  </Button>
                  <p className="text-xs text-muted-foreground">{t("common.demoOnly")}</p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
      <div className="h-20 lg:hidden" />
    </div>
  );
}
