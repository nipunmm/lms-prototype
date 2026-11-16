"use client";

import { useAppStore } from "@/lib/store";
import { useT } from "@/lib/i18n";
import { PageHeader } from "@/components/shared/page";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { Trophy, Medal, Flame } from "lucide-react";

export default function LeaderboardPage() {
  const db = useAppStore((s) => s.db);
  const lmsLang = useAppStore((s) => s.lmsLang);
  const studentId = useAppStore((s) => s.currentStudentId);
  const t = useT(lmsLang);

  const ranked = [...db.students].sort((a, b) => b.points - a.points);

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title={t("lms.nav.leaderboard")} description={lmsLang === "si" ? "අන්වර්ථ නාමයෙන් පමණි — ගෞරවය සහ දිරිගැන්වීම." : "Nicknames only — for honour and motivation."} />

      <div className="mb-4 rounded-2xl border border-primary/20 bg-primary/5 p-4 text-sm text-muted-foreground">
        {lmsLang === "si"
          ? "ලැයිස්තුවේ පෙන්වන්නේ අන්වර්ථ නාමය පමණි. ලකුණු දෛනික ප්‍රශ්න, ප්‍රශ්නාවලි සහ සටන් වලින් ලැබේ."
          : "Only nicknames appear here. Points come from daily questions, quizzes and battles."}
      </div>

      <Card>
        <div className="divide-y divide-border">
          {ranked.map((s, i) => {
            const isMe = s.id === studentId;
            return (
              <div key={s.id} className={cn("flex items-center gap-3 px-5 py-3", isMe && "bg-primary/5")}>
                <span className="w-6 text-center text-sm font-bold text-muted-foreground">
                  {i === 0 ? <Trophy className="mx-auto h-4 w-4 text-warning" /> : i === 1 ? <Medal className="mx-auto h-4 w-4 text-slate-400" /> : i === 2 ? <Medal className="mx-auto h-4 w-4 text-amber-700" /> : i + 1}
                </span>
                <Avatar name={s.nickname} hue={s.avatarHue} size={36} />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">
                    {s.nickname} {isMe ? <span className="text-xs text-primary">({lmsLang === "si" ? "ඔබ" : "you"})</span> : null}
                  </p>
                  <p className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Flame className="h-3 w-3 text-warning" /> {s.streak} {lmsLang === "si" ? "දින" : "day streak"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold">{s.points}</p>
                  <p className="text-xs text-muted-foreground">{t("lms.growth.points")}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <p className="mt-4 text-xs text-muted-foreground">
        {lmsLang === "si" ? "පන්තියේ පමණක් නොව, සියලුම සිසුන් අතර." : "Across all students, not just one class."}
      </p>
    </div>
  );
}
