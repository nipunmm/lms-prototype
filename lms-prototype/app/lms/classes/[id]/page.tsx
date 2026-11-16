"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { useT, pick } from "@/lib/i18n";
import { money } from "@/lib/format";
import { PageHeader } from "@/components/shared/page";
import { Card, CardContent } from "@/components/ui/card";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { toast } from "@/components/shared/toast";
import { ArrowLeft, CalendarDays, Languages, Layers, CheckCircle2, Users } from "lucide-react";

export default function LmsClassDetailPage() {
  const params = useParams<{ id: string }>();
  const db = useAppStore((s) => s.db);
  const lmsLang = useAppStore((s) => s.lmsLang);
  const studentId = useAppStore((s) => s.currentStudentId);
  const requestJoin = useAppStore((s) => s.requestJoin);
  const t = useT(lmsLang);
  const cls = db.classes.find((c) => c.id === params.id);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  if (!cls) {
    return (
      <div>
        <PageHeader title="Class not found" />
        <Link href="/lms/classes"><Button variant="outline"><ArrowLeft className="h-4 w-4" /> {t("common.back")}</Button></Link>
      </div>
    );
  }

  const enrolled = db.enrolments.some((e) => e.studentId === studentId && e.classId === cls.id && e.status === "active");
  const pending = db.requests.some((r) => r.studentId === studentId && r.classId === cls.id && r.status === "pending");
  const parent = cls.theoryParentId ? db.classes.find((x) => x.id === cls.theoryParentId) : null;

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/lms/classes" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> {t("lms.classes.title")}
      </Link>
      <PageHeader
        title={`${cls.type} — ${cls.subject}`}
        description={cls.batch}
        actions={<StatusBadge status={cls.status} />}
      />

      <Card>
        <CardContent className="pt-5">
          <p className="text-muted-foreground">{pick(cls.description, lmsLang)}</p>
          <div className="mt-4 grid gap-2 text-sm">
            <span className="flex items-center gap-2 text-muted-foreground"><Layers className="h-4 w-4" /> {cls.type} · {cls.subject}</span>
            <span className="flex items-center gap-2 text-muted-foreground"><Languages className="h-4 w-4" /> {t("lms.classes.medium")}: {cls.medium}</span>
            <span className="flex items-center gap-2 text-muted-foreground"><CalendarDays className="h-4 w-4" /> {cls.timetable.map((s) => `${s.day} ${s.start}–${s.end}`).join(", ")}</span>
            <span className="flex items-center gap-2 text-muted-foreground"><Users className="h-4 w-4" /> {cls.enrolled}/{cls.capacity} {lmsLang === "si" ? "සිසුන්" : "students"}</span>
          </div>

          <div className="mt-5 flex items-end justify-between border-t border-border pt-4">
            <div>
              <p className="text-xs text-muted-foreground">{t("lms.classes.fee")}</p>
              <p className="text-2xl font-bold">{money(cls.monthlyFee, lmsLang)}</p>
            </div>
            {enrolled ? (
              <Badge tone="success"><CheckCircle2 className="h-3 w-3" /> {lmsLang === "si" ? "ඔබ සිටී" : "Enrolled"}</Badge>
            ) : pending ? (
              <Badge tone="warning">{t("state.pending")}</Badge>
            ) : cls.status === "closed" ? (
              <Badge tone="muted">{t("state.closed")}</Badge>
            ) : (
              <Button onClick={() => setOpen(true)}>{t("common.requestJoin")}</Button>
            )}
          </div>

          {cls.includedWithTheory && parent ? (
            <p className="mt-4 flex items-center gap-2 text-sm text-success">
              <CheckCircle2 className="h-4 w-4" />
              {lmsLang === "si" ? `ඔබේ ${parent.type} පන්තිය සමඟ නොමිලේ ඇතුළත්` : `Included free with your ${parent.type} class`}
            </p>
          ) : null}
        </CardContent>
      </Card>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={t("common.requestJoin")}
        description={`${cls.type} · ${cls.batch}`}
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>{t("common.cancel")}</Button>
            <Button
              onClick={() => {
                requestJoin(cls.id, message);
                setOpen(false);
                toast(t("lms.classes.requestSent"));
              }}
            >
              {t("common.submit")}
            </Button>
          </>
        }
      >
        <Textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder={lmsLang === "si" ? "හේතුව..." : "Your reason..."} />
      </Modal>
    </div>
  );
}
