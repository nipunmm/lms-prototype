"use client";

import { useState } from "react";
import Link from "next/link";
import { useAppStore } from "@/lib/store";
import { useT, pick } from "@/lib/i18n";
import { money } from "@/lib/format";
import type { ClassRecord } from "@/lib/types";
import { PageHeader } from "@/components/shared/page";
import { Card, CardContent } from "@/components/ui/card";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Textarea } from "@/components/ui/input";
import { Tabs } from "@/components/ui/tabs";
import { toast } from "@/components/shared/toast";
import { CalendarDays, Languages, Layers, CheckCircle2, Lock } from "lucide-react";

export default function LmsClassesPage() {
  const db = useAppStore((s) => s.db);
  const lmsLang = useAppStore((s) => s.lmsLang);
  const studentId = useAppStore((s) => s.currentStudentId);
  const requestJoin = useAppStore((s) => s.requestJoin);
  const t = useT(lmsLang);

  const [type, setType] = useState("all");
  const [active, setActive] = useState<ClassRecord | null>(null);
  const [message, setMessage] = useState("");

  const myClassIds = db.enrolments.filter((e) => e.studentId === studentId && e.status === "active").map((e) => e.classId);
  const myRequests = db.requests.filter((r) => r.studentId === studentId);
  const includedIds = db.classes
    .filter((c) => c.includedWithTheory && c.theoryParentId && myClassIds.includes(c.theoryParentId))
    .map((c) => c.id);

  const list = db.classes.filter((c) => c.active && (type === "all" || c.type === type));

  const send = () => {
    if (!active) return;
    requestJoin(active.id, message);
    setActive(null);
    setMessage("");
    toast(t("lms.classes.requestSent"));
  };

  return (
    <div>
      <PageHeader title={t("lms.classes.title")} description={lmsLang === "si" ? "ඔබට ගැළපෙන පන්තියක් සොයාගෙන ඉල්ලන්න." : "Find the right class and request to join."} />

      <Tabs
        className="mb-6"
        value={type}
        onChange={setType}
        tabs={[
          { value: "all", label: lmsLang === "si" ? "සියල්ල" : "All" },
          { value: "Theory", label: lmsLang === "si" ? "න්‍යාය" : "Theory" },
          { value: "Revision", label: lmsLang === "si" ? "පුනරීක්ෂණ" : "Revision" },
          { value: "Paper", label: lmsLang === "si" ? "ප්‍රශ්න පත්‍ර" : "Paper" },
        ]}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {list.map((c) => {
          const enrolled = myClassIds.includes(c.id);
          const req = myRequests.find((r) => r.classId === c.id && r.status === "pending");
          const included = includedIds.includes(c.id);
          return (
            <Card key={c.id} className="flex flex-col">
              <CardContent className="flex flex-1 flex-col pt-5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold">{c.type}</h3>
                    <p className="text-sm text-muted-foreground">{c.batch}</p>
                  </div>
                  <StatusBadge status={c.status} />
                </div>
                <p className="mt-3 flex-1 text-sm text-muted-foreground">{pick(c.description, lmsLang)}</p>
                <div className="mt-3 grid gap-1.5 text-sm text-muted-foreground">
                  <span className="flex items-center gap-2"><Languages className="h-4 w-4" /> {c.medium}</span>
                  <span className="flex items-center gap-2"><Layers className="h-4 w-4" /> {c.subject}</span>
                  <span className="flex items-center gap-2"><CalendarDays className="h-4 w-4" /> {c.timetable.map((s) => `${s.day} ${s.start}–${s.end}`).join(", ")}</span>
                </div>
                {included ? (
                  <p className="mt-3 flex items-center gap-2 text-sm text-success">
                    <CheckCircle2 className="h-4 w-4" /> {t("lms.classes.included")}
                  </p>
                ) : null}
                <div className="mt-4 flex items-end justify-between border-t border-border pt-4">
                  <div>
                    <p className="text-xs text-muted-foreground">{t("lms.classes.fee")}</p>
                    <p className="text-lg font-bold">{money(c.monthlyFee, lmsLang)}</p>
                  </div>
                  {enrolled ? (
                    <Badge tone="success">{lmsLang === "si" ? "ඔබ සිටී" : "Enrolled"}</Badge>
                  ) : req ? (
                    <Badge tone="warning">{t("state.pending")}</Badge>
                  ) : c.status === "closed" ? (
                    <Badge tone="muted"><Lock className="h-3 w-3" /> {t("state.closed")}</Badge>
                  ) : (
                    <Button size="sm" onClick={() => setActive(c)}>{t("common.requestJoin")}</Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Modal
        open={!!active}
        onClose={() => setActive(null)}
        title={active ? `${t("common.requestJoin")} — ${active.type}` : ""}
        description={active ? `${active.batch} · ${money(active.monthlyFee, lmsLang)}${t("site.classes.month")}` : ""}
        footer={
          <>
            <Button variant="ghost" onClick={() => setActive(null)}>{t("common.cancel")}</Button>
            <Button onClick={send}>{t("common.submit")}</Button>
          </>
        }
      >
        <label className="text-sm font-medium">{lmsLang === "si" ? "කෙටි පණිවිඩයක්" : "A short message"}</label>
        <Textarea
          className="mt-1.5"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={lmsLang === "si" ? "මම මෙම පන්තියට එක් වීමට කැමතියි..." : "I would like to join this class because..."}
        />
        <p className="mt-2 text-xs text-muted-foreground">
          {lmsLang === "si" ? "කාර්ය මණ්ඩලය ඔබේ ඉල්ලීම සමාලෝචනය කරයි." : "Staff will review your request."}
        </p>
      </Modal>

      <p className="mt-8 text-sm text-muted-foreground">
        {lmsLang === "si" ? "ඔබේ ඉල්ලීම් තත්ත්වය " : "See your request status in "}
        <Link href="/lms/my-classes" className="text-primary hover:underline">{t("lms.nav.myClasses")}</Link>.
      </p>
    </div>
  );
}
