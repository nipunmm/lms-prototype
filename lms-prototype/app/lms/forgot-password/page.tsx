"use client";

import Link from "next/link";
import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { useT } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input, Field } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { KeyRound } from "lucide-react";
import { toast } from "@/components/shared/toast";

export default function LmsForgotPage() {
  const lmsLang = useAppStore((s) => s.lmsLang);
  const t = useT(lmsLang);
  const [step, setStep] = useState<"mobile" | "code" | "reset">("mobile");
  const [mobile, setMobile] = useState("");
  const [code, setCode] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");

  return (
    <Card className="w-full max-w-md">
      <CardContent className="pt-8">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <KeyRound className="h-6 w-6" />
          </div>
          <h1 className="mt-4 text-xl font-bold">{t("lms.auth.forgot")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t("lms.auth.forgotHint")}</p>
        </div>

        <div className="mt-6 grid gap-4">
          {step === "mobile" && (
            <Field label={t("lms.auth.mobileNumber")} id="forgot-mobile">
              <Input id="forgot-mobile" type="tel" inputMode="tel" autoComplete="tel" value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="+94 7X XXX XXXX" />
            </Field>
          )}
          {step === "code" && (
            <Field label={t("lms.auth.codeLabel")} id="forgot-code" hint={t("lms.auth.smsCodeHint")}>
              <Input id="forgot-code" value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))} inputMode="numeric" autoComplete="one-time-code" placeholder="123456" className="text-center tracking-[0.4em]" />
            </Field>
          )}
          {step === "reset" && (
            <>
              <Field label={t("lms.auth.newPassword")} id="forgot-new">
                <Input id="forgot-new" type="password" autoComplete="new-password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="••••••••" />
              </Field>
              <Field label={t("lms.auth.confirmPassword")} id="forgot-confirm">
                <Input id="forgot-confirm" type="password" autoComplete="new-password" value={pw2} onChange={(e) => setPw2(e.target.value)} placeholder="••••••••" />
              </Field>
              {pw && pw2 && pw !== pw2 ? <p className="text-xs text-danger">{lmsLang === "si" ? "මුරපද නොගැලපේ." : "Passwords do not match."}</p> : null}
            </>
          )}

          <Button
            size="lg"
            className="w-full"
            onClick={() => {
              if (step === "mobile") { setStep("code"); toast(t("lms.auth.codeSent"), "info"); }
              else if (step === "code") { setStep("reset"); toast(t("lms.auth.verified"), "info"); }
              else { toast(t("lms.auth.passwordUpdated")); }
            }}
          >
            {step === "mobile" ? t("lms.auth.sendCode") : step === "code" ? t("lms.auth.verifyCode") : t("lms.auth.resetPassword")}
          </Button>

          <Link href="/lms/login" className="text-center text-sm text-primary hover:underline">
            {t("lms.auth.backToLogin")}
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
