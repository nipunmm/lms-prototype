"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useAppStore } from "@/lib/store";
import { useT } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input, Field } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";
import { toast } from "@/components/shared/toast";

function VerifyInner() {
  const router = useRouter();
  const params = useSearchParams();
  const lmsLang = useAppStore((s) => s.lmsLang);
  const t = useT(lmsLang);
  const [code, setCode] = useState("");
  const method = params.get("method") || "sms";

  const onVerify = () => {
    if (method === "staff") {
      router.push("/lms/pending-approval?method=mobile");
      return;
    }
    toast(t("lms.auth.verified"));
    router.push("/lms/home");
  };

  return (
    <Card className="w-full max-w-md">
      <CardContent className="pt-8">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h1 className="mt-4 text-xl font-bold">{t("lms.auth.verify")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t("lms.auth.verifyHint")}</p>
        </div>
        <div className="mt-6 grid gap-4">
          <Field label={t("lms.auth.codeLabel")} id="verify-code" hint={t("lms.auth.smsCodeHint")}>
            <Input
              id="verify-code"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="123456"
              inputMode="numeric"
              autoComplete="one-time-code"
              className="text-center text-lg tracking-[0.4em]"
              maxLength={6}
            />
          </Field>
          <Button size="lg" className="w-full" onClick={onVerify} disabled={code.length > 0 && code.length < 6}>
            {t("lms.auth.verifyCode")}
          </Button>
          <Button variant="ghost" className="w-full" onClick={() => toast(t("lms.auth.codeSent"), "info")}>
            {t("lms.auth.resendCode")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function LmsVerifyPage() {
  return (
    <Suspense fallback={<div className="text-sm text-muted-foreground">...</div>}>
      <VerifyInner />
    </Suspense>
  );
}
