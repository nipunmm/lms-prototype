"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { money, shortDate } from "@/lib/format";
import { PageHeader, StatTile, SectionTitle } from "@/components/shared/page";
import { Card, CardContent } from "@/components/ui/card";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Field } from "@/components/ui/input";
import { Tabs } from "@/components/ui/tabs";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { toast } from "@/components/shared/toast";
import { Package, Truck, Check, ChevronRight, AlertCircle } from "lucide-react";
import type { TuteStage } from "@/lib/types";

const stages: TuteStage[] = ["Confirmed", "Packed", "Posted", "Delivered"];

export default function StaffTutesPage() {
  const db = useAppStore((s) => s.db);
  const setDispatchStage = useAppStore((s) => s.setDispatchStage);
  const resolveTuteRequest = useAppStore((s) => s.resolveTuteRequest);

  const [tab, setTab] = useState("dispatch");
  const [courierDraft, setCourierDraft] = useState<Record<string, { courier: string; tracking: string }>>({});

  const pendingRequests = db.tuteRequests.filter((t) => t.status === "pending");

  const advance = (id: string, current: TuteStage) => {
    const idx = stages.indexOf(current);
    if (idx >= stages.length - 1) return;
    const next = stages[idx + 1];
    const draft = courierDraft[id];
    setDispatchStage(id, next, next === "Posted" ? (draft?.courier ?? "SL Post") : undefined, next === "Posted" ? draft?.tracking : undefined);
    toast(`Moved to ${next}.`);
  };

  return (
    <div>
      <PageHeader
        title="Tutes & dispatch"
        description="Track each month's printed tute from packing to delivery, and handle re-send requests."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Dispatches" value={db.dispatches.length} icon={<Package className="h-4 w-4" />} />
        <StatTile label="In progress" value={db.dispatches.filter((d) => d.stage !== "Delivered").length} tone="warning" />
        <StatTile label="Delivered" value={db.dispatches.filter((d) => d.stage === "Delivered").length} tone="success" />
        <StatTile label="Re-send requests" value={pendingRequests.length} tone="danger" icon={<AlertCircle className="h-4 w-4" />} />
      </div>

      <Tabs
        className="mt-6"
        value={tab}
        onChange={setTab}
        tabs={[
          { value: "dispatch", label: "Dispatches", count: db.dispatches.length },
          { value: "requests", label: "Re-send requests", count: pendingRequests.length },
        ]}
      />

      {tab === "dispatch" ? (
        <div className="mt-4 grid gap-4">
          {db.dispatches.map((d) => {
            const c = db.classes.find((x) => x.id === d.classId);
            const idx = stages.indexOf(d.stage);
            const draft = courierDraft[d.id] ?? { courier: d.courier ?? "SL Post", tracking: d.tracking ?? "" };
            return (
              <Card key={d.id}>
                <CardContent className="pt-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-medium">{c?.type} — {c?.batch}</p>
                      <p className="text-sm text-muted-foreground">{d.month} · delivery {money(d.deliveryCost)}</p>
                    </div>
                    <StatusBadge status={d.stage} />
                  </div>

                  <div className="mt-4 flex items-center gap-1">
                    {stages.map((s, i) => (
                      <div key={s} className="flex flex-1 items-center gap-1">
                        <div className="flex flex-1 flex-col items-center gap-1">
                          <div className={`h-1.5 w-full rounded-full ${i <= idx ? "bg-primary" : "bg-border"}`} />
                          <span className={`text-[10px] ${i <= idx ? "text-primary" : "text-muted-foreground"}`}>{s}</span>
                        </div>
                        {i < stages.length - 1 ? <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground" /> : null}
                      </div>
                    ))}
                  </div>

                  {d.stage === "Packed" ? (
                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                      <Field label="Courier"><Input value={draft.courier} onChange={(e) => setCourierDraft({ ...courierDraft, [d.id]: { ...draft, courier: e.target.value } })} /></Field>
                      <Field label="Tracking number"><Input value={draft.tracking} onChange={(e) => setCourierDraft({ ...courierDraft, [d.id]: { ...draft, tracking: e.target.value } })} placeholder="LK..." /></Field>
                      <div className="flex items-end">
                        <Button className="w-full" onClick={() => advance(d.id, d.stage)}><Truck className="h-4 w-4" /> Mark posted</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 flex items-center justify-between">
                      <p className="flex items-center gap-2 text-sm text-muted-foreground">
                        {d.courier ? <><Truck className="h-4 w-4" /> {d.courier} · {d.tracking}</> : "Not posted yet"}
                      </p>
                      {d.stage !== "Delivered" ? (
                        <Button size="sm" variant="outline" onClick={() => advance(d.id, d.stage)}>
                          <Check className="h-3.5 w-3.5" /> Mark {stages[idx + 1]?.toLowerCase()}
                        </Button>
                      ) : (
                        <Badge tone="success">complete</Badge>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="mt-4">
          <SectionTitle title="Re-send requests" description="Students asking for a replacement tute." />
          <div className="grid gap-3">
            {pendingRequests.map((t) => {
              const st = db.students.find((s) => s.id === t.studentId);
              const c = db.classes.find((x) => x.id === t.classId);
              return (
                <Card key={t.id}>
                  <CardContent className="flex flex-wrap items-center justify-between gap-3 pt-5">
                    <div>
                      <p className="font-medium">{st?.name}</p>
                      <p className="text-sm text-muted-foreground">{c?.batch} · “{t.reason}”</p>
                      <p className="text-xs text-muted-foreground">{shortDate(t.createdAt)}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="success" onClick={() => { resolveTuteRequest(t.id, "approved"); toast("Re-send approved."); }}>
                        <Check className="h-3.5 w-3.5" /> Approve
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => { resolveTuteRequest(t.id, "rejected"); toast("Request rejected."); }}>
                        Reject
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            {pendingRequests.length === 0 ? <Card><CardContent className="pt-5 text-sm text-muted-foreground">No pending requests.</CardContent></Card> : null}
          </div>

          <SectionTitle title="History" />
          <Card>
            <Table>
              <THead><TR><TH>Student</TH><TH>Class</TH><TH>Reason</TH><TH>Status</TH></TR></THead>
              <TBody>
                {db.tuteRequests.filter((t) => t.status !== "pending").map((t) => (
                  <TR key={t.id}>
                    <TD className="font-medium">{db.students.find((s) => s.id === t.studentId)?.name}</TD>
                    <TD className="text-sm text-muted-foreground">{db.classes.find((c) => c.id === t.classId)?.batch}</TD>
                    <TD className="text-sm text-muted-foreground">{t.reason}</TD>
                    <TD><StatusBadge status={t.status} /></TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          </Card>
        </div>
      )}
    </div>
  );
}
