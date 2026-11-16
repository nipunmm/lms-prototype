"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { money, shortDate } from "@/lib/format";
import { PageHeader, StatTile, SectionTitle } from "@/components/shared/page";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Field, Select } from "@/components/ui/input";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { Modal } from "@/components/ui/modal";
import { toast } from "@/components/shared/toast";
import { Landmark, TrendingDown, TrendingUp, Plus, Coins } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import type { Expense } from "@/lib/types";

const MONTH = "2026-11";
const monthKeys = ["2026-06", "2026-07", "2026-08", "2026-09", "2026-10", "2026-11"];
const monthLabels: Record<string, string> = { "2026-06": "Jun", "2026-07": "Jul", "2026-08": "Aug", "2026-09": "Sep", "2026-10": "Oct", "2026-11": "Nov" };

export default function StaffFinancePage() {
  const db = useAppStore((s) => s.db);
  const addExpense = useAppStore((s) => s.addExpense);

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ category: "Advertising" as Expense["category"], amount: 0, date: new Date().toISOString().slice(0, 10), note: "" });

  const confirmed = db.payments.filter((p) => p.status === "confirmed");
  const incomeThisMonth = confirmed.filter((p) => p.months.includes(MONTH)).reduce((s, p) => s + p.amount, 0);
  const expensesThisMonth = db.expenses.filter((e) => e.date.startsWith(MONTH)).reduce((s, e) => s + e.amount, 0);

  const activeEnrolments = db.enrolments.filter((e) => e.status === "active");
  const paidIds = new Set(confirmed.filter((p) => p.months.includes(MONTH)).map((p) => p.studentId));
  const outstanding = [...new Set(activeEnrolments.map((e) => e.studentId))]
    .filter((id) => !paidIds.has(id))
    .reduce((s, id) => s + activeEnrolments.filter((e) => e.studentId === id).reduce((t, e) => t + (db.classes.find((c) => c.id === e.classId)?.monthlyFee ?? 0), 0), 0);

  const chartData = monthKeys.map((m) => {
    const income = confirmed.filter((p) => p.months.includes(m)).reduce((s, p) => s + p.amount, 0);
    const expense = db.expenses.filter((e) => e.date.startsWith(m)).reduce((s, e) => s + e.amount, 0);
    return { m: monthLabels[m], income, expense, net: income - expense };
  });

  const byMethod = (["online", "slip", "cash"] as const).map((method) => ({
    method,
    total: confirmed.filter((p) => p.method === method).reduce((s, p) => s + p.amount, 0),
    count: confirmed.filter((p) => p.method === method).length,
  }));

  return (
    <div>
      <PageHeader
        title="Finance"
        description="Money in, money out, and what is still outstanding."
        actions={<Button onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> Add expense</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label={`Income ${MONTH}`} value={money(incomeThisMonth)} tone="success" icon={<TrendingUp className="h-4 w-4" />} />
        <StatTile label={`Expenses ${MONTH}`} value={money(expensesThisMonth)} tone="danger" icon={<TrendingDown className="h-4 w-4" />} />
        <StatTile label="Net" value={money(incomeThisMonth - expensesThisMonth)} icon={<Landmark className="h-4 w-4" />} />
        <StatTile label="Outstanding" value={money(outstanding)} tone="warning" hint="this month, unpaid" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardContent className="pt-5">
            <SectionTitle title="Income vs expenses" description="Last six months." />
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="m" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip formatter={(v) => money(Number(v))} />
                  <Legend />
                  <Bar dataKey="income" name="Income" fill="#1d4ed8" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="expense" name="Expenses" fill="#e11d48" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-5">
            <SectionTitle title="Income by method" description="Confirmed payments." />
            <div className="grid gap-3">
              {byMethod.map((m) => (
                <div key={m.method} className="flex items-center justify-between rounded-xl border border-border p-3">
                  <div className="flex items-center gap-2">
                    <Coins className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-sm font-medium capitalize">{m.method}</p>
                      <p className="text-xs text-muted-foreground">{m.count} payments</p>
                    </div>
                  </div>
                  <p className="font-semibold">{money(m.total)}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <SectionTitle title="Expenses" description="Advertising, assistant pay, printing, delivery and other costs." />
        <Card>
          <Table>
            <THead><TR><TH>Date</TH><TH>Category</TH><TH>Note</TH><TH>Amount</TH></TR></THead>
            <TBody>
              {db.expenses.map((e) => (
                <TR key={e.id}>
                  <TD className="text-sm text-muted-foreground">{shortDate(e.date)}</TD>
                  <TD><Badge tone="muted">{e.category}</Badge></TD>
                  <TD className="text-sm text-muted-foreground">{e.note}</TD>
                  <TD className="font-medium text-danger">-{money(e.amount)}</TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </Card>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Add an expense"
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button
              disabled={!form.amount}
              onClick={() => {
                addExpense({ category: form.category, amount: Number(form.amount), date: form.date, note: form.note });
                toast("Expense recorded.");
                setOpen(false);
                setForm({ category: "Advertising", amount: 0, date: new Date().toISOString().slice(0, 10), note: "" });
              }}
            >
              Save expense
            </Button>
          </>
        }
      >
        <div className="grid gap-3">
          <Field label="Category">
            <Select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as Expense["category"] })}>
              <option value="Advertising">Advertising</option>
              <option value="Assistant pay">Assistant pay</option>
              <option value="Printing">Printing</option>
              <option value="Delivery">Delivery</option>
              <option value="Other">Other</option>
            </Select>
          </Field>
          <Field label="Amount (LKR)"><Input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })} /></Field>
          <Field label="Date"><Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></Field>
          <Field label="Note"><Input value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} placeholder="What was this for?" /></Field>
        </div>
      </Modal>
    </div>
  );
}
