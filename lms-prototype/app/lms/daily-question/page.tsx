"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { useT, pick } from "@/lib/i18n";
import { PageHeader, StatTile } from "@/components/shared/page";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/shared/toast";
import { CheckCircle2, XCircle, Flame, Share2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function DailyQuestionPage() {
  const db = useAppStore((s) => s.db);
  const lmsLang = useAppStore((s) => s.lmsLang);
  const studentId = useAppStore((s) => s.currentStudentId);
  const answered = useAppStore((s) => s.dailyAnswer);
  const answerDaily = useAppStore((s) => s.answerDaily);
  const t = useT(lmsLang);
  const [choice, setChoice] = useState<number | null>(null);

  const student = db.students.find((s) => s.id === studentId)!;
  const q = db.dailyQuestions[0];

  const submit = () => {
    if (choice === null) return;
    answerDaily(choice);
    toast(lmsLang === "si" ? "පිළිතුර සුරකින ලදී!" : "Answer saved!");
  };

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title={t("lms.nav.daily")}
        description={lmsLang === "si" ? "දිනපතා ප්‍රශ්නයක්, අඛණ්ඩතාවක් සහ දියුණුවක්." : "One question a day, a streak, and steady progress."}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatTile label={t("lms.growth.streak")} value={`${student.streak} 🔥`} icon={<Flame className="h-4 w-4" />} tone="warning" />
        <StatTile label={t("lms.growth.best")} value={student.bestStreak} />
        <StatTile label={t("lms.growth.points")} value={student.points} tone="success" />
      </div>

      <Card className="mt-6">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <Badge tone="default">{lmsLang === "si" ? "අද ප්‍රශ්නය" : "Today's question"}</Badge>
            <span className="text-xs text-muted-foreground">+10 {t("lms.growth.points")}</span>
          </div>
          <h2 className="mt-4 text-lg font-semibold">{pick(q.text, lmsLang)}</h2>

          <div className="mt-4 grid gap-2">
            {q.options.map((opt, i) => {
              const isChosen = choice === i;
              const revealed = answered !== null;
              const isCorrect = i === q.answer;
              return (
                <button
                  key={i}
                  disabled={revealed}
                  onClick={() => setChoice(i)}
                  className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
                    revealed && isCorrect
                      ? "border-success bg-success/10"
                      : revealed && isChosen
                        ? "border-danger bg-danger/10"
                        : isChosen
                          ? "border-primary bg-primary/5"
                          : "border-border hover:bg-muted"
                  }`}
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full border border-border text-xs font-semibold">
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span>{pick(opt, lmsLang)}</span>
                  {revealed && isCorrect ? <CheckCircle2 className="ml-auto h-4 w-4 text-success" /> : null}
                  {revealed && isChosen && !isCorrect ? <XCircle className="ml-auto h-4 w-4 text-danger" /> : null}
                </button>
              );
            })}
          </div>

          {answered === null ? (
            <Button className="mt-5 w-full" disabled={choice === null} onClick={submit}>
              {lmsLang === "si" ? "ඉදිරිපත් කරන්න" : "Submit answer"}
            </Button>
          ) : (
            <div className="mt-5 rounded-xl border border-border bg-muted/50 p-4">
              <p className={`font-semibold ${answered.correct ? "text-success" : "text-danger"}`}>
                {answered.correct ? (lmsLang === "si" ? "නිවැරදි!" : "Correct!") : (lmsLang === "si" ? "වැරදි" : "Not quite")}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{pick(q.explanation, lmsLang)}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <Button variant="outline" onClick={() => toast(lmsLang === "si" ? "Share card සාදන ලදී (නිදර්ශනය)." : "Share card created (demo).", "info")}>
          <Share2 className="h-4 w-4" /> {lmsLang === "si" ? "ප්‍රතිඵල කාඩ්පත බෙදාගන්න" : "Share result card"}
        </Button>
        <Link href="/lms/growth">
          <Button variant="secondary" className="w-full">
            {t("lms.growth.title")} <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
