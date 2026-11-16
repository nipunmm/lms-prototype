"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { useT } from "@/lib/i18n";
import { getAccountStatus } from "@/lib/format";
import { cn } from "@/lib/utils";
import { DemoBar } from "@/components/shared/demo-bar";
import { LangToggle } from "@/components/shared/lang-toggle";
import { Toaster } from "@/components/shared/toast";
import { Avatar } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Home, TrendingUp, HelpCircle, BookOpen, GraduationCap, Wallet, Radio, FolderOpen,
  ClipboardList, Package, MessagesSquare, User, FileText, Trophy, Award, CalendarClock,
  Users, Gift, ListChecks, Swords, History, Video,
} from "lucide-react";

const authPaths = ["/lms/login", "/lms/register", "/lms/verify", "/lms/forgot-password", "/lms/pending-approval"];

const groups: { label: string; items: { href: string; key: string; icon: typeof Home }[] }[] = [
  {
    label: "Main",
    items: [
      { href: "/lms/home", key: "lms.nav.home", icon: Home },
      { href: "/lms/growth", key: "lms.nav.growth", icon: TrendingUp },
      { href: "/lms/daily-question", key: "lms.nav.daily", icon: HelpCircle },
    ],
  },
  {
    label: "Learn",
    items: [
      { href: "/lms/classes", key: "lms.nav.classes", icon: BookOpen },
      { href: "/lms/my-classes", key: "lms.nav.myClasses", icon: GraduationCap },
      { href: "/lms/live", key: "lms.nav.live", icon: Radio },
      { href: "/lms/materials", key: "lms.nav.materials", icon: FolderOpen },
      { href: "/lms/recordings", key: "lms.nav.recordings", icon: Video },
      { href: "/lms/attendance", key: "lms.nav.attendance", icon: History },
    ],
  },
  {
    label: "Practice & hooks",
    items: [
      { href: "/lms/past-papers", key: "lms.nav.pastPapers", icon: FileText },
      { href: "/lms/quizzes", key: "lms.nav.quizzes", icon: ListChecks },
      { href: "/lms/battles", key: "lms.nav.battles", icon: Swords },
      { href: "/lms/leaderboard", key: "lms.nav.leaderboard", icon: Trophy },
      { href: "/lms/badges", key: "lms.nav.badges", icon: Award },
      { href: "/lms/exam-dates", key: "lms.nav.examDates", icon: CalendarClock },
      { href: "/lms/open-classes", key: "lms.nav.openClasses", icon: Users },
    ],
  },
  {
    label: "Exams",
    items: [{ href: "/lms/exams", key: "lms.nav.exams", icon: ClipboardList }],
  },
  {
    label: "More",
    items: [
      { href: "/lms/payments", key: "lms.nav.payments", icon: Wallet },
      { href: "/lms/tutes", key: "lms.nav.tutes", icon: Package },
      { href: "/lms/messages", key: "lms.nav.messages", icon: MessagesSquare },
      { href: "/lms/referral", key: "lms.nav.referral", icon: Gift },
      { href: "/lms/profile", key: "lms.nav.profile", icon: User },
    ],
  },
];

export default function LmsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const lmsLang = useAppStore((s) => s.lmsLang);
  const studentId = useAppStore((s) => s.currentStudentId);
  const student = useAppStore((s) => s.db.students.find((x) => x.id === studentId));
  const t = useT(lmsLang);

  const isAuth = authPaths.some((p) => pathname.startsWith(p));
  const account = getAccountStatus(student);

  return (
    <div className="app-lms flex min-h-screen flex-col bg-background">
      <DemoBar app="lms" />

      <header className="sticky top-0 z-30 border-b border-border bg-surface/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1400px] items-center gap-3 px-4 py-2.5">
          <Link href="/lms/home" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
              <GraduationCap className="h-4 w-4" />
            </div>
            <span className="text-sm font-bold">Student LMS</span>
          </Link>
          <div className="ml-auto flex items-center gap-3">
            <LangToggle scope="lms" />
            {!isAuth && student ? (
              <div className="flex items-center gap-2">
                <Avatar name={student.name} hue={student.avatarHue} size={32} />
                <div className="hidden leading-tight sm:block">
                  <p className="text-xs font-semibold">{student.name}</p>
                  <p className="text-[10px] text-muted-foreground">{student.id}</p>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </header>

      {isAuth ? (
        <main className="flex flex-1 items-center justify-center px-4 py-10">{children}</main>
      ) : (
        <div className="mx-auto flex w-full max-w-[1400px] flex-1 gap-6 px-4 py-6">
          <aside className="hidden w-60 shrink-0 lg:block">
            <div className="sticky top-20">
              {student ? (
                <div className="mb-4 rounded-2xl border border-border bg-surface p-4">
                  <div className="flex items-center gap-3">
                    <Avatar name={student.name} hue={student.avatarHue} size={40} />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{student.nickname}</p>
                      <p className="text-[11px] text-muted-foreground">{student.id}</p>
                    </div>
                  </div>
                  <Badge className="mt-3 w-full justify-center" tone={account.tone}>
                    {t(account.labelKey)}
                  </Badge>
                </div>
              ) : null}

              <nav className="grid gap-4">
                {groups.map((g) => (
                  <div key={g.label}>
                    <p className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {g.label}
                    </p>
                    <div className="grid gap-0.5">
                      {g.items.map((item) => {
                        const Icon = item.icon;
                        const active = pathname === item.href || pathname.startsWith(item.href + "/");
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                              "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors",
                              active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground",
                            )}
                          >
                            <Icon className="h-4 w-4 shrink-0" />
                            <span className="truncate">{t(item.key)}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </nav>
            </div>
          </aside>

          <main className="min-w-0 flex-1 pb-16 lg:pb-0">{children}</main>
        </div>
      )}

      {!isAuth ? (
        <nav className="fixed bottom-0 left-0 right-0 z-30 flex items-center justify-around border-t border-border bg-surface px-2 py-1.5 lg:hidden">
          {[groups[0].items[0], groups[1].items[0], groups[3].items[0], groups[4].items[0], groups[4].items[3]].map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn("flex flex-col items-center gap-0.5 rounded-lg px-3 py-1 text-[10px]", active ? "text-primary" : "text-muted-foreground")}
              >
                <Icon className="h-5 w-5" />
                {t(item.key)}
              </Link>
            );
          })}
        </nav>
      ) : null}

      <Toaster />
    </div>
  );
}
