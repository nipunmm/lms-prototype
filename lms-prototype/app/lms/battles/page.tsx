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
import { Swords, Bot, User, CheckCircle2 } from "lucide-react";

export default function BattlesPage() {
  const db = useAppStore((s) => s.db);
  const lmsLang = useAppStore((s) => s.lmsLang);
  const battleScore = useAppStore((s) => s.battleScore);
  const setBattleScore = useAppStore((s) => s.setBattleScore);
  const t = useT(lmsLang);

  const [started, setStarted] = useState(false);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [oppScore, setOppScore] = useState(0);

  const questions = db.dailyQuestions.slice(0, 3);
  const q = questions[idx];
  const opponent = lmsLang === "si" ? "AI එකක් (දැන්)" : "The system (now)";

  const answer = (i: number) => {
    const correct = i === q.answer;
    const ns = score + (correct ? 1 : 0);
    const no = oppScore + (Math.random() > 0.5 ? 1 : 0);
    setScore(ns);
    setOppScore(no);
    if (idx + 1 >= questions.length) {
      setBattleScore(ns);
      setStarted(false);
      toast(ns > no ? (lmsLang === "si" ? "ඔබ දිනුවා! 🎉" : "You won! 🎉") : ns === no ? (lmsLang === "si" ? "සමයි!" : "It's a tie!") : (lmsLang === "si" ? "පරාජය — නැවත උත්සාහ කරන්න." : "You lost — try again."));
    } else {
      setIdx((x) => x + 1);
    }
  };

  const start = () => {
    setStarted(true);
    setIdx(0);
    setScore(0);
    setOppScore(0);
  };

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title={t("lms.nav.battles")} description={lmsLang === "si" ? "සිසුවා vs පද්ධතිය හෝ මිතුරෙකු." : "Student vs the system or a friend."} />

      <div className="mb-4 flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2 text-sm">
          <User className="h-4 w-4 text-primary" /> {lmsLang === "si" ? "ඔබ" : "You"}: <span className="font-bold">{score}</span>
        </div>
        <Swords className="h-5 w-5 text-muted-foreground" />
        <div className="flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2 text-sm">
          <Bot className="h-4 w-4 text-danger" /> {opponent}: <span className="font-bold">{oppScore}</span>
        </div>
      </div>

      {!started ? (
        <Card>
          <CardContent className="pt-8 text-center">
            <Swords className="mx-auto h-10 w-10 text-primary" />
            <p className="mt-3 font-semibold">{lmsLang === "si" ? "ප්‍රශ්න සටනක් ආරම්භ කරන්න" : "Start a quiz battle"}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {lmsLang === "si" ? `${questions.length} ප්‍රශ්න · අඛණ්ඩතාව සහ ලකුණු උපයන්න` : `${questions.length} questions · earn points and keep your streak`}
            </p>
            {battleScore !== null ? (
              <Badge tone="info" className="mt-3">{lmsLang === "si" ? "අවසන් ලකුණු" : "Last score"}: {battleScore}</Badge>
            ) : null}
            <div className="mt-5 flex justify-center gap-2">
              <Button onClick={start}>{lmsLang === "si" ? "ආරම්භ කරන්න" : "Start battle"}</Button>
              <Button variant="outline" onClick={() => toast(lmsLang === "si" ? "මිතුරෙකුට ආරාධනා යවන ලදී (නිදර්ශනය)." : "Invite sent to a friend (demo).", "info")}>
                {lmsLang === "si" ? "මිතුරෙකුට අභියෝග කරන්න" : "Challenge a friend"}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-5">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{lmsLang === "si" ? "ප්‍රශ්නය" : "Question"} {idx + 1} / {questions.length}</span>
            </div>
            <Progress className="mt-2" value={(idx / questions.length) * 100} />
            <h2 className="mt-5 text-lg font-semibold">{pick(q.text, lmsLang)}</h2>
            <div className="mt-4 grid gap-2">
              {q.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => answer(i)}
                  className="flex items-center gap-3 rounded-xl border border-border px-4 py-3 text-left text-sm hover:bg-muted"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full border border-border text-xs font-semibold">
                    {String.fromCharCode(65 + i)}
                  </span>
                  {pick(opt, lmsLang)}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
        <CheckCircle2 className="h-3.5 w-3.5" /> {lmsLang === "si" ? "මෙය දැනට නිදර්ශන ප්‍රකාරයේ ඇත; සැබෑ ප්‍රතිවාදියා පසුව එක් වේ." : "This is in demo mode; real opponents come later."}
      </p>
    </div>
  );
}
