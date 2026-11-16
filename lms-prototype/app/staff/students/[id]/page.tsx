"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { money, shortDate, timeAgo } from "@/lib/format";
import { PageHeader, InfoRow, SectionTitle, StatTile } from "@/components/shared/page";
import { Card, CardContent } from "@/components/ui/card";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Field } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Avatar, Switch } from "@/components/ui/switch";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { toast } from "@/components/shared/toast";
import { ArrowLeft, BadgeCheck, Gift, Phone, MessageSquare, UserCog } from "lucide-react";

export default function StaffStudentDetailPage() {
  const params = useParams<{ id: string }>();
  const db = useAppStore((s) => s.db);
  const setEnrolmentStatus = useAppStore((s) => s.setEnrolmentStatus);
  const setStudentActive = useAppStore((s) => s.setStudentActive);
  const grantWaiver = useAppStore((s) => s.grantWaiver);
  const sendMessage = useAppStore((s) => s.sendMessage);

  const student = db.students.find((s) => s.id === params.id);
  const [waiverOpen, setWaiverOpen] = useState(false);
  const [waiverText, setWaiverText] = useState(student?.feeWaiver ?? "");

  if (!student) {
    return (
      <div>
        <PageHeader title="Student not found" />
        <Link href="/staff/students"><Button variant="outline"><ArrowLeft className="h-4 w-4" /> Back to students</Button></Link>
      </div>
    );
  }

  const enrolments = db.enrolments.filter((e) => e.studentId === student.id);
  const payments = db.payments.filter((p) => p.studentId === student.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const attendance = db.attendance.filter((a) => a.studentId === student.id);
  const present = attendance.filter((a) => a.status === "present" || a.status === "late").length;
  const pct = attendance.length ? Math.round((present / attendance.length) * 100) : 0;
  const thread = db.messages.filter((m) => m.studentId === student.id).sort((a, b) => a.at.localeCompare(b.at));

  return (
    <div>
      <Link href="/staff/students" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Students
      </Link>

      <PageHeader
        title={student.name}
        description={`${student.id} · nickname ${student.nickname}`}
        actions={
          <div className="flex items-center gap-2">
            <Badge tone={student.active ? "success" : "muted"}>{student.active ? "Account active" : "Account disabled"}</Badge>
            <Button variant="outline" onClick={() => setWaiverOpen(true)}><Gift className="h-4 w-4" /> Fee waiver</Button>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Attendance" value={`${pct}%`} tone={pct >= db.settings.minPresentPct ? "success" : "danger"} />
        <StatTile label="Points" value={student.points} hint={`best streak ${student.bestStreak}`} />
        <StatTile label="Active classes" value={enrolments.filter((e) => e.status === "active").length} />
        <StatTile label="Payments" value={payments.length} hint={payments[0] ? `last ${shortDate(payments[0].createdAt)}` : "none"} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardContent className="pt-5">
            <div className="flex items-center gap-3">
              <Avatar name={student.name} hue={student.avatarHue} size={56} />
              <div>
                <p className="font-semibold">{student.name}</p>
                <p className="text-sm text-muted-foreground">{student.mobile}</p>
              </div>
            </div>
            <div className="mt-4">
              <InfoRow label="Guardian" value={student.guardianMobile ?? "—"} />
              <InfoRow label="Language" value={student.language === "si" ? "Sinhala" : "English"} />
              <InfoRow label="Sign-in" value={student.google ? "Google" : "Mobile + password"} />
              <InfoRow label="Source" value={student.source} />
              <InfoRow label="Joined" value={shortDate(student.joined)} />
              <InfoRow label="State" value={<StatusBadge status={student.state === "awaiting-approval" ? "pending" : student.state === "not-in-class" ? "inactive" : "active"} />} />
              {student.feeWaiver ? <InfoRow label="Waiver" value={<Badge tone="success">{student.feeWaiver}</Badge>} /> : null}
            </div>

            <div className="mt-4 flex items-center justify-between rounded-xl border border-border p-3">
              <span className="flex items-center gap-2 text-sm"><UserCog className="h-4 w-4" /> Account enabled</span>
              <Switch
                checked={student.active}
                onChange={(v) => { setStudentActive(student.id, v); toast(v ? "Account enabled." : "Account disabled."); }}
              />
            </div>

            <div className="mt-3 flex gap-2">
              <Button size="sm" variant="outline" className="flex-1" onClick={() => toast(`Calling ${student.mobile} (demo).`, "info")}>
                <Phone className="h-3.5 w-3.5" /> Call
              </Button>
              <Button size="sm" variant="outline" className="flex-1" onClick={() => toast("Opening the message thread (demo).", "info")}>
                <MessageSquare className="h-3.5 w-3.5" /> Message
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:col-span-2">
          <Card>
            <CardContent className="pt-5">
              <SectionTitle title="Classes & enrolment" description="Pause or end an enrolment without deleting history." />
              <div className="grid gap-2">
                {enrolments.map((e) => {
                  const c = db.classes.find((x) => x.id === e.classId);
                  return (
                    <div key={e.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border p-3">
                      <div>
                        <p className="text-sm font-medium">{c?.type} — {c?.batch}</p>
                        <p className="text-xs text-muted-foreground">{money(c?.monthlyFee ?? 0)} / month · since {shortDate(e.startedAt)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={e.status} />
                        {e.status === "active" ? (
                          <>
                            <Button size="sm" variant="outline" onClick={() => { setEnrolmentStatus(e.id, "paused"); toast("Enrolment paused."); }}>Pause</Button>
                            <Button size="sm" variant="outline" onClick={() => { setEnrolmentStatus(e.id, "ended"); toast("Enrolment ended."); }}>End</Button>
                          </>
                        ) : (
                          <Button size="sm" variant="outline" onClick={() => { setEnrolmentStatus(e.id, "active"); toast("Enrolment resumed."); }}>Resume</Button>
                        )}
                      </div>
                    </div>
                  );
                })}
                {enrolments.length === 0 ? <p className="text-sm text-muted-foreground">Not enrolled in any class.</p> : null}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-5">
              <SectionTitle title="Payment history" />
              <Table>
                <THead>
                  <TR><TH>Reference</TH><TH>Amount</TH><TH>Method</TH><TH>Month</TH><TH>Status</TH></TR>
                </THead>
                <TBody>
                  {payments.map((p) => (
                    <TR key={p.id}>
                      <TD className="font-medium">{p.reference}</TD>
                      <TD>{money(p.amount)}</TD>
                      <TD className="capitalize text-muted-foreground">{p.method}</TD>
                      <TD className="text-muted-foreground">{p.months.join(", ")}</TD>
                      <TD><StatusBadge status={p.status} /></TD>
                    </TR>
                  ))}
                </TBody>
              </Table>
              {payments.length === 0 ? <p className="mt-3 text-sm text-muted-foreground">No payments recorded.</p> : null}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-5">
              <SectionTitle title="Messages" description="Send a reply from here." />
              <div className="grid gap-2">
                {thread.slice(-4).map((m) => (
                  <div key={m.id} className={`rounded-xl border p-3 text-sm ${m.from === "student" ? "border-border" : "border-primary/20 bg-primary/5"}`}>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{m.from === "student" ? student.name : "Staff"}</span>
                      <span className="text-xs text-muted-foreground">{timeAgo(m.at)}</span>
                    </div>
                    <p className="mt-1 text-muted-foreground">{m.body}</p>
                  </div>
                ))}
                {thread.length === 0 ? <p className="text-sm text-muted-foreground">No messages.</p> : null}
              </div>
              <QuickReply onSend={(body) => { sendMessage(student.id, body); toast("Reply sent."); }} />
            </CardContent>
          </Card>
        </div>
      </div>

      <Modal
        open={waiverOpen}
        onClose={() => setWaiverOpen(false)}
        title="Fee waiver"
        description="Apply a scholarship or full/partial waiver for this student."
        footer={
          <>
            <Button variant="ghost" onClick={() => setWaiverOpen(false)}>Cancel</Button>
            <Button
              onClick={() => {
                grantWaiver(student.id, waiverText);
                toast(waiverText ? "Fee waiver saved." : "Fee waiver removed.");
                setWaiverOpen(false);
              }}
            >
              Save
            </Button>
          </>
        }
      >
        <Field label="Waiver description" hint="Leave empty to remove the waiver.">
          <Input value={waiverText} onChange={(e) => setWaiverText(e.target.value)} placeholder="e.g. Scholarship — 100%" />
        </Field>
        <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
          <BadgeCheck className="h-3.5 w-3.5" /> Waivers are recorded as zero-amount adjustments in finance.
        </p>
      </Modal>
    </div>
  );
}

function QuickReply({ onSend }: { onSend: (body: string) => void }) {
  const [body, setBody] = useState("");
  return (
    <div className="mt-3 flex items-center gap-2 border-t border-border pt-3">
      <Input value={body} onChange={(e) => setBody(e.target.value)} placeholder="Type a reply..." />
      <Button
        size="sm"
        onClick={() => {
          if (!body.trim()) return;
          onSend(body);
          setBody("");
        }}
      >
        Send
      </Button>
    </div>
  );
}
