"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input, Field } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck } from "lucide-react";
import type { RoleName } from "@/lib/types";

export default function StaffLoginPage() {
  const router = useRouter();
  const db = useAppStore((s) => s.db);
  const signInStaff = useAppStore((s) => s.signInStaff);
  const setCurrentRole = useAppStore((s) => s.setCurrentRole);
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");

  const signIn = (staffId: string, role: RoleName) => {
    signInStaff(staffId);
    setCurrentRole(role);
    router.push("/staff/dashboard");
  };

  return (
    <Card className="w-full max-w-md">
      <CardContent className="pt-8">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h1 className="mt-4 text-xl font-bold">Staff sign in</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Staff Portal is English only. Sign in to manage {db.settings.platformName}.
          </p>
        </div>

        <div className="mt-6 grid gap-3">
          <Field label="Mobile number">
            <Input value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="+94 7X XXX XXXX" />
          </Field>
          <Field label="Password">
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </Field>
          <Button size="lg" onClick={() => signIn("st1", "Teacher")}>Sign in</Button>
        </div>

        <div className="mt-6 border-t border-border pt-4">
          <p className="mb-3 text-center text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Demo shortcut — pick a role
          </p>
          <div className="grid gap-2">
            {db.staff.filter((s) => s.active).map((s) => (
              <button
                key={s.id}
                onClick={() => signIn(s.id, s.role)}
                className="flex items-center justify-between rounded-xl border border-border px-4 py-3 text-left transition-colors hover:bg-muted"
              >
                <div>
                  <p className="text-sm font-medium">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.mobile}</p>
                </div>
                <Badge tone={s.role === "System Admin" ? "danger" : s.role === "Teacher" ? "info" : "success"}>{s.role}</Badge>
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
