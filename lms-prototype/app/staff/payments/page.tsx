"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { money, shortDate } from "@/lib/format";
import { PageHeader, StatTile, SectionTitle } from "@/components/shared/page";
import { Card, CardContent } from "@/components/ui/card";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Field, Select } from "@/components/ui/input";
import { Tabs } from "@/components/ui/tabs";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { Modal } from "@/components/ui/modal";
import { Avatar } from "@/components/ui/switch";
import { toast } from "@/components/shared/toast";
import { Check, X, AlertTriangle, RotateCcw, Receipt, Landmark } from "lucide-react";
import type { Payment, PaymentMethod } from "@/lib/types";

const MONTH = "2026-11";

export default function StaffPaymentsPage() {
  const db = useAppStore((s) => s.db);
  const approvePayment = useAppStore((s) => s.approvePayment);
  const rejectPayment = useAppStore((s) => s.rejectPayment);
  const reversePayment = useAppStore((s) => s.reversePayment);
  const recordPayment = useAppStore((s) => s.recordPayment);

  const [tab, setTab] = useState("review");
  const [rejecting, setRejecting] = useState<Payment | null>(null);
  const [reversing, setReversing] = useState<Payment | null>(null);
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");

  const [recording, setRecording] = useState<string | null>(null);
  const [recMethod, setRecMethod] = useState<PaymentMethod>("cash");
  const [recAmount, setRecAmount] = useState(0);

  const studentName = (id: string) => db.students.find((s) => s.id === id)?.name ?? id;
  const classNames = (ids: string[]) => ids.map((id) => db.classes.find((c) => c.id === id)?.batch ?? id).join(", ");

  const pending = db.payments.filter((p) => p.status === "pending");
  const confirmed = db.payments.filter((p) => p.status === "confirmed");
  const confirmedThisMonth = confirmed.filter((p) => p.months.includes(MONTH)).reduce((s, p) => s + p.amount, 0);

  const activeEnrolments = db.enrolments.filter((e) => e.status === "active");
  const paidIds = new Set(confirmed.filter((p) => p.months.includes(MONTH)).map((p) => p.studentId));
  const unpaidStudentIds = [...new Set(activeEnrolments.map((e) => e.studentId))].filter((id) => !paidIds.has(id));

  const openRecord = (studentId: string) => {
    const fees = activeEnrolments
      .filter((e) => e.studentId === studentId)
      .reduce((s, e) => s + (db.classes.find((c) => c.id === e.classId)?.monthlyFee ?? 0), 0);
    setRecAmount(fees);
    setRecMethod("cash");
    setRecording(studentId);
  };

  return (
    <div>
      <PageHeader
        title="Payments"
        description="Check slips, approve online payments, record cash, and reverse mistakes."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Awaiting review" value={pending.length} tone="warning" icon={<Receipt className="h-4 w-4" />} />
        <StatTile label={`Confirmed ${MONTH}`} value={money(confirmedThisMonth)} tone="success" icon={<Landmark className="h-4 w-4" />} />
        <StatTile label="Unpaid students" value={unpaidStudentIds.length} tone="danger" icon={<AlertTriangle className="h-4 w-4" />} />
        <StatTile label="Reversed" value={db.payments.filter((p) => p.status === "reversed").length} />
      </div>

      <Tabs
        className="mt-6"
        value={tab}
        onChange={setTab}
        tabs={[
          { value: "review", label: "To review", count: pending.length },
          { value: "all", label: "All payments", count: db.payments.length },
          { value: "unpaid", label: "Unpaid", count: unpaidStudentIds.length },
        ]}
      />

      {tab === "review" ? (
        <div className="mt-4 grid gap-4">
          {pending.length === 0 ? (
            <Card><CardContent className="pt-5 text-sm text-muted-foreground">Nothing to review. 🎉</CardContent></Card>
          ) : (
            pending.map((p) => {
              const st = db.students.find((s) => s.id === p.studentId);
              return (
                <Card key={p.id} className={p.duplicateFlag ? "border-warning/40" : undefined}>
                  <CardContent className="flex flex-wrap items-center justify-between gap-4 pt-5">
                    <div className="flex items-center gap-3">
                      <Avatar name={st?.name ?? "?"} hue={st?.avatarHue ?? 220} size={44} />
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{st?.name}</p>
                          {p.duplicateFlag ? <Badge tone="warning"><AlertTriangle className="h-3 w-3" /> possible duplicate</Badge> : null}
                        </div>
                        <p className="text-sm text-muted-foreground">{classNames(p.classIds)} · {p.months.join(", ")}</p>
                        <p className="text-xs text-muted-foreground">{p.reference} · {p.slipNote ?? p.method} · {shortDate(p.createdAt)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-lg font-bold">{money(p.amount)}</p>
                      <Button size="sm" variant="outline" onClick={() => toast("Opening slip image (demo).", "info")}>View slip</Button>
                      <Button size="sm" variant="success" onClick={() => { approvePayment(p.id); toast(`Approved ${p.reference}.`); }}>
                        <Check className="h-3.5 w-3.5" /> Approve
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => { setRejecting(p); setReason(""); }}>
                        <X className="h-3.5 w-3.5" /> Reject
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      ) : tab === "all" ? (
        <Card className="mt-4">
          <Table>
            <THead>
              <TR><TH>Student</TH><TH>Reference</TH><TH>Amount</TH><TH>Method</TH><TH>Months</TH><TH>Status</TH><TH /></TR>
            </THead>
            <TBody>
              {db.payments.map((p) => (
                <TR key={p.id}>
                  <TD className="font-medium">{studentName(p.studentId)}</TD>
                  <TD className="text-sm text-muted-foreground">{p.reference}</TD>
                  <TD>{money(p.amount)}</TD>
                  <TD className="capitalize text-sm text-muted-foreground">{p.method}</TD>
                  <TD className="text-sm text-muted-foreground">{p.months.join(", ")}</TD>
                  <TD><StatusBadge status={p.status} /></TD>
                  <TD>
                    {p.status === "confirmed" ? (
                      <Button size="sm" variant="outline" onClick={() => { setReversing(p); setNote(""); }}>
                        <RotateCcw className="h-3.5 w-3.5" /> Reverse
                      </Button>
                    ) : p.status === "pending" ? (
                      <Button size="sm" variant="success" onClick={() => { approvePayment(p.id); toast(`Approved ${p.reference}.`); }}>
                        <Check className="h-3.5 w-3.5" /> Approve
                      </Button>
                    ) : null}
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </Card>
      ) : (
        <div className="mt-4">
          <SectionTitle title="Unpaid students" description={`Active students without a confirmed payment for ${MONTH}.`} />
          <Card>
            <Table>
              <THead>
                <TR><TH>Student</TH><TH>Classes</TH><TH>Expected</TH><TH /></TR>
              </THead>
              <TBody>
                {unpaidStudentIds.map((id) => {
                  const st = db.students.find((s) => s.id === id);
                  const ens = activeEnrolments.filter((e) => e.studentId === id);
                  const expected = ens.reduce((s, e) => s + (db.classes.find((c) => c.id === e.classId)?.monthlyFee ?? 0), 0);
                  return (
                    <TR key={id}>
                      <TD className="font-medium">{st?.name}</TD>
                      <TD className="text-sm text-muted-foreground">{classNames(ens.map((e) => e.classId))}</TD>
                      <TD>{money(expected)}</TD>
                      <TD>
                        <Button size="sm" variant="outline" onClick={() => openRecord(id)}>
                          <Receipt className="h-3.5 w-3.5" /> Record payment
                        </Button>
                      </TD>
                    </TR>
                  );
                })}
              </TBody>
            </Table>
          </Card>
          {unpaidStudentIds.length === 0 ? <p className="mt-3 text-sm text-muted-foreground">Everyone has paid for {MONTH}.</p> : null}
        </div>
      )}

      <Modal
        open={!!rejecting}
        onClose={() => setRejecting(null)}
        title="Reject payment"
        description={rejecting ? `${studentName(rejecting.studentId)} · ${rejecting.reference}` : ""}
        footer={
          <>
            <Button variant="ghost" onClick={() => setRejecting(null)}>Cancel</Button>
            <Button variant="danger" onClick={() => { if (rejecting) { rejectPayment(rejecting.id, reason); toast("Payment rejected."); } setRejecting(null); }}>
              Reject
            </Button>
          </>
        }
      >
        <Field label="Reason (sent to the student)">
          <Input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g. Slip amount does not match" />
        </Field>
      </Modal>

      <Modal
        open={!!reversing}
        onClose={() => setReversing(null)}
        title="Reverse payment"
        description={reversing ? `${studentName(reversing.studentId)} · ${money(reversing.amount)}` : ""}
        footer={
          <>
            <Button variant="ghost" onClick={() => setReversing(null)}>Cancel</Button>
            <Button variant="danger" onClick={() => { if (reversing) { reversePayment(reversing.id, note); toast("Payment reversed and logged."); } setReversing(null); }}>
              Reverse payment
            </Button>
          </>
        }
      >
        <Field label="Reason for reversal" hint="This is written to the activity log.">
          <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Refunded by bank transfer" />
        </Field>
      </Modal>

      <Modal
        open={!!recording}
        onClose={() => setRecording(null)}
        title="Record a payment"
        description={recording ? studentName(recording) : ""}
        footer={
          <>
            <Button variant="ghost" onClick={() => setRecording(null)}>Cancel</Button>
            <Button
              onClick={() => {
                if (recording) {
                  const classIds = activeEnrolments.filter((e) => e.studentId === recording).map((e) => e.classId);
                  recordPayment({ studentId: recording, classIds, months: [MONTH], amount: Number(recAmount), method: recMethod });
                  toast(`Payment recorded for ${studentName(recording)}.`);
                }
                setRecording(null);
              }}
            >
              Save payment
            </Button>
          </>
        }
      >
        <div className="grid gap-3">
          <Field label="Amount (LKR)"><Input type="number" value={recAmount} onChange={(e) => setRecAmount(Number(e.target.value))} /></Field>
          <Field label="Method">
            <Select value={recMethod} onChange={(e) => setRecMethod(e.target.value as PaymentMethod)}>
              <option value="cash">Cash</option>
              <option value="slip">Bank transfer / slip</option>
              <option value="online">Online</option>
            </Select>
          </Field>
          <p className="text-xs text-muted-foreground">Recorded payments are confirmed immediately and appear in finance.</p>
        </div>
      </Modal>
    </div>
  );
}
