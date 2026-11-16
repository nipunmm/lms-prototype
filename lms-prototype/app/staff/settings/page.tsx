"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { PageHeader, SectionTitle } from "@/components/shared/page";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Field, Select } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/shared/toast";
import { Building2, Languages, Video, MessageCircle, SlidersHorizontal } from "lucide-react";
import type { Lang } from "@/lib/types";

export default function StaffSettingsPage() {
  const db = useAppStore((s) => s.db);
  const updateSettings = useAppStore((s) => s.updateSettings);
  const [s, setS] = useState(db.settings);

  const save = (patch: Partial<typeof s>) => {
    const next = { ...s, ...patch };
    setS(next);
    updateSettings(patch);
  };

  return (
    <div>
      <PageHeader title="Platform settings" description="Branding, payments, teaching rules and integrations." />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="pt-5">
            <SectionTitle title="Platform" description="Names and branding." />
            <div className="grid gap-3">
              <Field label="Platform name"><Input value={s.platformName} onChange={(e) => setS({ ...s, platformName: e.target.value })} /></Field>
              <Field label="Default language">
                <Select value={s.defaultLanguage} onChange={(e) => save({ defaultLanguage: e.target.value as Lang })}>
                  <option value="si">Sinhala (සිංහල)</option>
                  <option value="en">English</option>
                </Select>
              </Field>
              <Field label="Student verification">
                <Select value={s.verificationMethod} onChange={(e) => save({ verificationMethod: e.target.value as typeof s.verificationMethod })}>
                  <option value="sms">SMS code (automatic)</option>
                  <option value="staff">Staff manual verification</option>
                </Select>
              </Field>
              <Button onClick={() => { updateSettings({ platformName: s.platformName }); toast("Platform settings saved."); }}>Save</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-5">
            <SectionTitle title="Bank account" description="Shown to students paying by deposit." />
            <div className="grid gap-3">
              <Field label="Bank"><Input value={s.bankName} onChange={(e) => setS({ ...s, bankName: e.target.value })} /></Field>
              <Field label="Account number"><Input value={s.bankAccount} onChange={(e) => setS({ ...s, bankAccount: e.target.value })} /></Field>
              <Field label="Branch"><Input value={s.bankBranch} onChange={(e) => setS({ ...s, bankBranch: e.target.value })} /></Field>
              <Button onClick={() => { updateSettings({ bankName: s.bankName, bankAccount: s.bankAccount, bankBranch: s.bankBranch }); toast("Bank details saved."); }}>Save</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-5">
            <SectionTitle title="Teaching rules" description="Used for attendance and payment reminders." />
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Minimum attendance (%)"><Input type="number" value={s.minPresentPct} onChange={(e) => setS({ ...s, minPresentPct: Number(e.target.value) })} /></Field>
              <Field label="Late after (minutes)"><Input type="number" value={s.lateLimitMins} onChange={(e) => setS({ ...s, lateLimitMins: Number(e.target.value) })} /></Field>
              <Field label="Absences before follow-up"><Input type="number" value={s.absenceFollowUp} onChange={(e) => setS({ ...s, absenceFollowUp: Number(e.target.value) })} /></Field>
              <Field label="Payment grace days"><Input type="number" value={s.graceDays} onChange={(e) => setS({ ...s, graceDays: Number(e.target.value) })} /></Field>
            </div>
            <div className="mt-3 flex items-center justify-between rounded-xl border border-border p-3">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-primary" />
                <span className="text-sm">Send overdue payment reminders</span>
              </div>
              <Switch checked={s.overdueReminders} onChange={(v) => save({ overdueReminders: v })} />
            </div>
            <Button className="mt-4" onClick={() => { updateSettings({ minPresentPct: s.minPresentPct, lateLimitMins: s.lateLimitMins, absenceFollowUp: s.absenceFollowUp, graceDays: s.graceDays }); toast("Rules saved."); }}>Save rules</Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-5">
            <SectionTitle title="Integrations" description="External services used by the platform." />
            <div className="grid gap-3">
              <div className="flex items-center justify-between rounded-xl border border-border p-3">
                <div className="flex items-center gap-2">
                  <Video className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Zoom</p>
                    <p className="text-xs text-muted-foreground">Live class links</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge tone={s.zoomConnected ? "success" : "muted"}>{s.zoomConnected ? "connected" : "off"}</Badge>
                  <Switch checked={s.zoomConnected} onChange={(v) => save({ zoomConnected: v })} />
                </div>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-border p-3">
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-sm font-medium">WhatsApp</p>
                    <p className="text-xs text-muted-foreground">Nudges and reminders</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge tone={s.whatsappEnabled ? "success" : "muted"}>{s.whatsappEnabled ? "enabled" : "off"}</Badge>
                  <Switch checked={s.whatsappEnabled} onChange={(v) => save({ whatsappEnabled: v })} />
                </div>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-border p-3">
                <div className="flex items-center gap-2">
                  <Languages className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Bilingual content</p>
                    <p className="text-xs text-muted-foreground">Sinhala + English</p>
                  </div>
                </div>
                <Badge tone="info">always on</Badge>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-border p-3">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Online payments</p>
                    <p className="text-xs text-muted-foreground">Card / online banking</p>
                  </div>
                </div>
                <Badge tone="muted">demo</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
