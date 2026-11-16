"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { useT } from "@/lib/i18n";
import { PageHeader } from "@/components/shared/page";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/shared/toast";
import { Gift, Copy, Share2, Users, Coins } from "lucide-react";

export default function ReferralPage() {
  const db = useAppStore((s) => s.db);
  const lmsLang = useAppStore((s) => s.lmsLang);
  const studentId = useAppStore((s) => s.currentStudentId);
  const t = useT(lmsLang);
  const student = db.students.find((s) => s.id === studentId)!;

  const code = `SANJ-${student.nickname.toUpperCase().slice(0, 5)}`;
  const link = `https://sanjeewa-maths.lk/join?ref=${code}`;
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      toast(lmsLang === "si" ? "සබැඳිය පිටපත් විය!" : "Link copied!");
    } catch {
      toast(lmsLang === "si" ? "පිටපත් කළ නොහැක — අතින් තෝරන්න." : "Could not copy — select manually.", "info");
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title={t("lms.nav.referral")} description={lmsLang === "si" ? "මිතුරෙකු එක් කර ලකුණු උපයන්න." : "Invite a friend and earn points."} />

      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="pt-6 text-center">
          <Gift className="mx-auto h-10 w-10 text-primary" />
          <p className="mt-3 text-lg font-semibold">{lmsLang === "si" ? "මිතුරෙකු යොමු කරන්න" : "Refer a friend"}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {lmsLang === "si"
              ? "මිතුරෙකු ලියාපදිංචි වූ විට ඔබට ලකුණු 200 ක් ලැබේ. ඔවුන්ට පළමු මාසයට වට්ටමක්."
              : "When a friend registers, you get 200 points. They get a first-month discount."}
          </p>

          <div className="mt-5 flex flex-col items-center gap-3">
            <div className="flex w-full max-w-md items-center gap-2">
              <Input value={link} readOnly className="text-center text-sm" />
              <Button onClick={copy} size="icon" aria-label="Copy"><Copy className="h-4 w-4" /></Button>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              <Badge tone="default">{lmsLang === "si" ? "කේතය" : "Code"}: {code}</Badge>
              <Button size="sm" variant="outline" onClick={() => toast(lmsLang === "si" ? "WhatsApp හරහා බෙදාගැනීම (නිදර්ශනය)." : "Share via WhatsApp (demo).", "info")}>
                <Share2 className="h-4 w-4" /> WhatsApp
              </Button>
            </div>
            {copied ? <p className="text-xs text-success">{lmsLang === "si" ? "පිටපත් විය" : "Copied"}</p> : null}
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-5 text-center">
            <Users className="mx-auto h-6 w-6 text-primary" />
            <p className="mt-2 text-2xl font-bold">3</p>
            <p className="text-sm text-muted-foreground">{lmsLang === "si" ? "යොමු කළ මිතුරන්" : "Friends referred"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 text-center">
            <Coins className="mx-auto h-6 w-6 text-warning" />
            <p className="mt-2 text-2xl font-bold">600</p>
            <p className="text-sm text-muted-foreground">{lmsLang === "si" ? "ලබාගත් ලකුණු" : "Points earned"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 text-center">
            <Gift className="mx-auto h-6 w-6 text-success" />
            <p className="mt-2 text-2xl font-bold">1</p>
            <p className="text-sm text-muted-foreground">{lmsLang === "si" ? "මාසයක වට්ටම්" : "Month discounts"}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
