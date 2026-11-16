import type { Lang, Student, JoinRequest } from "./types";

/** LKR money. Currency label follows the language (Section 23.3). */
export function money(amount: number, lang: Lang = "en") {
  const n = amount.toLocaleString("en-LK", { maximumFractionDigits: 0 });
  return lang === "si" ? `රු. ${n}` : `Rs. ${n}`;
}

export function shortDate(iso: string, lang: Lang = "en") {
  const d = new Date(iso);
  const monthsEn = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthsSi = ["ජන", "පෙබ", "මාර්", "අප්‍රේ", "මැයි", "ජූනි", "ජූලි", "අගෝ", "සැප්", "ඔක්", "නොවැ", "දෙසැ"];
  const months = lang === "si" ? monthsSi : monthsEn;
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

export function daysUntil(iso: string) {
  const now = new Date();
  const target = new Date(iso);
  const ms = target.getTime() - now.getTime();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

export function timeAgo(iso: string) {
  const ms = Date.now() - new Date(iso).getTime();
  const mins = Math.round(ms / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
}

export function uid(prefix = "id") {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

export type AccountStatusView = {
  key: "not-in-class" | "awaiting-approval" | "active";
  labelKey: string;
  tone: "muted" | "warning" | "success";
};

export function getAccountStatus(student: Student | undefined): AccountStatusView {
  const key = student?.state ?? "not-in-class";
  if (key === "active") return { key, labelKey: "account.status.active", tone: "success" };
  if (key === "awaiting-approval") return { key, labelKey: "account.status.awaitingApproval", tone: "warning" };
  return { key: "not-in-class", labelKey: "account.status.notInClass", tone: "muted" };
}

export type ApplicationStatusView = {
  key: "none" | "pending" | "approved" | "rejected";
  labelKey: string;
  nextKey: string;
  tone: "muted" | "warning" | "success" | "danger";
  latest?: JoinRequest;
};

export function getApplicationStatus(requests: JoinRequest[], studentId: string): ApplicationStatusView {
  const mine = requests.filter((r) => r.studentId === studentId).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const latest = mine[0];
  if (!latest) return { key: "none", labelKey: "app.status.none", nextKey: "app.next.browse", tone: "muted" };
  if (latest.status === "pending") return { key: "pending", labelKey: "app.status.pending", nextKey: "app.next.pending", tone: "warning", latest };
  if (latest.status === "approved") return { key: "approved", labelKey: "app.status.approved", nextKey: "app.next.pay", tone: "success", latest };
  return { key: "rejected", labelKey: "app.status.rejected", nextKey: "app.next.rejected", tone: "danger", latest };
}
