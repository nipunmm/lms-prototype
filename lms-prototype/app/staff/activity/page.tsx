"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { timeAgo, shortDate } from "@/lib/format";
import { PageHeader, StatTile, SectionTitle } from "@/components/shared/page";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input, Field, Select } from "@/components/ui/input";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { Avatar } from "@/components/ui/switch";
import { History, Filter, User } from "lucide-react";

export default function StaffActivityPage() {
  const db = useAppStore((s) => s.db);

  const [actor, setActor] = useState("all");
  const [prefix, setPrefix] = useState("all");
  const [query, setQuery] = useState("");

  const actors = [...new Set(db.activity.map((a) => a.actor))];
  const prefixes = [...new Set(db.activity.map((a) => a.action.split("-")[0]))].sort();

  const rows = db.activity
    .filter((a) => (actor === "all" ? true : a.actor === actor))
    .filter((a) => (prefix === "all" ? true : a.action.startsWith(prefix)))
    .filter((a) => (query ? (a.detail + a.action + a.actor).toLowerCase().includes(query.toLowerCase()) : true))
    .sort((a, b) => b.at.localeCompare(a.at));

  return (
    <div>
      <PageHeader
        title="Activity log"
        description="An audit trail of important actions across the platform."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Events" value={db.activity.length} icon={<History className="h-4 w-4" />} />
        <StatTile label="Staff involved" value={actors.length} icon={<User className="h-4 w-4" />} />
        <StatTile label="Areas touched" value={prefixes.length} />
        <StatTile label="Showing" value={rows.length} tone="warning" icon={<Filter className="h-4 w-4" />} />
      </div>

      <Card className="mt-6">
        <CardContent className="pt-5">
          <SectionTitle title="Audit trail" description="Newest first. Every entry is written automatically when an action is taken." />
          <div className="mb-4 grid gap-3 sm:grid-cols-3">
            <Field label="Staff member">
              <Select value={actor} onChange={(e) => setActor(e.target.value)}>
                <option value="all">All staff</option>
                {actors.map((a) => <option key={a} value={a}>{a}</option>)}
              </Select>
            </Field>
            <Field label="Area">
              <Select value={prefix} onChange={(e) => setPrefix(e.target.value)}>
                <option value="all">All areas</option>
                {prefixes.map((p) => <option key={p} value={p}>{p}</option>)}
              </Select>
            </Field>
            <Field label="Search">
              <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search detail or action ID..." />
            </Field>
          </div>

          <Table>
            <THead>
              <TR>
                <TH>When</TH>
                <TH>Staff</TH>
                <TH>Action</TH>
                <TH>Detail</TH>
              </TR>
            </THead>
            <TBody>
              {rows.map((a) => (
                <TR key={a.id}>
                  <TD>
                    <p className="text-sm">{shortDate(a.at)}</p>
                    <p className="text-xs text-muted-foreground">{timeAgo(a.at)}</p>
                  </TD>
                  <TD>
                    <div className="flex items-center gap-2">
                      <Avatar name={a.actor} hue={200} size={28} />
                      <span className="text-sm font-medium">{a.actor}</span>
                    </div>
                  </TD>
                  <TD><Badge tone="outline">{a.action}</Badge></TD>
                  <TD className="text-sm text-muted-foreground">{a.detail}</TD>
                </TR>
              ))}
            </TBody>
          </Table>
          {rows.length === 0 ? <p className="mt-3 text-sm text-muted-foreground">No activity matches these filters.</p> : null}
        </CardContent>
      </Card>
    </div>
  );
}
