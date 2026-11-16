"use client";

import { useAppStore } from "@/lib/store";
import { useT } from "@/lib/i18n";
import { PageHeader, StatTile, SectionTitle } from "@/components/shared/page";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Flame, Coins, Target, Trophy, TrendingUp } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function GrowthPage() {
  const db = useAppStore((s) => s.db);
  const lmsLang = useAppStore((s) => s.lmsLang);
  const studentId = useAppStore((s) => s.currentStudentId);
  const t = useT(lmsLang);
  const student = db.students.find((s) => s.id === studentId)!;

  const level = Math.floor(student.points / 500) + 1;
  const intoLevel = student.points % 500;
  const scoreData = [
    { m: "Aug", score: 58 },
    { m: "Sep", score: 64 },
    { m: "Oct", score: 72 },
    { m: "Nov", score: student.accuracy },
  ];
  const badges = [
    { label: lmsLang === "si" ? "7-දින අඛණ්ඩතාව" : "7-day streak", earned: student.bestStreak >= 7 },
    { label: lmsLang === "si" ? "100 ප්‍රශ්න" : "100 questions", earned: student.points >= 500 },
    { label: lmsLang === "si" ? "පළමු විභාගය" : "First exam", earned: true },
    { label: lmsLang === "si" ? "30-දින අඛණ්ඩතාව" : "30-day streak", earned: student.bestStreak >= 30 },
  ];

  return (
    <div>
      <PageHeader title={t("lms.growth.title")} description={lmsLang === "si" ? "ඔබේ ප්‍රගතිය සහ දියුණුව." : "Your progress and improvement."} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label={t("lms.growth.streak")} value={`${student.streak} 🔥`} icon={<Flame className="h-4 w-4" />} tone="warning" />
        <StatTile label={t("lms.growth.best")} value={student.bestStreak} icon={<TrendingUp className="h-4 w-4" />} />
        <StatTile label={t("lms.growth.accuracy")} value={`${student.accuracy}%`} icon={<Target className="h-4 w-4" />} tone="success" />
        <StatTile label={t("lms.growth.points")} value={student.points} icon={<Coins className="h-4 w-4" />} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardContent className="pt-5">
            <SectionTitle title={lmsLang === "si" ? "ප්‍රශ්නාවලි ලකුණු කාලයත් සමඟ" : "Quiz scores over time"} />
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={scoreData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="m" fontSize={12} />
                  <YAxis fontSize={12} domain={[0, 100]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="score" stroke="#4f46e5" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-5">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">{t("lms.growth.level")} {level}</h3>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {intoLevel} / 500 {lmsLang === "si" ? "ඊළඟ මට්ටමට" : "to next level"}
            </p>
            <Progress className="mt-3" value={(intoLevel / 500) * 100} />
            <div className="mt-5">
              <p className="text-sm font-medium">{t("lms.nav.badges")}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {badges.map((b) => (
                  <Badge key={b.label} tone={b.earned ? "success" : "muted"}>
                    {b.earned ? "🏅" : "🔒"} {b.label}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
