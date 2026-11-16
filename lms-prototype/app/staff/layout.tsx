"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { DemoBar } from "@/components/shared/demo-bar";
import { Toaster } from "@/components/shared/toast";
import { Avatar } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck } from "lucide-react";
import {
  LayoutDashboard, TrendingUp, Users, BookOpen, CalendarCheck, FolderOpen, ClipboardList,
  Wallet, Package, Landmark, MessagesSquare, Globe, Settings, KeyRound, ScrollText,
} from "lucide-react";

const publicPaths = ["/staff/login"];

type NavItem = { href: string; label: string; icon: typeof Users; perm: string };

const groups: { label: string; items: NavItem[] }[] = [
  {
    label: "Overview",
    items: [
      { href: "/staff/dashboard", label: "Dashboard", icon: LayoutDashboard, perm: "DSH" },
      { href: "/staff/growth", label: "Growth & funnel", icon: TrendingUp, perm: "GRW" },
    ],
  },
  {
    label: "Students",
    items: [
      { href: "/staff/students", label: "Students & requests", icon: Users, perm: "USR" },
      { href: "/staff/communication", label: "Communication", icon: MessagesSquare, perm: "COM" },
    ],
  },
  {
    label: "Classes",
    items: [
      { href: "/staff/classes", label: "Classes", icon: BookOpen, perm: "CLS" },
      { href: "/staff/attendance", label: "Attendance", icon: CalendarCheck, perm: "ATT" },
      { href: "/staff/content", label: "Content & material", icon: FolderOpen, perm: "CNT" },
      { href: "/staff/assessments", label: "Assessments", icon: ClipboardList, perm: "ASM" },
      { href: "/staff/tutes", label: "Tutes & dispatch", icon: Package, perm: "TUT" },
    ],
  },
  {
    label: "Money",
    items: [
      { href: "/staff/payments", label: "Payments", icon: Wallet, perm: "PAY" },
      { href: "/staff/finance", label: "Finance", icon: Landmark, perm: "FIN" },
    ],
  },
  {
    label: "Website",
    items: [{ href: "/staff/website", label: "Website content", icon: Globe, perm: "WEB" }],
  },
  {
    label: "Settings",
    items: [
      { href: "/staff/settings", label: "Platform settings", icon: Settings, perm: "SET" },
      { href: "/staff/access", label: "Roles & access", icon: KeyRound, perm: "ACC" },
      { href: "/staff/activity", label: "Activity log", icon: ScrollText, perm: "SET" },
    ],
  },
];

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const db = useAppStore((s) => s.db);
  const currentRole = useAppStore((s) => s.currentRole);
  const currentStaffId = useAppStore((s) => s.currentStaffId);
  const staff = db.staff.find((s) => s.id === currentStaffId);
  const role = db.roles.find((r) => r.name === currentRole);

  const can = (perm: string) => !!role?.actions.some((a) => a.startsWith(perm + "-"));

  const isPublic = publicPaths.some((p) => pathname.startsWith(p));

  if (isPublic) {
    return (
      <div className="app-staff flex min-h-screen flex-col bg-background">
        <DemoBar app="staff" />
        <main className="flex flex-1 items-center justify-center px-4 py-10">{children}</main>
        <Toaster />
      </div>
    );
  }

  return (
    <div className="app-staff flex min-h-screen flex-col bg-background">
      <DemoBar app="staff" />

      <div className="mx-auto flex w-full max-w-[1500px] flex-1 gap-6 px-4 py-6">
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-4">
            <div className="mb-4 flex items-center gap-2 rounded-2xl border border-border bg-surface p-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold">Staff Portal</p>
                <p className="text-[11px] text-muted-foreground">{db.settings.platformName}</p>
              </div>
            </div>

            <nav className="grid gap-4">
              {groups.map((g) => {
                const items = g.items.filter((i) => can(i.perm));
                if (items.length === 0) return null;
                return (
                  <div key={g.label}>
                    <p className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{g.label}</p>
                    <div className="grid gap-0.5">
                      {items.map((item) => {
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
                            <span className="truncate">{item.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </nav>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <header className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-surface px-4 py-3">
            <div className="flex items-center gap-3">
              <Avatar name={staff?.name ?? "Staff"} hue={210} size={36} />
              <div>
                <p className="text-sm font-semibold">{staff?.name}</p>
                <p className="text-[11px] text-muted-foreground">{staff?.mobile}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge tone="info">{currentRole}</Badge>
              <Link href="/staff/login" className="text-xs text-muted-foreground hover:text-foreground">Switch</Link>
            </div>
          </header>

          {/* Mobile nav */}
          <nav className="mb-4 flex gap-1 overflow-x-auto lg:hidden">
            {groups.flatMap((g) => g.items).filter((i) => can(i.perm)).map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex shrink-0 items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium",
                    active ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground",
                  )}
                >
                  <Icon className="h-3.5 w-3.5" /> {item.label}
                </Link>
              );
            })}
          </nav>

          {children}
        </main>
      </div>

      <Toaster />
    </div>
  );
}
