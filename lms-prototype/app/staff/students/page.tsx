"use client";

import { useState } from "react";
import Link from "next/link";
import { useAppStore } from "@/lib/store";
import { shortDate, timeAgo } from "@/lib/format";
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
import { UserPlus, Check, X, ArrowRight, Users } from "lucide-react";
import type { JoinRequest } from "@/lib/types";

export default function StaffStudentsPage() {
  const db = useAppStore((s) => s.db);
  const approveRequest = useAppStore((s) => s.approveRequest);
  const rejectRequest = useAppStore((s) => s.rejectRequest);
  const addStudent = useAppStore((s) => s.addStudent);

  const [tab, setTab] = useState("students");
  const [query, setQuery] = useState("");
  const [stateFilter, setStateFilter] = useState("all");

  const [rejecting, setRejecting] = useState<JoinRequest | null>(null);
  const [reason, setReason] = useState("");

  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({ name: "", nickname: "", mobile: "", source: "other" });

  const pending = db.requests.filter((r) => r.status === "pending");

  const students = db.students
    .filter((s) => (stateFilter === "all" ? true : s.state === stateFilter))
    .filter((s) => (query ? s.name.toLowerCase().includes(query.toLowerCase()) || s.id.toLowerCase().includes(query.toLowerCase()) : true));

  const cls = (id: string) => db.classes.find((c) => c.id === id);

  return (
    <div>
      <PageHeader
        title="Students & requests"
        description="Everyone who registered, everyone who wants in, and everyone who is studying."
        actions={
          <Button onClick={() => { setForm({ name: "", nickname: "", mobile: "", source: "other" }); setAddOpen(true); }}>
            <UserPlus className="h-4 w-4" /> Add student
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Total students" value={db.students.length} icon={<Users className="h-4 w-4" />} />
        <StatTile label="Active" value={db.students.filter((s) => s.state === "active").length} tone="success" />
        <StatTile label="Awaiting approval" value={db.students.filter((s) => s.state === "awaiting-approval").length} tone="warning" />
        <StatTile label="Not in a class" value={db.students.filter((s) => s.state === "not-in-class").length} />
      </div>

      <Tabs
        className="mt-6"
        value={tab}
        onChange={setTab}
        tabs={[
          { value: "students", label: "All students", count: db.students.length },
          { value: "requests", label: "Join requests", count: pending.length },
        ]}
      />

      {tab === "students" ? (
        <div className="mt-4">
          <div className="mb-4 flex flex-wrap gap-3">
            <Input placeholder="Search by name or Student ID..." value={query} onChange={(e) => setQuery(e.target.value)} className="max-w-xs" />
            <Select value={stateFilter} onChange={(e) => setStateFilter(e.target.value)} className="max-w-[180px]">
              <option value="all">All states</option>
              <option value="active">Active</option>
              <option value="awaiting-approval">Awaiting approval</option>
              <option value="not-in-class">Not in a class</option>
            </Select>
          </div>

          <Card>
            <Table>
              <THead>
                <TR>
                  <TH>Student</TH>
                  <TH>Mobile</TH>
                  <TH>State</TH>
                  <TH>Classes</TH>
                  <TH>Source</TH>
                  <TH>Joined</TH>
                  <TH />
                </TR>
              </THead>
              <TBody>
                {students.map((s) => {
                  const count = db.enrolments.filter((e) => e.studentId === s.id && e.status === "active").length;
                  return (
                    <TR key={s.id}>
                      <TD>
                        <div className="flex items-center gap-3">
                          <Avatar name={s.name} hue={s.avatarHue} size={34} />
                          <div>
                            <p className="font-medium">{s.name}</p>
                            <p className="text-xs text-muted-foreground">{s.id} · {s.nickname}</p>
                          </div>
                        </div>
                      </TD>
                      <TD className="text-sm text-muted-foreground">{s.mobile}</TD>
                      <TD><StatusBadge status={s.state === "awaiting-approval" ? "pending" : s.state === "not-in-class" ? "inactive" : "active"} /></TD>
                      <TD>{count > 0 ? <Badge tone="default">{count}</Badge> : <span className="text-sm text-muted-foreground">—</span>}</TD>
                      <TD className="text-sm text-muted-foreground">{s.source}</TD>
                      <TD className="text-sm text-muted-foreground">{shortDate(s.joined)}</TD>
                      <TD>
                        <Link href={`/staff/students/${s.id}`}>
                          <Button size="sm" variant="outline">Open <ArrowRight className="h-3.5 w-3.5" /></Button>
                        </Link>
                      </TD>
                    </TR>
                  );
                })}
              </TBody>
            </Table>
          </Card>
        </div>
      ) : (
        <div className="mt-4 grid gap-4">
          <SectionTitle title="Pending join requests" description="Approve to enrol the student, or reject with a reason." />
          {pending.length === 0 ? (
            <Card><CardContent className="pt-5 text-sm text-muted-foreground">No pending requests.</CardContent></Card>
          ) : (
            pending.map((r) => {
              const st = db.students.find((s) => s.id === r.studentId);
              const c = cls(r.classId);
              return (
                <Card key={r.id}>
                  <CardContent className="flex flex-wrap items-center justify-between gap-4 pt-5">
                    <div className="flex items-center gap-3">
                      <Avatar name={st?.name ?? "?"} hue={st?.avatarHue ?? 220} size={40} />
                      <div>
                        <p className="font-medium">{st?.name}</p>
                        <p className="text-sm text-muted-foreground">{c?.type} — {c?.batch} · {c?.medium}</p>
                        <p className="mt-1 max-w-md text-sm text-muted-foreground">“{r.message}”</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge tone="warning">{timeAgo(r.createdAt)}</Badge>
                      <Button
                        size="sm"
                        variant="success"
                        onClick={() => { approveRequest(r.id); toast(`Approved ${st?.name} for ${c?.batch}.`); }}
                      >
                        <Check className="h-3.5 w-3.5" /> Approve
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => { setRejecting(r); setReason(""); }}>
                        <X className="h-3.5 w-3.5" /> Reject
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}

          <div className="mt-4">
            <SectionTitle title="Recent decisions" />
          </div>
          <Card>
            <Table>
              <THead>
                <TR>
                  <TH>Student</TH>
                  <TH>Class</TH>
                  <TH>Decision</TH>
                  <TH>Note</TH>
                </TR>
              </THead>
              <TBody>
                {db.requests.filter((r) => r.status !== "pending").map((r) => (
                  <TR key={r.id}>
                    <TD className="font-medium">{db.students.find((s) => s.id === r.studentId)?.name ?? r.studentId}</TD>
                    <TD className="text-sm text-muted-foreground">{cls(r.classId)?.batch ?? "—"}</TD>
                    <TD><StatusBadge status={r.status} /></TD>
                    <TD className="text-sm text-muted-foreground">{r.reason ?? "—"}</TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          </Card>
        </div>
      )}

      <Modal
        open={!!rejecting}
        onClose={() => setRejecting(null)}
        title="Reject join request"
        description={rejecting ? db.students.find((s) => s.id === rejecting.studentId)?.name : ""}
        footer={
          <>
            <Button variant="ghost" onClick={() => setRejecting(null)}>Cancel</Button>
            <Button
              variant="danger"
              onClick={() => {
                if (rejecting) {
                  rejectRequest(rejecting.id, reason);
                  toast("Join request rejected.");
                }
                setRejecting(null);
              }}
            >
              Reject request
            </Button>
          </>
        }
      >
        <Field label="Reason (shown to the student)">
          <Input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g. Batch is full for this level" />
        </Field>
      </Modal>

      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add a student"
        description="Create a student record manually (e.g. phone registrations)."
        footer={
          <>
            <Button variant="ghost" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button
              disabled={!form.name || !form.nickname || !form.mobile}
              onClick={() => {
                addStudent(form);
                toast(`${form.name} added.`);
                setAddOpen(false);
              }}
            >
              Add student
            </Button>
          </>
        }
      >
        <div className="grid gap-3">
          <Field label="Full name"><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
          <Field label="Nickname"><Input value={form.nickname} onChange={(e) => setForm({ ...form, nickname: e.target.value })} /></Field>
          <Field label="Mobile"><Input value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} placeholder="+94 7X XXX XXXX" /></Field>
          <Field label="How did they hear about us?">
            <Select value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })}>
              <option value="other">Other</option>
              <option value="WhatsApp">WhatsApp</option>
              <option value="friend">Friend</option>
              <option value="website">Website</option>
              <option value="school">School</option>
              <option value="social media">Social media</option>
            </Select>
          </Field>
        </div>
      </Modal>
    </div>
  );
}
