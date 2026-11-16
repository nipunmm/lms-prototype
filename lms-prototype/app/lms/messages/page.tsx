"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { useT } from "@/lib/i18n";
import { timeAgo } from "@/lib/format";
import { PageHeader } from "@/components/shared/page";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/switch";
import { Send } from "lucide-react";

export default function MessagesPage() {
  const db = useAppStore((s) => s.db);
  const lmsLang = useAppStore((s) => s.lmsLang);
  const studentId = useAppStore((s) => s.currentStudentId);
  const sendMessage = useAppStore((s) => s.sendMessage);
  const t = useT(lmsLang);

  const student = db.students.find((s) => s.id === studentId)!;
  const thread = db.messages.filter((m) => m.studentId === studentId).sort((a, b) => a.at.localeCompare(b.at));
  const [body, setBody] = useState("");

  const send = () => {
    if (!body.trim()) return;
    sendMessage(studentId, body);
    setBody("");
  };

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title={t("lms.nav.messages")} description={lmsLang === "si" ? "ගුරුවරයා සමඟ පණිවිඩ." : "Messages with your teacher."} />

      <Card>
        <CardContent className="pt-5">
          <div className="flex items-center gap-3 border-b border-border pb-4">
            <Avatar name={db.teacher.name} hue={db.teacher.avatarHue} size={40} />
            <div>
              <p className="font-semibold">{db.teacher.name}</p>
              <p className="text-xs text-muted-foreground">{lmsLang === "si" ? "සාමාන්‍යයෙන් විනාඩි කිහිපයකින් පිළිතුරු දෙයි" : "Usually replies within a few hours"}</p>
            </div>
          </div>

          <div className="mt-4 grid gap-3">
            {thread.map((m) => (
              <div key={m.id} className={cn("flex", m.from === "student" ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm",
                    m.from === "student" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground",
                  )}
                >
                  <p>{m.body}</p>
                  <p className={cn("mt-1 text-[10px]", m.from === "student" ? "text-primary-foreground/70" : "text-muted-foreground")}>
                    {timeAgo(m.at)}
                  </p>
                </div>
              </div>
            ))}
            {thread.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                {lmsLang === "si" ? "පණිවිඩ නොමැත. ආරම්භ කරන්න!" : "No messages yet. Say hello!"}
              </p>
            ) : null}
          </div>

          <div className="mt-4 flex items-center gap-2 border-t border-border pt-4">
            <Input
              value={body}
              onChange={(e) => setBody(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder={lmsLang === "si" ? "පණිවිඩයක් ලියන්න..." : "Type a message..."}
            />
            <Button onClick={send} size="icon" aria-label="Send"><Send className="h-4 w-4" /></Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
