"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { useT, pick } from "@/lib/i18n";
import { PageHeader } from "@/components/shared/page";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/shared/toast";
import { CheckCircle2, XCircle, RotateCcw, ListChecks } from "lucide-react";

export default function QuizzesPage() {
  const db = useAppStore((s) => s.db);
  const lmsLang = useAppStore((s) => s.lmsLang);
  const t = useT(lmsLang);

  const [idx, setIdx] = useState(0);
  const [choice, setChoice] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const questions = db.dailyQuestions;
  const q = questions[idx];

  const check = () => {
    if (choice === null) return;
    if (choice === q.answer) setScore((s) => s + 1);
  };

  const next = () => {
    if (idx + 1 >= questions.length) {
      setDone(true);
    } else {
      setIdx((i) => i + 1);
      setChoice(null);
    }
  };

  const restart = () => {
    setIdx(0);
    setChoice(null);
    setScore(0);
    setDone(false);
  };

  const revealed = choice !== null && choice !== undefined && (idx < questions.length);

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title={t("lms.nav.quizzes")} description={lmsLang === "si" ? "කෙටි ප්‍රශ්නාවලි — පුහුණුව සඳහා." : "Short quizzes — for practice."} />

      {done ? (
        <Card>
          <CardContent className="pt-8 text-center">
            <ListChecks className="mx-auto h-10 w-10 text-primary" />
            <p className="mt-3 text-2xl font-bold">{score} / {questions.length}</p>
            <p className="text-sm text-muted-foreground">{lmsLang === "si" ? "හොඳයි! නැවත උත්සාහ කරන්න." : "Well done! Try again to improve."}</p>
            <div className="mt-5 flex justify-center gap-2">
              <Button onClick={restart}><RotateCcw className="h-4 w-4" /> {lmsLang === "si" ? "නැවත" : "Restart"}</Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-5">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{lmsLang === "si" ? "ප්‍රශ්නය" : "Question"} {idx + 1} / {questions.length}</span>
              <Badge tone="default">{score} {lmsLang === "si" ? "ලකුණු" : "pts"}</Badge>
            </div>
            <Progress className="mt-2" value={((idx) / questions.length) * 100} />

            <h2 className="mt-5 text-lg font-semibold">{pick(q.text, lmsLang)}</h2>
            <div className="mt-4 grid gap-2">
              {q.options.map((opt, i) => {
                const chosen = choice === i;
                const correct = q.answer === i;
                return (
                  <button
                    key={i}
                    disabled={choice !== null}
                    onClick={() => setChoice(i)}
                    className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm ${
                      revealed && correct
                        ? "border-success bg-success/10"
                        : revealed && chosen
                          ? "border-danger bg-danger/10"
                          : chosen
                            ? "border-primary bg-primary/5"
                            : "border-border hover:bg-muted"
                    }`}
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-full border border-border text-xs font-semibold">
                      {String.fromCharCode(65 + i)}
                    </span>
                    {pick(opt, lmsLang)}
                    {revealed && correct ? <CheckCircle2 className="ml-auto h-4 w-4 text-success" /> : null}
                    {revealed && chosen && !correct ? <XCircle className="ml-auto h-4 w-4 text-danger" /> : null}
                  </button>
                );
              })}
            </div>

            {revealed ? (
              <div className="mt-4 rounded-xl border border-border bg-muted/50 p-3 text-sm text-muted-foreground">
                {pick(q.explanation, lmsLang)}
              </div>
            ) : null}

            <div className="mt-5">
              {choice === null ? (
                <Button className="w-full" disabled={choice === null} onClick={check}>{lmsLang === "si" ? "පිළිතුරු දෙන්න" : "Answer"}</Button>
              ) : (
                <Button className="w-full" onClick={next}>{idx + 1 >= questions.length ? (lmsLang === "si" ? "අවසන් කරන්න" : "Finish") : (lmsLang === "si" ? "ඊළඟ" : "Next")}</Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <p className="mt-4 text-xs text-muted-foreground">
        {lmsLang === "si" ? "පුහුණු ප්‍රශ්නාවලි නොමිලේ — ඕනෑම සිසුවෙකුට." : "Practice quizzes are free for every student."}
      </p>
    </div>
  );
}
