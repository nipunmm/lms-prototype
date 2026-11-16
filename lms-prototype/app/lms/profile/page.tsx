"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { useT } from "@/lib/i18n";
import { PageHeader } from "@/components/shared/page";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/input";
import { Avatar } from "@/components/ui/switch";
import { toast } from "@/components/shared/toast";
import { getAccountStatus, getApplicationStatus } from "@/lib/format";
import { LogOut, ShieldCheck, Shield, Smartphone } from "lucide-react";
import type { Lang } from "@/lib/types";

export default function ProfilePage() {
  const db = useAppStore((s) => s.db);
  const lmsLang = useAppStore((s) => s.lmsLang);
  const setLmsLang = useAppStore((s) => s.setLmsLang);
  const studentId = useAppStore((s) => s.currentStudentId);
  const t = useT(lmsLang);
  const student = db.students.find((s) => s.id === studentId)!;
  const account = getAccountStatus(student);
  const appStatus = getApplicationStatus(db.requests, studentId);

  const [name, setName] = useState(student.name);
  const [nickname, setNickname] = useState(student.nickname);
  const [mobile, setMobile] = useState(student.mobile);
  const [guardian, setGuardian] = useState(student.guardianMobile ?? "");

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title={t("lms.profile.title")} description={t("lms.profile.subtitle")} />

      <Card>
        <CardContent className="pt-5">
          <div className="flex items-center gap-4">
            <Avatar name={student.name} hue={student.avatarHue} size={64} />
            <div>
              <p className="text-lg font-semibold">{student.name}</p>
              <p className="text-sm text-muted-foreground">{t("lms.home.studentId")}: {student.id}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <Badge tone={student.google ? "info" : "muted"}>{student.google ? "Google" : t("lms.profile.mobileSignIn")}</Badge>
                <Badge tone={account.tone}>{t(account.labelKey)}</Badge>
                <Badge tone={appStatus.tone}>{t(appStatus.labelKey)}</Badge>
                {student.feeWaiver ? <Badge tone="success">{student.feeWaiver}</Badge> : null}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">{t(appStatus.nextKey)}</p>
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-sm font-semibold mb-3">{t("lms.profile.personal")}</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={t("lms.profile.name")} id="profile-name">
                <Input id="profile-name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
              </Field>
              <Field label={t("lms.auth.nickname")} id="profile-nick">
                <Input id="profile-nick" value={nickname} onChange={(e) => setNickname(e.target.value)} />
              </Field>
              <Field label={t("lms.profile.language")} id="profile-lang">
                <Select id="profile-lang" value={lmsLang} onChange={(e) => { setLmsLang(e.target.value as Lang); toast(t("lms.profile.langSaved"), "info"); }}>
                  <option value="si">සිංහල</option>
                  <option value="en">English</option>
                </Select>
              </Field>
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-border">
            <h2 className="text-sm font-semibold mb-3">{t("lms.profile.contact")}</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={t("lms.auth.mobileNumber")} id="profile-mobile" hint={t("lms.profile.mobileVerifyNote")}>
                <Input id="profile-mobile" type="tel" inputMode="tel" autoComplete="tel" value={mobile} onChange={(e) => setMobile(e.target.value)} />
              </Field>
              <Field label={t("lms.profile.guardian")} id="profile-guardian">
                <Input id="profile-guardian" type="tel" inputMode="tel" value={guardian} onChange={(e) => setGuardian(e.target.value)} />
              </Field>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">{lmsLang === "si" ? "ජංගම අංකය වෙනස් කිරීමේදී තහවුරු කිරීමක් අවශ්‍ය වේ (ආදර්ශන UI)." : "Mobile number changes require verification in the full flow (demo UI)."}</p>
          </div>

          <Button className="mt-5" onClick={() => toast(t("lms.profile.saved"))}>
            {t("common.save")}
          </Button>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardContent className="pt-5">
          <h2 className="text-sm font-semibold">{t("lms.profile.security")}</h2>
          <div className="mt-3 grid gap-3 text-sm">
            <div className="flex items-center justify-between rounded-xl border border-border p-3">
              <span className="flex items-center gap-2">
                {student.google ? <ShieldCheck className="h-4 w-4 text-success" /> : <Shield className="h-4 w-4 text-muted-foreground" />}
                {t("lms.profile.googleSignIn")}
              </span>
              <Badge tone={student.google ? "success" : "muted"}>{student.google ? t("lms.profile.linked") : t("lms.profile.notLinked")}</Badge>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-border p-3">
              <span className="flex items-center gap-2"><Smartphone className="h-4 w-4 text-muted-foreground" /> {t("lms.profile.mobileSignIn")}</span>
              <Badge tone={student.mobile ? "success" : "muted"}>{student.mobile ? t("lms.profile.linked") : t("lms.profile.notLinked")}</Badge>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-border p-3">
              <span>{t("lms.profile.changePassword")}</span>
              <Button size="sm" variant="outline" onClick={() => toast(t("lms.auth.codeSent"), "info")}>
                {lmsLang === "si" ? "SMS කේතයක් යවන්න" : "Send SMS code"}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">{t("lms.auth.googleNoPassword")}</p>
          </div>
          <Button className="mt-4" variant="outline" onClick={() => toast(t("lms.profile.signedOut"), "info")}>
            <LogOut className="h-4 w-4" /> {t("common.signOut")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
