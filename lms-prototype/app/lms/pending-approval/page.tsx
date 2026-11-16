"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { useT } from "@/lib/i18n";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle2, Globe } from "lucide-react";

function PendingInner() {
  const params = useSearchParams();
  const lmsLang = useAppStore((s) => s.lmsLang);
  const t = useT(lmsLang);
  const method = params.get("method") || "mobile";

  return (
    <Card className="w-full max-w-md">
      <CardContent className="pt-8">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-warning/15 text-warning">
            <Clock className="h-6 w-6" />
          </div>
          <h1 className="mt-4 text-xl font-bold">{t("lms.auth.pendingTitle")}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{t("lms.auth.pendingBody")}</p>
        </div>

        <div className="mt-6 rounded-xl border border-border bg-muted/40 p-4 text-sm">
          <p className="font-medium mb-2">{t("lms.auth.pendingNext")}</p>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 mt-0.5 text-primary shrink-0" /> {t("lms.auth.pendingStep1")}</li>
            <li className="flex gap-2"><Globe className="h-4 w-4 mt-0.5 text-primary shrink-0" /> {t("lms.auth.pendingStep2")}</li>
          </ul>
        </div>

        <div className="mt-6 grid gap-2">
          <Link href="/lms/login" className="w-full"><Button variant="outline" className="w-full">{t("lms.auth.backToLogin")}</Button></Link>
          <Link href="/site/classes" className="w-full"><Button className="w-full">{t("common.viewClasses")}</Button></Link>
        </div>
        <p className="mt-3 text-center text-xs text-muted-foreground">
          {method === "google" ? t("lms.auth.methodGoogle") : t("lms.auth.methodMobile")} · {t("common.demoOnly")}
        </p>
      </CardContent>
    </Card>
  );
}

export default function PendingApprovalPage() {
  return (
    <Suspense fallback={<div className="text-sm text-muted-foreground">...</div>}>
      <PendingInner />
    </Suspense>
  );
}
