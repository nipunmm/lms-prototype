"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { useT } from "@/lib/i18n";
import { money, shortDate } from "@/lib/format";
import { PageHeader, StatTile } from "@/components/shared/page";
import { Card, CardContent } from "@/components/ui/card";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Field, Input } from "@/components/ui/input";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { toast } from "@/components/shared/toast";
import { Landmark, Smartphone, Upload, Download, AlertTriangle } from "lucide-react";

const MONTHS = ["2026-11", "2026-12"];

export default function PaymentsPage() {
  const db = useAppStore((s) => s.db);
  const lmsLang = useAppStore((s) => s.lmsLang);
  const studentId = useAppStore((s) => s.currentStudentId);
  const submitPayment = useAppStore((s) => s.submitPayment);
  const t = useT(lmsLang);

  const myPayments = db.payments.filter((p) => p.studentId === studentId);
  const enrolments = db.enrolments.filter((e) => e.studentId === studentId && e.status === "active");
  const myClasses = enrolments.map((e) => db.classes.find((c) => c.id === e.classId)!).filter(Boolean);

  const paidMonths = myPayments.filter((p) => p.status === "confirmed").flatMap((p) => p.months);
  const unpaid = MONTHS.filter((m) => !paidMonths.includes(m));

  const [open, setOpen] = useState(false);
  const [method, setMethod] = useState<"online" | "slip">("online");
  const [month, setMonth] = useState(unpaid[0] ?? MONTHS[0]);
  const [note, setNote] = useState("");

  const amount = myClasses.reduce((sum, c) => sum + c.monthlyFee, 0);

  const pay = () => {
    submitPayment({
      studentId,
      classIds: myClasses.map((c) => c.id),
      months: [month],
      amount,
      method,
      slipNote: method === "slip" ? note || "Slip uploaded (demo)" : undefined,
    });
    setOpen(false);
    setNote("");
    toast(method === "online" ? (lmsLang === "si" ? "ගෙවීම තහවුරු විය." : "Payment confirmed instantly.") : (lmsLang === "si" ? "ස්ලිප් යවන ලදී, අනුමැතිය බලාපොරොත්තුවෙන්." : "Slip submitted, awaiting staff approval."));
  };

  const totalPaid = myPayments.filter((p) => p.status === "confirmed").reduce((s, p) => s + p.amount, 0);

  return (
    <div>
      <PageHeader title={t("lms.pay.title")} description={lmsLang === "si" ? "ඔබේ ගෙවීම් සහ රිසිට්පත්." : "Your payments and receipts."} />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatTile label={lmsLang === "si" ? "ගෙවා ඇත" : "Total paid"} value={money(totalPaid, lmsLang)} tone="success" />
        <StatTile label={lmsLang === "si" ? "මාසික ගාස්තුව" : "Monthly total"} value={money(amount, lmsLang)} />
        <StatTile label={lmsLang === "si" ? "ගෙවීමට ඇති මාස" : "Unpaid months"} value={unpaid.length} tone={unpaid.length ? "warning" : "success"} />
      </div>

      <Card className="mt-6">
        <CardContent className="pt-5">
          <h2 className="font-semibold">{lmsLang === "si" ? "මාසික ගාස්තු" : "Monthly fees"}</h2>
          <div className="mt-3 grid gap-3">
            {myClasses.map((c) => (
              <div key={c.id} className="flex items-center justify-between rounded-xl border border-border p-3">
                <div>
                  <p className="text-sm font-medium">{c.type} — {c.batch}</p>
                  <p className="text-xs text-muted-foreground">{c.medium}</p>
                </div>
                <p className="text-sm font-semibold">{money(c.monthlyFee, lmsLang)}</p>
              </div>
            ))}
            {myClasses.length === 0 ? (
              <p className="text-sm text-muted-foreground">{lmsLang === "si" ? "අනුමත පන්ති නොමැත." : "No approved classes yet."}</p>
            ) : null}
          </div>
          <Button className="mt-4" disabled={myClasses.length === 0 || unpaid.length === 0} onClick={() => setOpen(true)}>
            {t("lms.pay.payNow")}
          </Button>
        </CardContent>
      </Card>

      <h2 className="mb-3 mt-8 font-semibold">{t("lms.pay.history")}</h2>
      <Card>
        <Table>
          <THead>
            <TR>
              <TH>{lmsLang === "si" ? "දිනය" : "Date"}</TH>
              <TH>{lmsLang === "si" ? "මාස" : "Months"}</TH>
              <TH>{lmsLang === "si" ? "ක්‍රමය" : "Method"}</TH>
              <TH>{lmsLang === "si" ? "මුදල" : "Amount"}</TH>
              <TH>{t("common.status")}</TH>
              <TH></TH>
            </TR>
          </THead>
          <TBody>
            {myPayments.map((p) => (
              <TR key={p.id}>
                <TD>{shortDate(p.createdAt, lmsLang)}</TD>
                <TD>{p.months.join(", ")}</TD>
                <TD className="capitalize">{p.method}</TD>
                <TD>{money(p.amount, lmsLang)}</TD>
                <TD>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={p.status} />
                    {p.duplicateFlag ? <Badge tone="warning"><AlertTriangle className="h-3 w-3" /> flag</Badge> : null}
                  </div>
                  {p.rejectionReason ? <p className="mt-1 text-xs text-danger">{p.rejectionReason}</p> : null}
                </TD>
                <TD>
                  {p.status === "confirmed" ? (
                    <Button size="sm" variant="ghost" onClick={() => toast(lmsLang === "si" ? "රිසිට්පත බාගත විය (නිදර්ශනය)." : "Receipt downloaded (demo).", "info")}>
                      <Download className="h-4 w-4" /> {t("lms.pay.receipt")}
                    </Button>
                  ) : null}
                </TD>
              </TR>
            ))}
          </TBody>
        </Table>
      </Card>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={t("lms.pay.payNow")}
        description={`${money(amount, lmsLang)} · ${month}`}
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>{t("common.cancel")}</Button>
            <Button onClick={pay}>{lmsLang === "si" ? "ගෙවන්න" : "Pay"}</Button>
          </>
        }
      >
        <div className="grid gap-4">
          <Field label={lmsLang === "si" ? "මාසය තෝරන්න" : "Choose month"}>
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm"
            >
              {unpaid.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </Field>

          <div className="grid gap-2">
            <button
              onClick={() => setMethod("online")}
              className={`flex items-start gap-3 rounded-xl border p-3 text-left ${method === "online" ? "border-primary bg-primary/5" : "border-border"}`}
            >
              <Smartphone className="mt-0.5 h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">{t("lms.pay.online")}</p>
                <p className="text-xs text-muted-foreground">{lmsLang === "si" ? "වහාම තහවුරු වේ." : "Confirmed instantly."}</p>
              </div>
            </button>
            <button
              onClick={() => setMethod("slip")}
              className={`flex items-start gap-3 rounded-xl border p-3 text-left ${method === "slip" ? "border-primary bg-primary/5" : "border-border"}`}
            >
              <Landmark className="mt-0.5 h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">{t("lms.pay.bank")}</p>
                <p className="text-xs text-muted-foreground">
                  {db.settings.bankName} · {db.settings.bankAccount} · {db.settings.bankBranch}
                </p>
              </div>
            </button>
          </div>

          {method === "slip" ? (
            <Field label={lmsLang === "si" ? "ස්ලිප් සටහන" : "Slip note"}>
              <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="BOC deposit 16/11" />
              <div className="mt-2 flex items-center gap-2 rounded-lg border border-dashed border-border p-3 text-sm text-muted-foreground">
                <Upload className="h-4 w-4" /> {lmsLang === "si" ? "ස්ලිප් උඩුගත කරන්න (නිදර්ශනය)" : "Upload slip (demo)"}
              </div>
            </Field>
          ) : null}
        </div>
      </Modal>
    </div>
  );
}
