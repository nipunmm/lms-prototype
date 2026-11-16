"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { useT } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input, Field } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, Smartphone } from "lucide-react";
import { toast } from "@/components/shared/toast";

export default function LmsLoginPage() {
  const router = useRouter();
  const lmsLang = useAppStore((s) => s.lmsLang);
  const signInStaff = useAppStore((s) => s.signInStaff); // not used, but ensures store
  const t = useT(lmsLang);
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");

  return (
    <Card className="w-full max-w-md">
      <CardContent className="pt-8">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <GraduationCap className="h-6 w-6" />
          </div>
          <h1 className="mt-4 text-xl font-bold">{t("lms.auth.welcome")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t("lms.auth.subtitle")}</p>
        </div>

        <div className="mt-6 grid gap-4">
          <Button
            variant="outline"
            size="lg"
            className="w-full"
            onClick={() => {
              toast(t("common.demoOnly"), "info");
              router.push("/lms/home");
            }}
          >
            <span className="mr-1 font-bold text-[#4285F4]">G</span> {t("lms.auth.google")}
          </Button>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" /> {t("common.or")} <span className="h-px flex-1 bg-border" />
          </div>

          <div className="grid gap-3">
            <Field label={t("lms.auth.mobileNumber")} id="login-mobile">
              <Input
                id="login-mobile"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="+94 7X XXX XXXX"
              />
            </Field>
            <Field label={t("lms.auth.password")} id="login-password">
              <Input
                id="login-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </Field>
            <Button
              size="lg"
              className="w-full"
              onClick={() => {
                toast(t("common.demoOnly"), "info");
                router.push("/lms/home");
              }}
            >
              <Smartphone className="h-4 w-4" /> {t("lms.auth.mobileSignIn")}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">{t("lms.auth.noPasswordGoogle")}</p>

          <div className="flex items-center justify-between text-sm">
            <Link href="/lms/forgot-password" className="text-primary hover:underline">
              {t("lms.auth.forgot")}
            </Link>
            <Link href="/lms/register" className="font-medium text-primary hover:underline">
              {t("lms.auth.register")}
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
