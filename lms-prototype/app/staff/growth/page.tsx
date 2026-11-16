"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { timeAgo } from "@/lib/format";
import { pick } from "@/lib/i18n";
import { PageHeader, StatTile, SectionTitle } from "@/components/shared/page";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { Modal } from "@/components/ui/modal";
import { Field, Select, Textarea } from "@/components/ui/input";
import { toast } from "@/components/shared/toast";
import { Filter, Sparkles, BellRing, Flame, PhoneCall } from "lucide-react";
import type { Lead } from "@/lib/types";

export default function StaffGrowthPage() {
  const db = useAppStore((s) => s.db);
  const toggleHook = useAppStore((s) => s.toggleHook);
  const updateNudge = useAppStore((s) => s.updateNudge);
  const addFollowUp = useAppStore((s) => s.addFollowUp);

  const activeEnrolments = db.enrolments.filter((e) => e.status === "active");
  const pendingRequests = db.requests.filter((r) => r.status === "pending");
  const approvedRequests = db.requests.filter((r) => r.status === "approved");

  const funnel = [
    { label: "Website visitors", value: 4820, pct: 100 },
    { label: "Free sign-ups", value: db.students.length + 598, pct: 13 },
    { label: "Join requests", value: db.requests.length + 179, pct: 4 },
    { label: "Approved", value: approvedRequests.length + 118, pct: 2.5 },
    { label: "Paying students", value: activeEnrolments.length, pct: 1.6 },
  ];

  const leads = [...db.leads].sort((a, b) => b.engagementScore - a.engagementScore);

  const [lead, setLead] = useState<Lead | null>(null);
  const [type, setType] = useState<"called" | "messaged" | "not-interested">("called");
  const [note, setNote] = useState("");

  const studentName = (id: string) => db.students.find((s) => s.id === id)?.name ?? id;

  return (
    <div>
      <PageHeader
        title="Growth & funnel"
        description="See how visitors become paying students, and act on the leads that matter."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Visitors (30d)" value="4,820" icon={<Filter className="h-4 w-4" />} />
        <StatTile label="Free sign-ups" value={db.students.length} tone="success" icon={<Sparkles className="h-4 w-4" />} />
        <StatTile label="Open requests" value={pendingRequests.length} tone="warning" icon={<BellRing className="h-4 w-4" />} />
        <StatTile label="Paying students" value={activeEnrolments.length} icon={<Flame className="h-4 w-4" />} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="pt-5">
            <SectionTitle title="Conversion funnel" description="Where people drop off." />
            <div className="grid gap-4">
              {funnel.map((f, i) => (
                <div key={f.label}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{f.label}</span>
                    <span className="font-medium">{f.value.toLocaleString()}</span>
                  </div>
                  <Progress className="mt-1.5" value={f.pct} barClassName={i === 0 ? "bg-primary" : i < 3 ? "bg-blue-500" : "bg-success"} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-5">
            <SectionTitle title="Growth hooks" description="Free features that pull new students in." />
            <div className="grid gap-2">
              {db.hooks.map((h) => (
                <div key={h.id} className="flex items-center justify-between rounded-xl border border-border p-3">
                  <div className="min-w-0 pr-3">
                    <p className="text-sm font-medium">{h.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{h.description}</p>
                  </div>
                  <Switch checked={h.enabled} onChange={() => { toggleHook(h.id); toast(`${h.name} ${h.enabled ? "disabled" : "enabled"}.`); }} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardContent className="pt-5">
          <SectionTitle title="Onboarding nudges" description="What new students are told, and when." />
          <div className="grid gap-2">
            {db.nudges.map((n) => (
              <div key={n.id} className="flex items-start justify-between gap-3 rounded-xl border border-border p-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium">Day {n.day}</p>
                  <p className="text-sm text-muted-foreground">{pick(n.message, "en")}</p>
                  <Badge tone="muted" className="mt-1.5">{n.channel}</Badge>
                </div>
                <Switch
                  checked={n.enabled}
                  onChange={() => {
                    updateNudge(n.id, { enabled: !n.enabled });
                    toast(`Nudge for day ${n.day} ${n.enabled ? "disabled" : "enabled"}.`);
                  }}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="mt-6">
        <SectionTitle title="Leads" description="Students who engaged but have not joined a class yet." />
        <Card>
          <Table>
            <THead>
              <TR>
                <TH>Student</TH>
                <TH>Source</TH>
                <TH>Engagement</TH>
                <TH>Last follow-up</TH>
                <TH>Status</TH>
                <TH>Actions</TH>
              </TR>
            </THead>
            <TBody>
              {leads.map((l) => {
                const st = db.students.find((s) => s.id === l.studentId);
                return (
                  <TR key={l.id}>
                    <TD>
                      <p className="font-medium">{studentName(l.studentId)}</p>
                      <p className="text-xs text-muted-foreground">{l.studentId}</p>
                    </TD>
                    <TD className="text-sm text-muted-foreground">{st?.source ?? "—"}</TD>
                    <TD>
                      <div className="flex items-center gap-2">
                        <Progress className="w-20" value={l.engagementScore} barClassName={l.engagementScore >= 60 ? "bg-warning" : "bg-muted-foreground"} />
                        <span className="text-xs font-medium">{l.engagementScore}</span>
                      </div>
                    </TD>
                    <TD className="text-sm text-muted-foreground">
                      {l.lastFollowUp ? `${l.followUpType} · ${timeAgo(l.lastFollowUp)}` : "—"}
                    </TD>
                    <TD>
                      {l.followUpType === "not-interested" ? (
                        <Badge tone="muted">not interested</Badge>
                      ) : l.engagementScore >= 60 ? (
                        <Badge tone="warning">warm</Badge>
                      ) : (
                        <Badge tone="muted">cold</Badge>
                      )}
                    </TD>
                    <TD>
                      <Button size="sm" variant="outline" onClick={() => { setLead(l); setType("called"); setNote(l.followUpNote ?? ""); }}>
                        <PhoneCall className="h-3.5 w-3.5" /> Follow up
                      </Button>
                    </TD>
                  </TR>
                );
              })}
            </TBody>
          </Table>
        </Card>
      </div>

      <Modal
        open={!!lead}
        onClose={() => setLead(null)}
        title="Log a follow-up"
        description={lead ? studentName(lead.studentId) : ""}
        footer={
          <>
            <Button variant="ghost" onClick={() => setLead(null)}>Cancel</Button>
            <Button
              onClick={() => {
                if (lead) {
                  addFollowUp(lead.id, type, note);
                  toast(`Follow-up logged for ${studentName(lead.studentId)}.`);
                }
                setLead(null);
              }}
            >
              Save follow-up
            </Button>
          </>
        }
      >
        <div className="grid gap-3">
          <Field label="Type">
            <Select value={type} onChange={(e) => setType(e.target.value as typeof type)}>
              <option value="called">Called</option>
              <option value="messaged">Messaged</option>
              <option value="not-interested">Not interested</option>
            </Select>
          </Field>
          <Field label="Note">
            <Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="What did you discuss?" />
          </Field>
        </div>
      </Modal>
    </div>
  );
}
