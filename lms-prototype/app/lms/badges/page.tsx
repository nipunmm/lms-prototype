"use client";

import { useAppStore } from "@/lib/store";
import { useT } from "@/lib/i18n";
import { PageHeader } from "@/components/shared/page";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Award, Flame, Coins, Target, Star, Zap, BookOpen, Trophy } from "lucide-react";

export default function BadgesPage() {
  const db = useAppStore((s) => s.db);
  const lmsLang = useAppStore((s) => s.lmsLang);
  const studentId = useAppStore((s) => s.currentStudentId);
  const t = useT(lmsLang);
  const student = db.students.find((s) => s.id === studentId)!;

  const level = Math.floor(student.points / 500) + 1;
  const intoLevel = student.points % 500;

  const badges = [
    { icon: Flame, en: "First streak", si: "පළමු අඛණ්ඩතාව", earned: student.streak >= 1, desc: "Answer the daily question" },
    { icon: Flame, en: "7-day streak", si: "7-දින අඛණ්ඩතාව", earned: student.bestStreak >= 7, desc: "7 days in a row" },
    { icon: Flame, en: "30-day streak", si: "30-දින අඛණ්ඩතාව", earned: student.bestStreak >= 30, desc: "30 days in a row" },
    { icon: Coins, en: "500 points", si: "ලකුණු 500", earned: student.points >= 500, desc: "Earn 500 points" },
    { icon: Coins, en: "1,000 points", si: "ලකුණු 1,000", earned: student.points >= 1000, desc: "Earn 1,000 points" },
    { icon: Target, en: "Sharp shooter", si: "නිවැරදි පිළිතුරු", earned: student.accuracy >= 75, desc: "75% accuracy" },
    { icon: BookOpen, en: "First exam", si: "පළමු විභාගය", earned: true, desc: "Sit your first exam" },
    { icon: Zap, en: "Battle winner", si: "සටන් ජයග්‍රාහක", earned: false, desc: "Win a quiz battle" },
    { icon: Star, en: "Top 3", si: "පළමු 3", earned: false, desc: "Reach the top 3" },
    { icon: Trophy, en: "Champion", si: "ශූරයා", earned: false, desc: "Reach #1" },
  ];

  const earnedCount = badges.filter((b) => b.earned).length;

  return (
    <div>
      <PageHeader title={t("lms.nav.badges")} description={lmsLang === "si" ? "ඔබේ ජයග්‍රහණ සහ ලාංඡන." : "Your achievements and badges."} />

      <Card className="mb-6">
        <CardContent className="pt-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Award className="h-8 w-8 text-primary" />
              <div>
                <p className="text-lg font-bold">{t("lms.growth.level")} {level}</p>
                <p className="text-sm text-muted-foreground">{earnedCount} / {badges.length} {lmsLang === "si" ? "ලාංඡන" : "badges"}</p>
              </div>
            </div>
            <div className="w-full max-w-xs">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{intoLevel} / 500</span>
                <span>{lmsLang === "si" ? "ඊළඟ මට්ටමට" : "to next level"}</span>
              </div>
              <Progress className="mt-1.5" value={(intoLevel / 500) * 100} />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {badges.map((b) => {
          const Icon = b.icon;
          return (
            <Card key={b.en} className={b.earned ? "border-primary/30" : "opacity-70"}>
              <CardContent className="pt-5">
                <div className="flex items-center justify-between">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${b.earned ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <Badge tone={b.earned ? "success" : "muted"}>{b.earned ? (lmsLang === "si" ? "ලබා ඇත" : "Earned") : (lmsLang === "si" ? "අගුළු" : "Locked")}</Badge>
                </div>
                <p className="mt-3 font-semibold">{lmsLang === "si" ? b.si : b.en}</p>
                <p className="text-sm text-muted-foreground">{b.desc}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
