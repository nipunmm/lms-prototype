"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { PageHeader, StatTile, SectionTitle } from "@/components/shared/page";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/input";
import { Tabs } from "@/components/ui/tabs";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { Avatar, Switch } from "@/components/ui/switch";
import { toast } from "@/components/shared/toast";
import { cn } from "@/lib/utils";
import { Lock, ShieldCheck, Users, KeyRound, ChevronDown } from "lucide-react";
import type { RoleName } from "@/lib/types";

const groupLabels: Record<string, string> = {
  ACC: "Access & roles",
  DSH: "Dashboard",
  GRW: "Growth",
  WEB: "Website",
  USR: "Students",
  CLS: "Classes",
  ATT: "Attendance",
  CNT: "Content",
  ASM: "Assessments",
  PAY: "Payments",
  TUT: "Tutes",
  FIN: "Finance",
  COM: "Communication",
  SET: "Settings",
};

function groupActions(actions: string[]) {
  const map = new Map<string, string[]>();
  for (const a of actions) {
    const prefix = a.split("-")[0];
    if (!map.has(prefix)) map.set(prefix, []);
    map.get(prefix)!.push(a);
  }
  return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]));
}

export default function StaffAccessPage() {
  const db = useAppStore((s) => s.db);
  const setStaffRole = useAppStore((s) => s.setStaffRole);
  const setStaffActive = useAppStore((s) => s.setStaffActive);

  const [tab, setTab] = useState("accounts");
  const [expanded, setExpanded] = useState<RoleName | null>(null);

  const roles = db.roles;

  return (
    <div>
      <PageHeader
        title="Access & roles"
        description="Who can do what, and who has an account. Permissions map to the action IDs in the platform spec."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Roles" value={roles.length} icon={<ShieldCheck className="h-4 w-4" />} />
        <StatTile label="Staff accounts" value={db.staff.length} icon={<Users className="h-4 w-4" />} />
        <StatTile label="Active" value={db.staff.filter((s) => s.active).length} tone="success" />
        <StatTile label="Action permissions" value={roles.find((r) => r.name === "System Admin")?.actions.length ?? 0} icon={<KeyRound className="h-4 w-4" />} />
      </div>

      <Tabs
        className="mt-6"
        value={tab}
        onChange={setTab}
        tabs={[
          { value: "accounts", label: "Staff accounts", count: db.staff.length },
          { value: "roles", label: "Roles & permissions", count: roles.length },
        ]}
      />

      {tab === "accounts" ? (
        <div className="mt-4">
          <SectionTitle title="Staff accounts" description="Assign a role and enable or disable sign-in." />
          <Card>
            <Table>
              <THead>
                <TR>
                  <TH>Staff member</TH>
                  <TH>Mobile</TH>
                  <TH>Role</TH>
                  <TH>Status</TH>
                  <TH>Enabled</TH>
                </TR>
              </THead>
              <TBody>
                {db.staff.map((s) => (
                  <TR key={s.id}>
                    <TD>
                      <div className="flex items-center gap-3">
                        <Avatar name={s.name} hue={200} size={34} />
                        <div>
                          <p className="font-medium">{s.name}</p>
                          <p className="text-xs text-muted-foreground">{s.id}</p>
                        </div>
                      </div>
                    </TD>
                    <TD className="text-sm text-muted-foreground">{s.mobile}</TD>
                    <TD>
                      <Select
                        className="h-9 w-40"
                        value={s.role}
                        onChange={(e) => {
                          setStaffRole(s.id, e.target.value as RoleName);
                          toast(`${s.name} is now ${e.target.value}.`);
                        }}
                      >
                        {roles.map((r) => (
                          <option key={r.name} value={r.name}>{r.name}</option>
                        ))}
                      </Select>
                    </TD>
                    <TD>
                      {s.active ? <Badge tone="success">active</Badge> : <Badge tone="muted">disabled</Badge>}
                    </TD>
                    <TD>
                      <Switch
                        checked={s.active}
                        onChange={(v) => {
                          setStaffActive(s.id, v);
                          toast(v ? `${s.name} can sign in again.` : `${s.name} is disabled.`);
                        }}
                      />
                    </TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          </Card>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Button variant="outline" onClick={() => toast("Invitation SMS sent (demo).", "info")}>Invite staff member</Button>
            <p className="flex items-center gap-2 text-xs text-muted-foreground">
              <Lock className="h-3.5 w-3.5" /> The System Admin role is locked and cannot be removed.
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-4 grid gap-4">
          {roles.map((r) => {
            const open = expanded === r.name;
            const groups = groupActions(r.actions);
            return (
              <Card key={r.name}>
                <CardContent className="pt-5">
                  <button
                    className="flex w-full items-center justify-between gap-4 text-left"
                    onClick={() => setExpanded(open ? null : r.name)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", r.name === "System Admin" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground")}>
                        <ShieldCheck className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{r.name}</p>
                          {r.locked ? <Badge tone="muted"><Lock className="h-3 w-3" /> locked</Badge> : null}
                        </div>
                        <p className="text-sm text-muted-foreground">{r.actions.length} permissions · {groups.length} areas</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="hidden gap-1 sm:flex">
                        {groups.slice(0, 6).map(([prefix]) => (
                          <Badge key={prefix} tone="outline">{prefix}</Badge>
                        ))}
                        {groups.length > 6 ? <Badge tone="muted">+{groups.length - 6}</Badge> : null}
                      </div>
                      <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", open && "rotate-180")} />
                    </div>
                  </button>

                  {open ? (
                    <div className="mt-4 grid gap-3 border-t border-border pt-4 sm:grid-cols-2 lg:grid-cols-3">
                      {groups.map(([prefix, actions]) => (
                        <div key={prefix} className="rounded-xl border border-border p-3">
                          <p className="text-sm font-medium">{groupLabels[prefix] ?? prefix}</p>
                          <div className="mt-2 flex flex-wrap gap-1">
                            {actions.map((a) => (
                              <Badge key={a} tone="muted">{a}</Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            );
          })}

          <p className="flex items-center gap-2 text-xs text-muted-foreground">
            <Lock className="h-3.5 w-3.5" /> Role editing is a future feature; permissions reflect the seeded action map.
          </p>
        </div>
      )}
    </div>
  );
}
