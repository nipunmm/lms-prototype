"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { useT } from "@/lib/i18n";
import { money } from "@/lib/format";
import { PageHeader } from "@/components/shared/page";
import { Card, CardContent } from "@/components/ui/card";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { toast } from "@/components/shared/toast";
import { Package, MapPin, Truck, AlertCircle } from "lucide-react";

const stages = ["Confirmed", "Packed", "Posted", "Delivered"];

export default function TutesPage() {
  const db = useAppStore((s) => s.db);
  const lmsLang = useAppStore((s) => s.lmsLang);
  const studentId = useAppStore((s) => s.currentStudentId);
  const t = useT(lmsLang);

  const myClassIds = db.enrolments.filter((e) => e.studentId === studentId && e.status === "active").map((e) => e.classId);
  const myDispatches = db.dispatches.filter((d) => myClassIds.includes(d.classId));
  const myRequests = db.tuteRequests.filter((r) => r.studentId === studentId);

  const [open, setOpen] = useState(false);
  const [address, setAddress] = useState("No. 12, Temple Road, Nugegoda");
  const [phone2, setPhone2] = useState("");
  const [postOffice, setPostOffice] = useState("Nugegoda");

  return (
    <div>
      <PageHeader title={t("lms.nav.tutes")} description={lmsLang === "si" ? "මුද්‍රිත ටියුට් තැපෑලෙන් — ගාස්තුවට ඇතුළත්." : "Printed tutes by post — included in the fee."} />

      <div className="grid gap-4 md:grid-cols-2">
        {myDispatches.map((d) => {
          const c = db.classes.find((x) => x.id === d.classId);
          const stageIdx = stages.indexOf(d.stage);
          return (
            <Card key={d.id}>
              <CardContent className="pt-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{c?.type} — {c?.batch}</h3>
                    <p className="text-sm text-muted-foreground">{d.month}</p>
                  </div>
                  <StatusBadge status={d.stage} />
                </div>

                <div className="mt-4 flex items-center gap-1">
                  {stages.map((s, i) => (
                    <div key={s} className="flex flex-1 flex-col items-center gap-1">
                      <div className={`h-1.5 w-full rounded-full ${i <= stageIdx ? "bg-primary" : "bg-border"}`} />
                      <span className={`text-[10px] ${i <= stageIdx ? "text-primary" : "text-muted-foreground"}`}>{s}</span>
                    </div>
                  ))}
                </div>

                {d.courier ? (
                  <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                    <Truck className="h-4 w-4" /> {d.courier} · {d.tracking}
                  </p>
                ) : null}
                <p className="mt-1 text-sm text-muted-foreground">
                  {lmsLang === "si" ? "බෙදාහැරීමේ ගාස්තුව" : "Delivery"}: {money(d.deliveryCost, lmsLang)}
                </p>
              </CardContent>
            </Card>
          );
        })}
        {myDispatches.length === 0 ? (
          <p className="text-sm text-muted-foreground">{lmsLang === "si" ? "ටියුට් නොමැත." : "No tutes yet."}</p>
        ) : null}
      </div>

      <Card className="mt-6">
        <CardContent className="pt-5">
          <h2 className="flex items-center gap-2 font-semibold"><MapPin className="h-4 w-4" /> {lmsLang === "si" ? "බෙදාහැරීමේ ලිපිනය" : "Delivery address"}</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Field label={lmsLang === "si" ? "ලිපිනය" : "Address"} className="sm:col-span-2">
              <Input value={address} onChange={(e) => setAddress(e.target.value)} />
            </Field>
            <Field label={lmsLang === "si" ? "තැපැල් කන්තෝරුව" : "Post office"}>
              <Input value={postOffice} onChange={(e) => setPostOffice(e.target.value)} />
            </Field>
            <Field label={lmsLang === "si" ? "අමතර දුරකථනය" : "Alternate phone"}>
              <Input value={phone2} onChange={(e) => setPhone2(e.target.value)} placeholder="+94 7X XXX XXXX" />
            </Field>
          </div>
          <Button className="mt-4" onClick={() => toast(lmsLang === "si" ? "ලිපිනය සුරකින ලදී (නිදර්ශනය)." : "Address saved (demo).")}>
            {t("common.save")}
          </Button>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardContent className="pt-5">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-semibold"><Package className="h-4 w-4" /> {lmsLang === "si" ? "මගේ ඉල්ලීම්" : "My requests"}</h2>
            <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
              {lmsLang === "si" ? "ටියුට් එකක් ඉල්ලන්න" : "Request a tute"}
            </Button>
          </div>
          <div className="mt-3 grid gap-2">
            {myRequests.map((r) => (
              <div key={r.id} className="flex items-center justify-between rounded-xl border border-border p-3">
                <div>
                  <p className="text-sm font-medium">{r.reason}</p>
                  <p className="text-xs text-muted-foreground">{db.classes.find((c) => c.id === r.classId)?.batch}</p>
                </div>
                <StatusBadge status={r.status} />
              </div>
            ))}
            {myRequests.length === 0 ? (
              <p className="text-sm text-muted-foreground">{lmsLang === "si" ? "ඉල්ලීම් නොමැත." : "No requests."}</p>
            ) : null}
          </div>
          <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
            <AlertCircle className="h-3.5 w-3.5" /> {lmsLang === "si" ? "නැවත යැවීම අනුමැතියට යටත්; අමතර ගාස්තුවක් විය හැක." : "Re-sends require approval; a small charge may apply."}
          </p>
        </CardContent>
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title={lmsLang === "si" ? "ටියුට් එකක් ඉල්ලන්න" : "Request a tute"}>
        <Textarea placeholder={lmsLang === "si" ? "හේතුව (නොලැබුණි / හානි විය)..." : "Reason (not received / damaged)..."} />
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setOpen(false)}>{t("common.cancel")}</Button>
          <Button onClick={() => { setOpen(false); toast(lmsLang === "si" ? "ඉල්ලීම යවන ලදී." : "Request sent."); }}>{t("common.submit")}</Button>
        </div>
      </Modal>
    </div>
  );
}
