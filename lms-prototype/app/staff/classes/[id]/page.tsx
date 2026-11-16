"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { money, shortDate } from "@/lib/format";
import { PageHeader, SectionTitle, InfoRow } from "@/components/shared/page";
import { Card, CardContent } from "@/components/ui/card";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Field, Select, Textarea } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { Avatar } from "@/components/ui/switch";
import { toast } from "@/components/shared/toast";
import { ArrowLeft, Link2, Users, Video } from "lucide-react";
import type { ClassStatus, Medium, TimetableSlot } from "@/lib/types";

export default function StaffClassDetailPage() {
  const params = useParams<{ id: string }>();
  const db = useAppStore((s) => s.db);
  const updateClass = useAppStore((s) => s.updateClass);

  const cls = db.classes.find((c) => c.id === params.id);

  const [form, setForm] = useState(() => ({
    batch: cls?.batch ?? "",
    monthlyFee: cls?.monthlyFee ?? 0,
    capacity: cls?.capacity ?? 0,
    status: (cls?.status ?? "open") as ClassStatus,
    medium: (cls?.medium ?? "Sinhala") as Medium,
    groupLink: cls?.groupLink ?? "",
    day: (cls?.timetable[0]?.day ?? "Sat") as TimetableSlot["day"],
    start: cls?.timetable[0]?.start ?? "08:00",
    end: cls?.timetable[0]?.end ?? "10:30",
    descriptionEn: cls?.description.en ?? "",
    descriptionSi: cls?.description.si ?? "",
    shownOnWebsite: cls?.shownOnWebsite ?? true,
    active: cls?.active ?? true,
    includedWithTheory: cls?.includedWithTheory ?? false,
  }));

  if (!cls) {
    return (
      <div>
        <PageHeader title="Class not found" />
        <Link href="/staff/classes"><Button variant="outline"><ArrowLeft className="h-4 w-4" /> Back to classes</Button></Link>
      </div>
    );
  }

  const enrolledStudents = db.enrolments
    .filter((e) => e.classId === cls.id && e.status === "active")
    .map((e) => db.students.find((s) => s.id === e.studentId))
    .filter(Boolean);

  const sessions = db.sessions.filter((s) => s.classId === cls.id).sort((a, b) => a.date.localeCompare(b.date));

  const save = () => {
    updateClass(cls.id, {
      batch: form.batch,
      monthlyFee: Number(form.monthlyFee),
      capacity: Number(form.capacity),
      status: form.status,
      medium: form.medium,
      groupLink: form.groupLink || undefined,
      timetable: [{ day: form.day, start: form.start, end: form.end }],
      description: { en: form.descriptionEn, si: form.descriptionSi },
      shownOnWebsite: form.shownOnWebsite,
      active: form.active,
      includedWithTheory: form.includedWithTheory,
    });
    toast(`${form.batch} updated.`);
  };

  return (
    <div>
      <Link href="/staff/classes" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Classes
      </Link>

      <PageHeader
        title={`${cls.type} — ${cls.batch}`}
        description={`${cls.medium} medium · ${cls.enrolled}/${cls.capacity} seats · starts ${shortDate(cls.startDate)}`}
        actions={<StatusBadge status={cls.status} />}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardContent className="pt-5">
            <SectionTitle title="Class details" description="Changes apply to the LMS and the public website." />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Batch name" className="sm:col-span-2"><Input value={form.batch} onChange={(e) => setForm({ ...form, batch: e.target.value })} /></Field>
              <Field label="Monthly fee (LKR)"><Input type="number" value={form.monthlyFee} onChange={(e) => setForm({ ...form, monthlyFee: Number(e.target.value) })} /></Field>
              <Field label="Capacity"><Input type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })} /></Field>
              <Field label="Status">
                <Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as ClassStatus })}>
                  <option value="open">Open</option>
                  <option value="full">Full</option>
                  <option value="closed">Closed</option>
                </Select>
              </Field>
              <Field label="Medium">
                <Select value={form.medium} onChange={(e) => setForm({ ...form, medium: e.target.value as Medium })}>
                  <option value="Sinhala">Sinhala</option>
                  <option value="English">English</option>
                </Select>
              </Field>
              <Field label="Day">
                <Select value={form.day} onChange={(e) => setForm({ ...form, day: e.target.value as TimetableSlot["day"] })}>
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => <option key={d} value={d}>{d}</option>)}
                </Select>
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Start"><Input value={form.start} onChange={(e) => setForm({ ...form, start: e.target.value })} /></Field>
                <Field label="End"><Input value={form.end} onChange={(e) => setForm({ ...form, end: e.target.value })} /></Field>
              </div>
              <Field label="WhatsApp group link" className="sm:col-span-2"><Input value={form.groupLink} onChange={(e) => setForm({ ...form, groupLink: e.target.value })} /></Field>
              <Field label="Description (English)" className="sm:col-span-2"><Textarea value={form.descriptionEn} onChange={(e) => setForm({ ...form, descriptionEn: e.target.value })} /></Field>
              <Field label="Description (Sinhala)" className="sm:col-span-2"><Textarea value={form.descriptionSi} onChange={(e) => setForm({ ...form, descriptionSi: e.target.value })} /></Field>
            </div>

            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              <ToggleRow label="Active" checked={form.active} onChange={(v) => setForm({ ...form, active: v })} />
              <ToggleRow label="Show on website" checked={form.shownOnWebsite} onChange={(v) => setForm({ ...form, shownOnWebsite: v })} />
              <ToggleRow label="Included with Theory" checked={form.includedWithTheory} onChange={(v) => setForm({ ...form, includedWithTheory: v })} />
            </div>

            <Button className="mt-5" onClick={save}>Save changes</Button>
          </CardContent>
        </Card>

        <div className="grid gap-6">
          <Card>
            <CardContent className="pt-5">
              <SectionTitle title="Quick facts" />
              <InfoRow label="Type" value={<Badge tone="default">{cls.type}</Badge>} />
              <InfoRow label="Subject" value={cls.subject} />
              <InfoRow label="Seats" value={`${cls.enrolled} / ${cls.capacity}`} />
              <InfoRow label="Group link" value={cls.groupLink ? <span className="inline-flex items-center gap-1 text-primary"><Link2 className="h-3.5 w-3.5" /> set</span> : "—"} />
              <InfoRow label="Included with" value={cls.includedWithTheory ? (db.classes.find((x) => x.id === cls.theoryParentId)?.batch ?? "Theory") : "—"} />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-5">
              <SectionTitle title="Students" description={`${enrolledStudents.length} active`} />
              <div className="grid gap-2">
                {enrolledStudents.slice(0, 8).map((s) => (
                  <div key={s!.id} className="flex items-center gap-3">
                    <Avatar name={s!.name} hue={s!.avatarHue} size={30} />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{s!.name}</p>
                      <p className="text-xs text-muted-foreground">{s!.id}</p>
                    </div>
                  </div>
                ))}
                {enrolledStudents.length === 0 ? <p className="text-sm text-muted-foreground">No students yet.</p> : null}
              </div>
              <Link href="/staff/students"><Button size="sm" variant="outline" className="mt-3 w-full"><Users className="h-4 w-4" /> Manage students</Button></Link>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-6">
        <SectionTitle title="Sessions" description="Scheduled, live and completed classes for this batch." />
        <Card>
          <Table>
            <THead>
              <TR><TH>Date</TH><TH>Time</TH><TH>Status</TH><TH>Recording</TH><TH>Open class</TH></TR>
            </THead>
            <TBody>
              {sessions.map((s) => (
                <TR key={s.id}>
                  <TD>{shortDate(s.date)}</TD>
                  <TD className="text-muted-foreground">{s.start}–{s.end}</TD>
                  <TD><StatusBadge status={s.status} /></TD>
                  <TD>{s.recordingUrl ? <Badge tone="info"><Video className="h-3 w-3" /> available</Badge> : <span className="text-sm text-muted-foreground">—</span>}</TD>
                  <TD>{s.openClass ? <Badge tone="success">open</Badge> : <span className="text-sm text-muted-foreground">—</span>}</TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}

function ToggleRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border p-3">
      <span className="text-sm">{label}</span>
      <Switch checked={checked} onChange={onChange} />
    </div>
  );
}
