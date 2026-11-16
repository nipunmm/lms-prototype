"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { pick } from "@/lib/i18n";
import { uid } from "@/lib/format";
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
import { Plus, ClipboardList, PencilLine, Check } from "lucide-react";
import type { ClassType, Exam, ExamResult } from "@/lib/types";

export default function StaffAssessmentsPage() {
  const db = useAppStore((s) => s.db);
  const toggleExamPublished = useAppStore((s) => s.toggleExamPublished);
  const addExam = useAppStore((s) => s.addExam);
  const markResult = useAppStore((s) => s.markResult);

  const [tab, setTab] = useState("exams");
  const [open, setOpen] = useState(false);
  const [examId, setExamId] = useState(db.exams[0]?.id ?? "");
  const [marking, setMarking] = useState<ExamResult | null>(null);
  const [markForm, setMarkForm] = useState({ mcqMark: 0, paperMark: 0, comment: "" });

  const [form, setForm] = useState({
    titleEn: "",
    titleSi: "",
    type: "Theory" as ClassType,
    mode: "mcq" as Exam["mode"],
    durationMins: 45,
    totalMarks: 20,
  });

  const exam = db.exams.find((e) => e.id === examId);
  const results = db.results.filter((r) => r.examId === examId);

  const create = () => {
    const e: Exam = {
      id: uid("ex"),
      title: { en: form.titleEn, si: form.titleSi || form.titleEn },
      subject: "Combined Mathematics",
      type: form.type,
      mode: form.mode,
      durationMins: Number(form.durationMins),
      published: false,
      totalMarks: Number(form.totalMarks),
    };
    addExam(e);
    toast("Exam created as a draft.");
    setOpen(false);
    setExamId(e.id);
    setTab("exams");
  };

  const openMark = (r: ExamResult) => {
    setMarking(r);
    setMarkForm({ mcqMark: r.mcqMark, paperMark: r.paperMark, comment: r.comment ?? "" });
  };

  return (
    <div>
      <PageHeader
        title="Assessments"
        description="Create exams, publish them to students, and mark written answers."
        actions={<Button onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> New exam</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Exams" value={db.exams.length} icon={<ClipboardList className="h-4 w-4" />} />
        <StatTile label="Published" value={db.exams.filter((e) => e.published).length} tone="success" />
        <StatTile label="Submissions" value={db.results.length} />
        <StatTile label="Awaiting marking" value={db.results.filter((r) => r.submitted && !r.marked).length} tone="warning" />
      </div>

      <Tabs
        className="mt-6"
        value={tab}
        onChange={setTab}
        tabs={[
          { value: "exams", label: "Exams", count: db.exams.length },
          { value: "marking", label: "Marking", count: db.results.filter((r) => r.submitted && !r.marked).length },
        ]}
      />

      {tab === "exams" ? (
        <Card className="mt-4">
          <Table>
            <THead>
              <TR><TH>Exam</TH><TH>Type</TH><TH>Mode</TH><TH>Marks</TH><TH>Duration</TH><TH>Submissions</TH><TH>Published</TH></TR>
            </THead>
            <TBody>
              {db.exams.map((e) => (
                <TR key={e.id}>
                  <TD className="font-medium">{pick(e.title, "en")}</TD>
                  <TD className="text-sm text-muted-foreground">{e.type}</TD>
                  <TD><Badge tone={e.mode === "mcq" ? "info" : "default"}>{e.mode === "mcq" ? "MCQ" : "Written"}</Badge></TD>
                  <TD className="text-sm">{e.totalMarks}</TD>
                  <TD className="text-sm text-muted-foreground">{e.durationMins} min</TD>
                  <TD className="text-sm">{db.results.filter((r) => r.examId === e.id).length}</TD>
                  <TD>
                    <Switch
                      checked={e.published}
                      onChange={() => { toggleExamPublished(e.id); toast(`${pick(e.title, "en")} ${e.published ? "unpublished" : "published"}.`); }}
                    />
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </Card>
      ) : (
        <div className="mt-4">
          <div className="mb-4 max-w-sm">
            <Field label="Exam">
              <Select value={examId} onChange={(e) => setExamId(e.target.value)}>
                {db.exams.map((e) => <option key={e.id} value={e.id}>{pick(e.title, "en")}</option>)}
              </Select>
            </Field>
          </div>

          {exam ? (
            <>
              <SectionTitle
                title={pick(exam.title, "en")}
                description={`${exam.mode === "mcq" ? "MCQ — auto marked" : "Written — manual marking"} · out of ${exam.totalMarks}`}
              />
              <Card>
                <Table>
                  <THead>
                    <TR><TH>Student</TH><TH>MCQ</TH><TH>Paper</TH><TH>Status</TH><TH>Comment</TH><TH /></TR>
                  </THead>
                  <TBody>
                    {results.map((r) => {
                      const st = db.students.find((s) => s.id === r.studentId);
                      return (
                        <TR key={r.id}>
                          <TD className="font-medium">{st?.name ?? r.studentId}</TD>
                          <TD className="text-sm">{exam.mode === "mcq" ? r.mcqMark : "—"}</TD>
                          <TD className="text-sm">{exam.mode === "written" ? r.paperMark : "—"}</TD>
                          <TD>
                            {r.marked ? <Badge tone="success"><Check className="h-3 w-3" /> marked</Badge> : <Badge tone="warning">awaiting</Badge>}
                          </TD>
                          <TD className="max-w-[220px] truncate text-sm text-muted-foreground">{r.comment ?? "—"}</TD>
                          <TD>
                            <Button size="sm" variant="outline" onClick={() => openMark(r)}>
                              <PencilLine className="h-3.5 w-3.5" /> {r.marked ? "Edit" : "Mark"}
                            </Button>
                          </TD>
                        </TR>
                      );
                    })}
                  </TBody>
                </Table>
              </Card>
              {results.length === 0 ? <p className="mt-3 text-sm text-muted-foreground">No submissions yet.</p> : null}
            </>
          ) : (
            <p className="text-sm text-muted-foreground">Create an exam first.</p>
          )}
        </div>
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Create an exam"
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button disabled={!form.titleEn} onClick={create}>Create draft</Button>
          </>
        }
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Title (English)" className="sm:col-span-2"><Input value={form.titleEn} onChange={(e) => setForm({ ...form, titleEn: e.target.value })} /></Field>
          <Field label="Title (Sinhala)" className="sm:col-span-2"><Input value={form.titleSi} onChange={(e) => setForm({ ...form, titleSi: e.target.value })} /></Field>
          <Field label="Class type">
            <Select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as ClassType })}>
              <option value="Theory">Theory</option>
              <option value="Revision">Revision</option>
              <option value="Paper">Paper</option>
            </Select>
          </Field>
          <Field label="Mode">
            <Select value={form.mode} onChange={(e) => setForm({ ...form, mode: e.target.value as Exam["mode"] })}>
              <option value="mcq">MCQ (auto marked)</option>
              <option value="written">Written (manual)</option>
            </Select>
          </Field>
          <Field label="Duration (minutes)"><Input type="number" value={form.durationMins} onChange={(e) => setForm({ ...form, durationMins: Number(e.target.value) })} /></Field>
          <Field label="Total marks"><Input type="number" value={form.totalMarks} onChange={(e) => setForm({ ...form, totalMarks: Number(e.target.value) })} /></Field>
        </div>
      </Modal>

      <Modal
        open={!!marking}
        onClose={() => setMarking(null)}
        title="Mark submission"
        description={marking ? db.students.find((s) => s.id === marking.studentId)?.name : ""}
        footer={
          <>
            <Button variant="ghost" onClick={() => setMarking(null)}>Cancel</Button>
            <Button
              onClick={() => {
                if (marking) {
                  markResult(marking.id, { mcqMark: Number(markForm.mcqMark), paperMark: Number(markForm.paperMark), comment: markForm.comment, marked: true });
                  toast("Marks saved.");
                }
                setMarking(null);
              }}
            >
              Save marks
            </Button>
          </>
        }
      >
        <div className="grid gap-3 sm:grid-cols-2">
          {exam?.mode === "mcq" ? (
            <Field label={`MCQ mark (out of ${exam.totalMarks})`} className="sm:col-span-2">
              <Input type="number" value={markForm.mcqMark} onChange={(e) => setMarkForm({ ...markForm, mcqMark: Number(e.target.value) })} />
            </Field>
          ) : (
            <Field label={`Paper mark (out of ${exam?.totalMarks ?? 100})`} className="sm:col-span-2">
              <Input type="number" value={markForm.paperMark} onChange={(e) => setMarkForm({ ...markForm, paperMark: Number(e.target.value) })} />
            </Field>
          )}
          <Field label="Comment for the student" className="sm:col-span-2">
            <Textarea value={markForm.comment} onChange={(e) => setMarkForm({ ...markForm, comment: e.target.value })} placeholder="Feedback on their answer..." />
          </Field>
        </div>
      </Modal>
    </div>
  );
}
