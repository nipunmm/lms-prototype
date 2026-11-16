"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/lib/store";
import { timeAgo } from "@/lib/format";
import { PageHeader, StatTile, SectionTitle } from "@/components/shared/page";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { Tabs } from "@/components/ui/tabs";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { Avatar } from "@/components/ui/switch";
import { toast } from "@/components/shared/toast";
import { cn } from "@/lib/utils";
import { Send, PhoneCall, MessagesSquare, Check, X, Inbox } from "lucide-react";
import type { CallbackRequest } from "@/lib/types";

export default function StaffCommunicationPage() {
  const db = useAppStore((s) => s.db);
  const replyMessage = useAppStore((s) => s.replyMessage);
  const markThreadRead = useAppStore((s) => s.markThreadRead);
  const setCallbackStatus = useAppStore((s) => s.setCallbackStatus);

  const [tab, setTab] = useState("inbox");
  const studentIds = [...new Set(db.messages.map((m) => m.studentId))];
  const [activeId, setActiveId] = useState(studentIds[0] ?? "");
  const [body, setBody] = useState("");

  const unread = db.messages.filter((m) => m.from === "student" && !m.read);
  const newCallbacks = db.callbacks.filter((c) => c.status === "new");

  useEffect(() => {
    if (activeId) markThreadRead(activeId);
  }, [activeId, markThreadRead]);

  const thread = db.messages.filter((m) => m.studentId === activeId).sort((a, b) => a.at.localeCompare(b.at));
  const activeStudent = db.students.find((s) => s.id === activeId);

  const send = () => {
    if (!body.trim() || !activeId) return;
    replyMessage(activeId, body);
    setBody("");
    toast("Reply sent.");
  };

  return (
    <div>
      <PageHeader
        title="Communication"
        description="Reply to students and follow up on call-back requests."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Unread messages" value={unread.length} tone="warning" icon={<MessagesSquare className="h-4 w-4" />} />
        <StatTile label="Conversations" value={studentIds.length} icon={<Inbox className="h-4 w-4" />} />
        <StatTile label="New call-backs" value={newCallbacks.length} tone="danger" icon={<PhoneCall className="h-4 w-4" />} />
        <StatTile label="Total call-backs" value={db.callbacks.length} />
      </div>

      <Tabs
        className="mt-6"
        value={tab}
        onChange={setTab}
        tabs={[
          { value: "inbox", label: "Inbox", count: unread.length },
          { value: "callbacks", label: "Call-backs", count: newCallbacks.length },
        ]}
      />

      {tab === "inbox" ? (
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-1">
            <CardContent className="pt-5">
              <SectionTitle title="Conversations" />
              <div className="grid gap-1">
                {studentIds.map((id) => {
                  const st = db.students.find((s) => s.id === id);
                  const msgs = db.messages.filter((m) => m.studentId === id);
                  const last = msgs[msgs.length - 1];
                  const hasUnread = msgs.some((m) => m.from === "student" && !m.read);
                  return (
                    <button
                      key={id}
                      onClick={() => setActiveId(id)}
                      className={cn(
                        "flex items-center gap-3 rounded-xl border p-3 text-left transition-colors",
                        id === activeId ? "border-primary bg-primary/5" : "border-border hover:bg-muted",
                      )}
                    >
                      <Avatar name={st?.name ?? "?"} hue={st?.avatarHue ?? 220} size={36} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="truncate text-sm font-medium">{st?.name}</p>
                          {hasUnread ? <span className="h-2 w-2 rounded-full bg-primary" /> : null}
                        </div>
                        <p className="truncate text-xs text-muted-foreground">{last?.body}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardContent className="pt-5">
              {activeStudent ? (
                <>
                  <div className="flex items-center gap-3 border-b border-border pb-4">
                    <Avatar name={activeStudent.name} hue={activeStudent.avatarHue} size={40} />
                    <div>
                      <p className="font-semibold">{activeStudent.name}</p>
                      <p className="text-xs text-muted-foreground">{activeStudent.mobile}</p>
                    </div>
                    <Button size="sm" variant="outline" className="ml-auto" onClick={() => toast("Opening the full student record (demo).", "info")}>View student</Button>
                  </div>
                  <div className="mt-4 grid gap-3">
                    {thread.map((m) => (
                      <div key={m.id} className={cn("flex", m.from === "staff" ? "justify-end" : "justify-start")}>
                        <div className={cn("max-w-[80%] rounded-2xl px-4 py-2.5 text-sm", m.from === "staff" ? "bg-primary text-primary-foreground" : "bg-muted")}>
                          <p>{m.body}</p>
                          <p className={cn("mt-1 text-[10px]", m.from === "staff" ? "text-primary-foreground/70" : "text-muted-foreground")}>{timeAgo(m.at)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center gap-2 border-t border-border pt-4">
                    <Input value={body} onChange={(e) => setBody(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Type a reply..." />
                    <Button onClick={send} size="icon" aria-label="Send"><Send className="h-4 w-4" /></Button>
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">No conversations yet.</p>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="mt-4">
          <SectionTitle title="Call-back requests" description="From the website contact form and phone calls." />
          <Card>
            <Table>
              <THead><TR><TH>Name</TH><TH>Phone</TH><TH>Interest</TH><TH>Note</TH><TH>Status</TH><TH>Actions</TH></TR></THead>
              <TBody>
                {db.callbacks.map((c) => (
                  <CallbackRow key={c.id} c={c} onSet={(s) => { setCallbackStatus(c.id, s); toast(`Marked ${s}.`); }} />
                ))}
              </TBody>
            </Table>
          </Card>
        </div>
      )}
    </div>
  );
}

function CallbackRow({ c, onSet }: { c: CallbackRequest; onSet: (s: CallbackRequest["status"]) => void }) {
  const [status, setStatus] = useState(c.status);
  return (
    <TR>
      <TD className="font-medium">{c.name}</TD>
      <TD className="text-sm text-muted-foreground">{c.phone}</TD>
      <TD className="text-sm text-muted-foreground">{c.interest || "—"}</TD>
      <TD className="max-w-[220px] truncate text-sm text-muted-foreground">{c.note || "—"}</TD>
      <TD><StatusBadge status={c.status} /></TD>
      <TD>
        <div className="flex items-center gap-2">
          <Select value={status} onChange={(e) => { const s = e.target.value as CallbackRequest["status"]; setStatus(s); onSet(s); }} className="h-8 w-32 text-xs">
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="closed">Closed</option>
          </Select>
          <Button size="sm" variant="outline" onClick={() => onSet("contacted")}><Check className="h-3.5 w-3.5" /> Called</Button>
          <Button size="sm" variant="ghost" onClick={() => onSet("closed")}><X className="h-3.5 w-3.5" /></Button>
        </div>
      </TD>
    </TR>
  );
}
