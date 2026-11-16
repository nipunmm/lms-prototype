"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { pick, missingLangs } from "@/lib/i18n";
import { shortDate } from "@/lib/format";
import { PageHeader, StatTile, SectionTitle } from "@/components/shared/page";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Field, Select, Textarea } from "@/components/ui/input";
import { Tabs } from "@/components/ui/tabs";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { Modal } from "@/components/ui/modal";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/shared/toast";
import { Plus, Trash2, Languages, Star, Quote, HelpCircle, Globe } from "lucide-react";
import type { Update } from "@/lib/types";

export default function StaffWebsitePage() {
  const db = useAppStore((s) => s.db);
  const updateTeacher = useAppStore((s) => s.updateTeacher);
  const addUpdate = useAppStore((s) => s.addUpdate);
  const toggleUpdatePublished = useAppStore((s) => s.toggleUpdatePublished);
  const deleteUpdate = useAppStore((s) => s.deleteUpdate);
  const approveTestimonial = useAppStore((s) => s.approveTestimonial);
  const approveResultWall = useAppStore((s) => s.approveResultWall);

  const [tab, setTab] = useState("profile");
  const [teacher, setTeacher] = useState(db.teacher);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ titleEn: "", titleSi: "", bodyEn: "", bodySi: "", kind: "update" as Update["kind"], eventDate: "", showFrom: "", showUntil: "" });

  const missing = [
    ...db.updates.filter((u) => missingLangs(u.title).length || missingLangs(u.body).length),
    ...db.testimonials.filter((t) => missingLangs(t.quote).length),
    ...db.faqs.filter((f) => missingLangs(f.question).length || missingLangs(f.answer).length),
  ].length;

  const saveTeacher = () => {
    updateTeacher(teacher);
    toast("Teacher profile saved.");
  };

  const create = () => {
    addUpdate({
      title: { en: form.titleEn, si: form.titleSi || form.titleEn },
      body: { en: form.bodyEn, si: form.bodySi || form.bodyEn },
      kind: form.kind,
      eventDate: form.kind === "event" ? form.eventDate || undefined : undefined,
      showFrom: form.showFrom || new Date().toISOString().slice(0, 10),
      showUntil: form.showUntil || new Date().toISOString().slice(0, 10),
      published: false,
    });
    toast("Update created as a draft.");
    setOpen(false);
    setForm({ titleEn: "", titleSi: "", bodyEn: "", bodySi: "", kind: "update", eventDate: "", showFrom: "", showUntil: "" });
  };

  return (
    <div>
      <PageHeader
        title="Website content"
        description="Everything visitors see on the public site, in both languages."
        actions={<Button onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> New update</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Updates" value={db.updates.length} icon={<Globe className="h-4 w-4" />} />
        <StatTile label="Published" value={db.updates.filter((u) => u.published).length} tone="success" />
        <StatTile label="Testimonials" value={db.testimonials.length} icon={<Quote className="h-4 w-4" />} />
        <StatTile label="Translation gaps" value={missing} tone={missing ? "warning" : "success"} icon={<Languages className="h-4 w-4" />} />
      </div>

      <Tabs
        className="mt-6"
        value={tab}
        onChange={setTab}
        tabs={[
          { value: "profile", label: "Teacher profile" },
          { value: "updates", label: "Updates", count: db.updates.length },
          { value: "testimonials", label: "Testimonials" },
          { value: "results", label: "Results wall" },
          { value: "faq", label: "FAQ" },
        ]}
      />

      {tab === "profile" ? (
        <Card className="mt-4">
          <CardContent className="pt-5">
            <SectionTitle title="Teacher profile" description="Shown on the About and home pages." />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Name"><Input value={teacher.name} onChange={(e) => setTeacher({ ...teacher, name: e.target.value })} /></Field>
              <Field label="Email"><Input value={teacher.email} onChange={(e) => setTeacher({ ...teacher, email: e.target.value })} /></Field>
              <Field label="Phone"><Input value={teacher.phone} onChange={(e) => setTeacher({ ...teacher, phone: e.target.value })} /></Field>
              <Field label="WhatsApp"><Input value={teacher.whatsapp} onChange={(e) => setTeacher({ ...teacher, whatsapp: e.target.value })} /></Field>
              <Field label="Facebook"><Input value={teacher.facebook} onChange={(e) => setTeacher({ ...teacher, facebook: e.target.value })} /></Field>
              <Field label="YouTube"><Input value={teacher.youtube} onChange={(e) => setTeacher({ ...teacher, youtube: e.target.value })} /></Field>
              <Field label="Experience (years)"><Input type="number" value={teacher.experienceYears} onChange={(e) => setTeacher({ ...teacher, experienceYears: Number(e.target.value) })} /></Field>
              <Field label="Students taught"><Input type="number" value={teacher.studentsTaught} onChange={(e) => setTeacher({ ...teacher, studentsTaught: Number(e.target.value) })} /></Field>
              <Field label="Headline (English)"><Input value={teacher.headline.en} onChange={(e) => setTeacher({ ...teacher, headline: { ...teacher.headline, en: e.target.value } })} /></Field>
              <Field label="Headline (Sinhala)"><Input value={teacher.headline.si} onChange={(e) => setTeacher({ ...teacher, headline: { ...teacher.headline, si: e.target.value } })} /></Field>
              <Field label="Story (English)" className="sm:col-span-2"><Textarea value={teacher.story.en} onChange={(e) => setTeacher({ ...teacher, story: { ...teacher.story, en: e.target.value } })} /></Field>
              <Field label="Story (Sinhala)" className="sm:col-span-2"><Textarea value={teacher.story.si} onChange={(e) => setTeacher({ ...teacher, story: { ...teacher.story, si: e.target.value } })} /></Field>
            </div>
            <Button className="mt-5" onClick={saveTeacher}>Save profile</Button>
          </CardContent>
        </Card>
      ) : tab === "updates" ? (
        <div className="mt-4 grid gap-3">
          {db.updates.map((u) => (
            <Card key={u.id}>
              <CardContent className="flex flex-wrap items-center justify-between gap-4 pt-5">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <Badge tone={u.kind === "event" ? "info" : "default"}>{u.kind}</Badge>
                    <p className="font-medium">{pick(u.title, "en")}</p>
                  </div>
                  <p className="mt-1 line-clamp-2 max-w-2xl text-sm text-muted-foreground">{pick(u.body, "en")}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {shortDate(u.showFrom)} → {shortDate(u.showUntil)}
                    {u.eventDate ? ` · event ${shortDate(u.eventDate)}` : ""}
                    {missingLangs(u.title).length || missingLangs(u.body).length ? " · missing translation" : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={u.published} onChange={() => { toggleUpdatePublished(u.id); toast(u.published ? "Unpublished." : "Published."); }} />
                  <Button size="sm" variant="ghost" onClick={() => { deleteUpdate(u.id); toast("Update deleted."); }}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : tab === "testimonials" ? (
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {db.testimonials.map((t) => (
            <Card key={t.id}>
              <CardContent className="pt-5">
                <Quote className="h-5 w-5 text-primary" />
                <p className="mt-2 text-sm">{pick(t.quote, "en")}</p>
                <p className="mt-1 text-sm text-muted-foreground">{pick(t.quote, "si")}</p>
                <div className="mt-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{t.studentName}</p>
                    <div className="mt-1 flex gap-1">
                      {t.video ? <Badge tone="info">video</Badge> : null}
                      {t.permissionHeld ? <Badge tone="success">permission held</Badge> : <Badge tone="danger">no permission</Badge>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{t.approved ? "approved" : "pending"}</span>
                    <Switch checked={t.approved} onChange={(v) => { approveTestimonial(t.id, v); toast(v ? "Testimonial approved." : "Testimonial hidden."); }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : tab === "results" ? (
        <Card className="mt-4">
          <Table>
            <THead><TR><TH>Student</TH><TH>Achievement</TH><TH>Year</TH><TH>Approved</TH></TR></THead>
            <TBody>
              {db.resultsWall.map((r) => (
                <TR key={r.id}>
                  <TD className="font-medium">{r.studentName}</TD>
                  <TD className="text-sm text-muted-foreground">{pick(r.achievement, "en")}</TD>
                  <TD className="text-sm">{r.year}</TD>
                  <TD>
                    <Switch checked={r.approved} onChange={(v) => { approveResultWall(r.id, v); toast(v ? "Shown on the wall." : "Hidden from the wall."); }} />
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </Card>
      ) : (
        <div className="mt-4 grid gap-3">
          {db.faqs.map((f) => (
            <Card key={f.id}>
              <CardContent className="pt-5">
                <div className="flex items-start gap-2">
                  <HelpCircle className="mt-0.5 h-4 w-4 text-primary" />
                  <div>
                    <p className="font-medium">{pick(f.question, "en")}</p>
                    <p className="text-sm text-muted-foreground">{pick(f.question, "si")}</p>
                    <p className="mt-2 text-sm">{pick(f.answer, "en")}</p>
                    <p className="text-sm text-muted-foreground">{pick(f.answer, "si")}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          <p className="flex items-center gap-2 text-xs text-muted-foreground">
            <Star className="h-3.5 w-3.5" /> FAQ editing is a future feature; the seeded questions are shown as-is.
          </p>
        </div>
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="New update or event"
        className="max-w-xl"
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button disabled={!form.titleEn} onClick={create}>Create draft</Button>
          </>
        }
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Kind">
            <Select value={form.kind} onChange={(e) => setForm({ ...form, kind: e.target.value as Update["kind"] })}>
              <option value="update">Update</option>
              <option value="event">Event</option>
            </Select>
          </Field>
          {form.kind === "event" ? (
            <Field label="Event date"><Input type="date" value={form.eventDate} onChange={(e) => setForm({ ...form, eventDate: e.target.value })} /></Field>
          ) : <div />}
          <Field label="Title (English)"><Input value={form.titleEn} onChange={(e) => setForm({ ...form, titleEn: e.target.value })} /></Field>
          <Field label="Title (Sinhala)"><Input value={form.titleSi} onChange={(e) => setForm({ ...form, titleSi: e.target.value })} /></Field>
          <Field label="Body (English)" className="sm:col-span-2"><Textarea value={form.bodyEn} onChange={(e) => setForm({ ...form, bodyEn: e.target.value })} /></Field>
          <Field label="Body (Sinhala)" className="sm:col-span-2"><Textarea value={form.bodySi} onChange={(e) => setForm({ ...form, bodySi: e.target.value })} /></Field>
          <Field label="Show from"><Input type="date" value={form.showFrom} onChange={(e) => setForm({ ...form, showFrom: e.target.value })} /></Field>
          <Field label="Show until"><Input type="date" value={form.showUntil} onChange={(e) => setForm({ ...form, showUntil: e.target.value })} /></Field>
        </div>
      </Modal>
    </div>
  );
}
