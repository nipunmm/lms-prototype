"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { shortDate, uid } from "@/lib/format";
import { PageHeader, StatTile, SectionTitle } from "@/components/shared/page";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Field, Select } from "@/components/ui/input";
import { Tabs } from "@/components/ui/tabs";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { Modal } from "@/components/ui/modal";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/shared/toast";
import { Plus, FileText, Video, FileDown, Eye, Lock } from "lucide-react";
import type { ClassType, ContentItem, ContentKind, Medium } from "@/lib/types";

const kindIcon = { note: FileText, video: Video, paper: FileDown, pastpaper: FileDown } as const;
const allTypes: ClassType[] = ["Theory", "Revision", "Paper"];

export default function StaffContentPage() {
  const db = useAppStore((s) => s.db);
  const addContent = useAppStore((s) => s.addContent);
  const toggleContentActive = useAppStore((s) => s.toggleContentActive);

  const [kind, setKind] = useState("all");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    topic: "",
    kind: "note" as ContentKind,
    language: "Sinhala" as Medium,
    classOnly: true,
    viewOnly: false,
    forTypes: ["Theory"] as ClassType[],
    url: "",
  });

  const items = db.content.filter((c) => kind === "all" || c.kind === kind);

  const toggleType = (t: ClassType) => {
    setForm((f) => ({
      ...f,
      forTypes: f.forTypes.includes(t) ? f.forTypes.filter((x) => x !== t) : [...f.forTypes, t],
    }));
  };

  const create = () => {
    const c: ContentItem = {
      id: uid("ct"),
      subject: "Combined Mathematics",
      topic: form.topic,
      kind: form.kind,
      language: form.language,
      classOnly: form.classOnly,
      viewOnly: form.viewOnly,
      url: form.url || undefined,
      releaseDate: new Date().toISOString().slice(0, 10),
      active: true,
      forTypes: form.forTypes,
    };
    addContent(c);
    toast(`${form.topic} added to material.`);
    setOpen(false);
    setForm({ topic: "", kind: "note", language: "Sinhala", classOnly: true, viewOnly: false, forTypes: ["Theory"], url: "" });
  };

  return (
    <div>
      <PageHeader
        title="Content & material"
        description="Notes, videos and papers. Class-only items are hidden from non-members."
        actions={<Button onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> Add material</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Items" value={db.content.length} />
        <StatTile label="Notes" value={db.content.filter((c) => c.kind === "note").length} tone="success" />
        <StatTile label="Videos" value={db.content.filter((c) => c.kind === "video").length} />
        <StatTile label="Past papers" value={db.content.filter((c) => c.kind === "pastpaper").length} tone="warning" />
      </div>

      <Tabs
        className="mt-6"
        value={kind}
        onChange={setKind}
        tabs={[
          { value: "all", label: "All" },
          { value: "note", label: "Notes" },
          { value: "video", label: "Videos" },
          { value: "paper", label: "Papers" },
          { value: "pastpaper", label: "Past papers" },
        ]}
      />

      <Card className="mt-4">
        <Table>
          <THead>
            <TR>
              <TH>Topic</TH>
              <TH>Kind</TH>
              <TH>Language</TH>
              <TH>For</TH>
              <TH>Access</TH>
              <TH>Released</TH>
              <TH>Active</TH>
            </TR>
          </THead>
          <TBody>
            {items.map((c) => {
              const Icon = kindIcon[c.kind];
              return (
                <TR key={c.id}>
                  <TD>
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-primary" />
                      <span className="font-medium">{c.topic}</span>
                    </div>
                  </TD>
                  <TD className="capitalize text-sm text-muted-foreground">{c.kind}</TD>
                  <TD className="text-sm text-muted-foreground">{c.language}</TD>
                  <TD>
                    <div className="flex flex-wrap gap-1">
                      {c.forTypes.map((t) => <Badge key={t} tone="muted">{t}</Badge>)}
                    </div>
                  </TD>
                  <TD>
                    <div className="flex flex-wrap gap-1">
                      {c.classOnly ? <Badge tone="default"><Lock className="h-3 w-3" /> class only</Badge> : <Badge tone="success">free</Badge>}
                      {c.viewOnly ? <Badge tone="muted"><Eye className="h-3 w-3" /> view only</Badge> : null}
                    </div>
                  </TD>
                  <TD className="text-sm text-muted-foreground">{c.releaseDate ? shortDate(c.releaseDate) : "—"}</TD>
                  <TD>
                    <Switch
                      checked={c.active}
                      onChange={() => { toggleContentActive(c.id); toast(`${c.topic} ${c.active ? "hidden" : "published"}.`); }}
                    />
                  </TD>
                </TR>
              );
            })}
          </TBody>
        </Table>
      </Card>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Add material"
        className="max-w-xl"
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button disabled={!form.topic || form.forTypes.length === 0} onClick={create}>Add material</Button>
          </>
        }
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Topic" className="sm:col-span-2"><Input value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} placeholder="e.g. Complex numbers — notes" /></Field>
          <Field label="Kind">
            <Select value={form.kind} onChange={(e) => setForm({ ...form, kind: e.target.value as ContentKind })}>
              <option value="note">Note</option>
              <option value="video">Video</option>
              <option value="paper">Paper</option>
              <option value="pastpaper">Past paper</option>
            </Select>
          </Field>
          <Field label="Language">
            <Select value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value as Medium })}>
              <option value="Sinhala">Sinhala</option>
              <option value="English">English</option>
            </Select>
          </Field>
          <Field label="Link (optional)" className="sm:col-span-2"><Input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://..." /></Field>
          <div className="sm:col-span-2">
            <p className="mb-1.5 text-sm font-medium">Available for</p>
            <div className="flex flex-wrap gap-2">
              {allTypes.map((t) => (
                <button
                  key={t}
                  onClick={() => toggleType(t)}
                  className={`rounded-lg border px-3 py-1.5 text-sm ${form.forTypes.includes(t) ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-border p-3">
            <span className="text-sm">Class only</span>
            <Switch checked={form.classOnly} onChange={(v) => setForm({ ...form, classOnly: v })} />
          </div>
          <div className="flex items-center justify-between rounded-xl border border-border p-3">
            <span className="text-sm">View only</span>
            <Switch checked={form.viewOnly} onChange={(v) => setForm({ ...form, viewOnly: v })} />
          </div>
        </div>
      </Modal>
    </div>
  );
}
