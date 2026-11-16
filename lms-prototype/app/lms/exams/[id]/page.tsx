"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { useT, pick } from "@/lib/i18n";
import { PageHeader } from "@/components/shared/page";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/shared/toast";
import { Clock, CheckCircle2, XCircle, ArrowLeft } from "lucide-react";

const demoQuestions = [
  {
    text: { en: "If y = 3x² + 2x, what is dy/dx?", si: "y = 3x² + 2x නම්, dy/dx කුමක්ද?" },
    options: [
      { en: "6x + 2", si: "6x + 2" },
      { en: "3x + 2", si: "3x + 2" },
      { en: "6x", si: "6x" },
      { en: "6x² + 2", si: "6x² + 2" },
    ],
    answer: 0,
  },
  {
    text: { en: "The value of ∫₀¹ 2x dx is:", si: "∫₀¹ 2x dx හි අගය:" },
    options: [
      { en: "0", si: "0" },
      { en: "1", si: "1" },
      { en: "2", si: "2" },
      { en: "1/2", si: "1/2" },
    ],
    answer: 1,
  },
  {
    text: { en: "Two vectors are perpendicular when their dot product is:", si: "දෛශික දෙකක් ලම්බක වන්නේ ඒවායේ අදිශ ගුණිතය:" },
    options: [
      { en: "1", si: "1" },
      { en: "-1", si: "-1" },
      { en: "0", si: "0" },
      { en: "undefined", si: "අර්ථ දක්වා නැති" },
    ],
    answer: 2,
  },
];

export default function ExamDetailPage() {
  const params = useParams<{ id: string }>();
  const db = useAppStore((s) => s.db);
  const lmsLang = useAppStore((s) => s.lmsLang);
  const t = useT(lmsLang);
  const exam = db.exams.find((e) => e.id === params.id);

  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  if (!exam) {
    return (
      <div>
        <PageHeader title="Exam not found" />
        <Link href="/lms/exams"><Button variant="outline"><ArrowLeft className="h-4 w-4" /> {t("common.back")}</Button></Link>
      </div>
    );
  }

  const score = demoQuestions.reduce((s, q, i) => s + (answers[i] === q.answer ? 1 : 0), 0);
  const mark = Math.round((score / demoQuestions.length) * exam.totalMarks);

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/lms/exams" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> {t("common.back")}
      </Link>
      <PageHeader
        title={pick(exam.title, lmsLang)}
        description={`${exam.type} · ${exam.durationMins} ${lmsLang === "si" ? "විනාඩි" : "min"} · ${exam.totalMarks} marks`}
        actions={!submitted ? <Badge tone="warning"><Clock className="h-3 w-3" /> 44:59</Badge> : undefined}
      />

      {submitted ? (
        <Card className="mb-6 border-success/40 bg-success/5">
          <CardContent className="pt-5 text-center">
            <CheckCircle2 className="mx-auto h-10 w-10 text-success" />
            <p className="mt-3 text-2xl font-bold">{mark} / {exam.totalMarks}</p>
            <p className="text-sm text-muted-foreground">
              {lmsLang === "si" ? `ඔබ ${demoQuestions.length} න් ${score} ක් නිවැරදි කළා.` : `You got ${score} of ${demoQuestions.length} correct.`}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="mb-6">
          <CardContent className="pt-5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{lmsLang === "si" ? "පිළිතුරු දුන් ප්‍රශ්න" : "Answered"}: {Object.keys(answers).length}/{demoQuestions.length}</span>
            </div>
            <Progress className="mt-2" value={(Object.keys(answers).length / demoQuestions.length) * 100} />
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {demoQuestions.map((q, qi) => (
          <Card key={qi}>
            <CardContent className="pt-5">
              <p className="font-medium">{qi + 1}. {pick(q.text, lmsLang)}</p>
              <div className="mt-3 grid gap-2">
                {q.options.map((opt, oi) => {
                  const chosen = answers[qi] === oi;
                  const correct = q.answer === oi;
                  return (
                    <button
                      key={oi}
                      disabled={submitted}
                      onClick={() => setAnswers((a) => ({ ...a, [qi]: oi }))}
                      className={`flex items-center gap-3 rounded-xl border px-4 py-2.5 text-left text-sm ${
                        submitted && correct
                          ? "border-success bg-success/10"
                          : submitted && chosen
                            ? "border-danger bg-danger/10"
                            : chosen
                              ? "border-primary bg-primary/5"
                              : "border-border hover:bg-muted"
                      }`}
                    >
                      <span className="flex h-6 w-6 items-center justify-center rounded-full border border-border text-xs font-semibold">
                        {String.fromCharCode(65 + oi)}
                      </span>
                      {pick(opt, lmsLang)}
                      {submitted && correct ? <CheckCircle2 className="ml-auto h-4 w-4 text-success" /> : null}
                      {submitted && chosen && !correct ? <XCircle className="ml-auto h-4 w-4 text-danger" /> : null}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 flex gap-3">
        {!submitted ? (
          <Button
            size="lg"
            disabled={Object.keys(answers).length < demoQuestions.length}
            onClick={() => {
              setSubmitted(true);
              toast(lmsLang === "si" ? "විභාගය ඉදිරිපත් කරන ලදී (නිදර්ශනය)." : "Exam submitted (demo).");
            }}
          >
            {lmsLang === "si" ? "විභාගය ඉදිරිපත් කරන්න" : "Submit exam"}
          </Button>
        ) : (
          <Link href="/lms/exams"><Button variant="outline">{t("common.back")}</Button></Link>
        )}
      </div>
    </div>
  );
}
