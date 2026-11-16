"use client";

import { useState } from "react";
import Link from "next/link";
import { useAppStore } from "@/lib/store";
import { money, shortDate, uid } from "@/lib/format";
import { PageHeader, StatTile, SectionTitle } from "@/components/shared/page";
import { Card, CardContent } from "@/components/ui/card";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Field, Select } from "@/components/ui/input";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { Modal } from "@/components/ui/modal";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/shared/toast";
import { Plus, ArrowRight, Globe, Layers } from "lucide-react";
import type { ClassRecord, ClassType, Medium, ClassStatus, TimetableSlot } from "@/lib/types";

const b = (en: string, si: string) => ({ en, si });

export default function StaffClassesPage() {
  const db = useAppStore((s) => s.db);
  const updateClass = useAppStore((s) => s.updateClass);
  const addClass = useAppStore((s) => s.addClass);

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    type: "Theory" as ClassType,
    medium: "Sinhala" as Medium,
    batch: "",
    monthlyFee: 3500,
    capacity: 40,
    day: "Sat" as TimetableSlot["day"],
    start: "08:00",
    end: "10:30",
    status: "open" as ClassStatus,
    shownOnWebsite: true,
    includedWithTheory: false,
    descriptionEn: "",
    descriptionSi: "",
  });

  const create = () => {
    const c: ClassRecord = {
      id: uid("c"),
      subject: "Combined Mathematics",
      type: form.type,
      medium: form.medium,
      batch: form.batch || `${form.type} — new batch`,
      monthlyFee: Number(form.monthlyFee) || 0,
      capacity: Number(form.capacity) || 0,
      enrolled: 0,
      status: form.status,
      active: true,
      shownOnWebsite: form.shownOnWebsite,
      includedWithTheory: form.includedWithTheory,
      timetable: [{ day: form.day, start: form.start, end: form.end }],
      description: b(form.descriptionEn || "New class.", form.descriptionSi || form.descriptionEn || "නව පන්තිය."),
      startDate: new Date().toISOString().slice(0, 10),
    };
    addClass(c);
    toast(`${c.batch} created.`);
    setOpen(false);
  };

  const totalStudents = db.classes.reduce((s, c) => s + c.enrolled, 0);

  return (
    <div>
      <PageHeader
        title="Classes"
        description="Theory, Revision and Paper batches. Control what the public website shows."
        actions={<Button onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> New class</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Classes" value={db.classes.length} icon={<Layers className="h-4 w-4" />} />
        <StatTile label="Seats taken" value={totalStudents} />
        <StatTile label="On website" value={db.classes.filter((c) => c.shownOnWebsite).length} icon={<Globe className="h-4 w-4" />} />
        <StatTile label="Full / closed" value={db.classes.filter((c) => c.status !== "open").length} tone="warning" />
      </div>

      <div className="mt-6">
        <SectionTitle title="All classes" description="Toggle website visibility without changing the class." />
        <Card>
          <Table>
            <THead>
              <TR>
                <TH>Class</TH>
                <TH>Medium</TH>
                <TH>Fee</TH>
                <TH>Seats</TH>
                <TH>Timetable</TH>
                <TH>Status</TH>
                <TH>Website</TH>
                <TH />
              </TR>
            </THead>
            <TBody>
              {db.classes.map((c) => (
                <TR key={c.id}>
                  <TD>
                    <p className="font-medium">{c.type} — {c.batch}</p>
                    <p className="text-xs text-muted-foreground">starts {shortDate(c.startDate)}</p>
                  </TD>
                  <TD className="text-sm text-muted-foreground">{c.medium}</TD>
                  <TD className="text-sm">{money(c.monthlyFee)}</TD>
                  <TD>
                    <span className="text-sm">{c.enrolled}/{c.capacity}</span>
                    {c.enrolled >= c.capacity ? <Badge tone="danger" className="ml-2">full</Badge> : null}
                  </TD>
                  <TD className="text-sm text-muted-foreground">{c.timetable.map((t) => `${t.day} ${t.start}`).join(", ")}</TD>
                  <TD><StatusBadge status={c.status} /></TD>
                  <TD>
                    <Switch
                      checked={c.shownOnWebsite}
                      onChange={(v) => { updateClass(c.id, { shownOnWebsite: v }); toast(`${c.batch} ${v ? "shown on" : "hidden from"} the website.`); }}
                    />
                  </TD>
                  <TD>
                    <Link href={`/staff/classes/${c.id}`}>
                      <Button size="sm" variant="outline">Manage <ArrowRight className="h-3.5 w-3.5" /></Button>
                    </Link>
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </Card>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Create a class"
        className="max-w-2xl"
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={create}>Create class</Button>
          </>
        }
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Type">
            <Select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as ClassType })}>
              <option value="Theory">Theory</option>
              <option value="Revision">Revision</option>
              <option value="Paper">Paper</option>
            </Select>
          </Field>
          <Field label="Medium">
            <Select value={form.medium} onChange={(e) => setForm({ ...form, medium: e.target.value as Medium })}>
              <option value="Sinhala">Sinhala</option>
              <option value="English">English</option>
            </Select>
          </Field>
          <Field label="Batch name" className="sm:col-span-2">
            <Input value={form.batch} onChange={(e) => setForm({ ...form, batch: e.target.value })} placeholder="e.g. Batch C — Mon night" />
          </Field>
          <Field label="Monthly fee (LKR)">
            <Input type="number" value={form.monthlyFee} onChange={(e) => setForm({ ...form, monthlyFee: Number(e.target.value) })} />
          </Field>
          <Field label="Capacity">
            <Input type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })} />
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
          <Field label="Status">
            <Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as ClassStatus })}>
              <option value="open">Open</option>
              <option value="full">Full</option>
              <option value="closed">Closed</option>
            </Select>
          </Field>
          <div className="grid gap-3">
            <div className="flex items-center justify-between rounded-xl border border-border p-3">
              <span className="text-sm">Show on website</span>
              <Switch checked={form.shownOnWebsite} onChange={(v) => setForm({ ...form, shownOnWebsite: v })} />
            </div>
            <div className="flex items-center justify-between rounded-xl border border-border p-3">
              <span className="text-sm">Included with Theory</span>
              <Switch checked={form.includedWithTheory} onChange={(v) => setForm({ ...form, includedWithTheory: v })} />
            </div>
          </div>
          <Field label="Description (English)" className="sm:col-span-2">
            <Input value={form.descriptionEn} onChange={(e) => setForm({ ...form, descriptionEn: e.target.value })} />
          </Field>
          <Field label="Description (Sinhala)" className="sm:col-span-2">
            <Input value={form.descriptionSi} onChange={(e) => setForm({ ...form, descriptionSi: e.target.value })} />
          </Field>
        </div>
      </Modal>
    </div>
  );
}
