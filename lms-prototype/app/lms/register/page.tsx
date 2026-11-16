"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { useT } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input, Field, Select } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap } from "lucide-react";
import { toast } from "@/components/shared/toast";

export default function LmsRegisterPage() {
  const router = useRouter();
  const lmsLang = useAppStore((s) => s.lmsLang);
  const verificationMethod = useAppStore((s) => s.db.settings.verificationMethod);
  const t = useT(lmsLang);
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [source, setSource] = useState("website");

  const onGoogle = () => {
    if (verificationMethod === "staff") {
      router.push("/lms/pending-approval?method=google");
    } else {
      toast(t("common.demoOnly"), "info");
      router.push("/lms/home");
    }
  };

  const onCreate = () => {
    if (!name.trim() || !nickname.trim() || !mobile.trim() || !password) {
      toast(t("common.demoOnly"), "info");
    }
    if (verificationMethod === "staff") {
      router.push("/lms/pending-approval?method=mobile");
    } else {
      router.push("/lms/verify?method=sms");
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardContent className="pt-8">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <GraduationCap className="h-6 w-6" />
          </div>
          <h1 className="mt-4 text-xl font-bold">{t("lms.auth.register")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t("lms.auth.registerSubtitle")}</p>
        </div>

        <div className="mt-6 grid gap-4">
          <Button variant="outline" size="lg" className="w-full" onClick={onGoogle}>
            <span className="mr-1 font-bold text-[#4285F4]">G</span> {t("lms.auth.google")}
          </Button>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" /> {t("common.or")} <span className="h-px flex-1 bg-border" />
          </div>

          <div className="grid gap-3">
            <Field label={t("lms.auth.name")} id="reg-name" required>
              <Input id="reg-name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nimal Perera" />
            </Field>
            <Field label={t("lms.auth.nickname")} id="reg-nick" required>
              <Input id="reg-nick" value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="NimalP" />
            </Field>
            <Field label={t("lms.auth.mobileNumber")} id="reg-mobile" required>
              <Input id="reg-mobile" type="tel" inputMode="tel" autoComplete="tel" value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="+94 7X XXX XXXX" />
            </Field>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label={t("lms.auth.password")} id="reg-pass" required>
                <Input id="reg-pass" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
              </Field>
              <Field label={t("lms.auth.confirmPassword")} id="reg-confirm" required>
                <Input id="reg-confirm" type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="••••••••" />
              </Field>
            </div>
            <Field
              label={t("lms.auth.source")}
              id="reg-source"
              hint={verificationMethod === "sms" ? t("lms.auth.smsHint") : t("lms.auth.staffApprovalHint")}
            >
              <Select id="reg-source" value={source} onChange={(e) => setSource(e.target.value)}>
                <option value="website">Website</option>
                <option value="WhatsApp">WhatsApp</option>
                <option value="friend">{lmsLang === "si" ? "මිතුරෙක්" : "Friend"}</option>
                <option value="social media">{lmsLang === "si" ? "සමාජ මාධ්‍ය" : "Social media"}</option>
                <option value="school">{lmsLang === "si" ? "පාසල" : "School"}</option>
                <option value="other">{lmsLang === "si" ? "වෙනත්" : "Other"}</option>
              </Select>
            </Field>

            {password && confirm && password !== confirm ? (
              <p className="text-xs text-danger">{lmsLang === "si" ? "මුරපද නොගැලපේ." : "Passwords do not match."}</p>
            ) : null}

            <Button size="lg" className="w-full" onClick={onCreate}>
              {t("lms.auth.createAccount")}
            </Button>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            {t("lms.auth.haveAccount")}{" "}
            <Link href="/lms/login" className="font-medium text-primary hover:underline">
              {t("common.studentLogin")}
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
