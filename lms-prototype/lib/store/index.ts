"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { createSeed, type DB } from "../data/seed";
import type {
  AttendanceStatus,
  CallbackRequest,
  ClassRecord,
  ContentItem,
  Exam,
  Expense,
  JoinRequest,
  Lang,
  Nudge,
  Payment,
  PaymentMethod,
  RoleName,
  Settings,
  Student,
  TuteStage,
  Update,
} from "../types";
import { uid } from "../format";

export interface AppState {
  db: DB;

  // ----- Demo session / context -----
  siteLang: Lang;
  lmsLang: Lang;
  currentStudentId: string;
  staffSignedIn: boolean;
  currentStaffId: string;
  currentRole: RoleName;
  dailyAnswer: { choice: number; correct: boolean } | null;
  battleScore: number | null;

  // ----- language -----
  setSiteLang: (l: Lang) => void;
  setLmsLang: (l: Lang) => void;

  // ----- sessions -----
  setCurrentStudent: (id: string) => void;
  signInStaff: (staffId: string) => void;
  signOutStaff: () => void;
  setCurrentRole: (r: RoleName) => void;

  // ----- LMS actions -----
  answerDaily: (choice: number) => void;
  requestJoin: (classId: string, message: string) => void;
  submitPayment: (input: {
    studentId: string;
    classIds: string[];
    months: string[];
    amount: number;
    method: PaymentMethod;
    reference?: string;
    slipNote?: string;
  }) => void;
  saveAddress: (studentId: string, address: string, phone2: string, postOffice: string) => void;
  sendMessage: (studentId: string, body: string) => void;
  setBattleScore: (n: number) => void;

  // ----- Staff: join requests -----
  approveRequest: (id: string) => void;
  rejectRequest: (id: string, reason: string) => void;

  // ----- Staff: payments -----
  approvePayment: (id: string) => void;
  rejectPayment: (id: string, reason: string) => void;
  reversePayment: (id: string, note: string) => void;
  recordPayment: (input: {
    studentId: string;
    classIds: string[];
    months: string[];
    amount: number;
    method: PaymentMethod;
    reference?: string;
  }) => void;

  // ----- Staff: students -----
  setEnrolmentStatus: (enrolmentId: string, status: "active" | "paused" | "ended") => void;
  setStudentActive: (studentId: string, active: boolean) => void;
  grantWaiver: (studentId: string, text: string) => void;
  addStudent: (s: Partial<Student> & { name: string; nickname: string; mobile: string }) => void;

  // ----- Staff: classes -----
  updateClass: (id: string, patch: Partial<ClassRecord>) => void;
  addClass: (c: ClassRecord) => void;

  // ----- Staff: content -----
  addContent: (c: ContentItem) => void;
  toggleContentActive: (id: string) => void;

  // ----- Staff: website content -----
  updateTeacher: (patch: Partial<DB["teacher"]>) => void;
  addUpdate: (u: Omit<Update, "id">) => void;
  toggleUpdatePublished: (id: string) => void;
  deleteUpdate: (id: string) => void;
  approveTestimonial: (id: string, approved: boolean) => void;
  approveResultWall: (id: string, approved: boolean) => void;
  updateSettings: (patch: Partial<Settings>) => void;

  // ----- Staff: growth -----
  toggleHook: (id: string) => void;
  updateNudge: (id: string, patch: Partial<Nudge>) => void;
  addFollowUp: (leadId: string, type: "called" | "messaged" | "not-interested", note: string) => void;

  // ----- Staff: communication -----
  replyMessage: (studentId: string, body: string) => void;
  markThreadRead: (studentId: string) => void;
  setCallbackStatus: (id: string, status: CallbackRequest["status"]) => void;
  addCallback: (input: { name: string; phone: string; interest: string; note: string }) => void;

  // ----- Staff: attendance -----
  correctAttendance: (id: string, status: AttendanceStatus, note: string) => void;

  // ----- Staff: tutes -----
  setDispatchStage: (id: string, stage: TuteStage, courier?: string, tracking?: string) => void;
  resolveTuteRequest: (id: string, status: "approved" | "rejected") => void;

  // ----- Staff: assessments -----
  toggleExamPublished: (id: string) => void;
  addExam: (e: Exam) => void;
  markResult: (id: string, patch: { mcqMark?: number; paperMark?: number; marked?: boolean; comment?: string }) => void;

  // ----- Staff: access -----
  setStaffRole: (staffId: string, role: RoleName) => void;
  setStaffActive: (staffId: string, active: boolean) => void;

  // ----- Staff: finance -----
  addExpense: (e: Omit<Expense, "id">) => void;

  // ----- demo -----
  reset: () => void;
}

const initialSession = {
  siteLang: "si" as Lang,
  lmsLang: "si" as Lang,
  currentStudentId: "STU-1001",
  staffSignedIn: false,
  currentStaffId: "st1",
  currentRole: "Teacher" as RoleName,
  dailyAnswer: null,
  battleScore: null,
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      db: createSeed(),
      ...initialSession,

      setSiteLang: (l) => set({ siteLang: l }),
      setLmsLang: (l) => {
        set({ lmsLang: l });
        const id = get().currentStudentId;
        set((s) => ({
          db: {
            ...s.db,
            students: s.db.students.map((st) => (st.id === id ? { ...st, language: l } : st)),
          },
        }));
      },
      setCurrentStudent: (id) => set({ currentStudentId: id }),
      signInStaff: (staffId) =>
        set((s) => {
          const staff = s.db.staff.find((x) => x.id === staffId);
          return { staffSignedIn: true, currentStaffId: staffId, currentRole: staff?.role ?? s.currentRole };
        }),
      signOutStaff: () => set({ staffSignedIn: false }),
      setCurrentRole: (r) => set({ currentRole: r }),

      answerDaily: (choice) =>
        set((s) => {
          const q = s.db.dailyQuestions[0];
          const correct = q ? choice === q.answer : false;
          const gain = correct ? 10 : 0;
          return {
            dailyAnswer: { choice, correct },
            db: {
              ...s.db,
              students: s.db.students.map((st) =>
                st.id === s.currentStudentId
                  ? {
                      ...st,
                      points: st.points + gain,
                      streak: correct ? st.streak + 1 : 0,
                      bestStreak: correct ? Math.max(st.bestStreak, st.streak + 1) : st.bestStreak,
                    }
                  : st,
              ),
            },
          };
        }),
      setBattleScore: (n) => set({ battleScore: n }),

      requestJoin: (classId, message) =>
        set((s) => {
          const r: JoinRequest = {
            id: uid("r"),
            studentId: s.currentStudentId,
            classId,
            message,
            status: "pending",
            createdAt: new Date().toISOString(),
          };
          return {
            db: {
              ...s.db,
              requests: [r, ...s.db.requests],
              students: s.db.students.map((st) =>
                st.id === s.currentStudentId ? { ...st, state: "awaiting-approval" } : st,
              ),
            },
          };
        }),

      submitPayment: ({ studentId, classIds, months, amount, method, reference, slipNote }) =>
        set((s) => {
          const p: Payment = {
            id: uid("p"),
            studentId,
            classIds,
            months,
            amount,
            method,
            status: method === "online" ? "confirmed" : "pending",
            reference: reference || `${method.toUpperCase()}-${Math.floor(Math.random() * 90000 + 10000)}`,
            slipNote,
            createdAt: new Date().toISOString(),
            confirmedAt: method === "online" ? new Date().toISOString() : undefined,
          };
          return { db: { ...s.db, payments: [p, ...s.db.payments] } };
        }),

      saveAddress: (studentId, address, phone2, postOffice) =>
        set((s) => ({
          db: {
            ...s.db,
            students: s.db.students.map((st) =>
              st.id === studentId ? { ...st, guardianMobile: st.guardianMobile ?? phone2 } : st,
            ),
          },
        })),

      sendMessage: (studentId, body) =>
        set((s) => ({
          db: {
            ...s.db,
            messages: [
              ...s.db.messages,
              { id: uid("m"), studentId, from: "staff", body, at: new Date().toISOString(), read: true },
            ],
          },
        })),

      approveRequest: (id) =>
        set((s) => {
          const req = s.db.requests.find((r) => r.id === id);
          if (!req) return {};
          const newEnrol = {
            id: uid("e"),
            studentId: req.studentId,
            classId: req.classId,
            status: "active" as const,
            startedAt: new Date().toISOString(),
          };
          return {
            db: {
              ...s.db,
              requests: s.db.requests.map((r) => (r.id === id ? { ...r, status: "approved" } : r)),
              enrolments: [...s.db.enrolments, newEnrol],
              students: s.db.students.map((st) =>
                st.id === req.studentId ? { ...st, state: "active" } : st,
              ),
              classes: s.db.classes.map((c) =>
                c.id === req.classId ? { ...c, enrolled: c.enrolled + 1 } : c,
              ),
            },
          };
        }),

      rejectRequest: (id, reason) =>
        set((s) => {
          const req = s.db.requests.find((r) => r.id === id);
          return {
            db: {
              ...s.db,
              requests: s.db.requests.map((r) => (r.id === id ? { ...r, status: "rejected", reason } : r)),
              students: s.db.students.map((st) =>
                st.id === req?.studentId ? { ...st, state: "not-in-class" } : st,
              ),
            },
          };
        }),

      approvePayment: (id) =>
        set((s) => ({
          db: {
            ...s.db,
            payments: s.db.payments.map((p) =>
              p.id === id ? { ...p, status: "confirmed", confirmedAt: new Date().toISOString() } : p,
            ),
          },
        })),
      rejectPayment: (id, reason) =>
        set((s) => ({
          db: {
            ...s.db,
            payments: s.db.payments.map((p) =>
              p.id === id ? { ...p, status: "rejected", rejectionReason: reason } : p,
            ),
          },
        })),
      reversePayment: (id, note) =>
        set((s) => ({
          db: {
            ...s.db,
            payments: s.db.payments.map((p) => (p.id === id ? { ...p, status: "reversed" } : p)),
            activity: [
              {
                id: uid("ac"),
                actor: "You",
                action: "PAY-06",
                detail: `Reversed payment. Note: ${note}`,
                at: new Date().toISOString(),
              },
              ...s.db.activity,
            ],
          },
        })),
      recordPayment: ({ studentId, classIds, months, amount, method, reference }) =>
        set((s) => {
          const p: Payment = {
            id: uid("p"),
            studentId,
            classIds,
            months,
            amount,
            method,
            status: "confirmed",
            reference: reference || `CASH-${Math.floor(Math.random() * 9000 + 1000)}`,
            createdAt: new Date().toISOString(),
            confirmedAt: new Date().toISOString(),
          };
          return { db: { ...s.db, payments: [p, ...s.db.payments] } };
        }),

      setEnrolmentStatus: (enrolmentId, status) =>
        set((s) => ({
          db: {
            ...s.db,
            enrolments: s.db.enrolments.map((e) => (e.id === enrolmentId ? { ...e, status } : e)),
          },
        })),
      setStudentActive: (studentId, active) =>
        set((s) => ({
          db: {
            ...s.db,
            students: s.db.students.map((st) => (st.id === studentId ? { ...st, active } : st)),
          },
        })),
      grantWaiver: (studentId, text) =>
        set((s) => ({
          db: {
            ...s.db,
            students: s.db.students.map((st) =>
              st.id === studentId ? { ...st, feeWaiver: text || undefined } : st,
            ),
          },
        })),
      addStudent: (input) =>
        set((s) => {
          const num = 1000 + s.db.students.length + 1;
          const st: Student = {
            id: `STU-${num}`,
            name: input.name,
            nickname: input.nickname,
            mobile: input.mobile,
            google: input.google ?? false,
            language: input.language ?? s.db.settings.defaultLanguage,
            state: "not-in-class",
            source: input.source ?? "other",
            joined: new Date().toISOString(),
            active: true,
            avatarHue: Math.floor(Math.random() * 360),
            points: 0,
            streak: 0,
            bestStreak: 0,
            accuracy: 0,
          };
          return { db: { ...s.db, students: [st, ...s.db.students] } };
        }),

      updateClass: (id, patch) =>
        set((s) => ({
          db: { ...s.db, classes: s.db.classes.map((c) => (c.id === id ? { ...c, ...patch } : c)) },
        })),
      addClass: (c) => set((s) => ({ db: { ...s.db, classes: [c, ...s.db.classes] } })),

      addContent: (c) => set((s) => ({ db: { ...s.db, content: [c, ...s.db.content] } })),
      toggleContentActive: (id) =>
        set((s) => ({
          db: {
            ...s.db,
            content: s.db.content.map((c) => (c.id === id ? { ...c, active: !c.active } : c)),
          },
        })),

      updateTeacher: (patch) =>
        set((s) => ({ db: { ...s.db, teacher: { ...s.db.teacher, ...patch } } })),
      addUpdate: (u) => set((s) => ({ db: { ...s.db, updates: [{ ...u, id: uid("u") }, ...s.db.updates] } })),
      toggleUpdatePublished: (id) =>
        set((s) => ({
          db: {
            ...s.db,
            updates: s.db.updates.map((u) => (u.id === id ? { ...u, published: !u.published } : u)),
          },
        })),
      deleteUpdate: (id) =>
        set((s) => ({ db: { ...s.db, updates: s.db.updates.filter((u) => u.id !== id) } })),
      approveTestimonial: (id, approved) =>
        set((s) => ({
          db: {
            ...s.db,
            testimonials: s.db.testimonials.map((t) => (t.id === id ? { ...t, approved } : t)),
          },
        })),
      approveResultWall: (id, approved) =>
        set((s) => ({
          db: {
            ...s.db,
            resultsWall: s.db.resultsWall.map((r) => (r.id === id ? { ...r, approved } : r)),
          },
        })),
      updateSettings: (patch) =>
        set((s) => ({ db: { ...s.db, settings: { ...s.db.settings, ...patch } } })),

      toggleHook: (id) =>
        set((s) => ({
          db: { ...s.db, hooks: s.db.hooks.map((h) => (h.id === id ? { ...h, enabled: !h.enabled } : h)) },
        })),
      updateNudge: (id, patch) =>
        set((s) => ({
          db: { ...s.db, nudges: s.db.nudges.map((n) => (n.id === id ? { ...n, ...patch } : n)) },
        })),
      addFollowUp: (leadId, type, note) =>
        set((s) => ({
          db: {
            ...s.db,
            leads: s.db.leads.map((l) =>
              l.id === leadId
                ? { ...l, followUpType: type, followUpNote: note, lastFollowUp: new Date().toISOString() }
                : l,
            ),
          },
        })),

      replyMessage: (studentId, body) =>
        set((s) => ({
          db: {
            ...s.db,
            messages: [
              ...s.db.messages,
              { id: uid("m"), studentId, from: "staff", body, at: new Date().toISOString(), read: true },
            ],
          },
        })),
      markThreadRead: (studentId) =>
        set((s) => ({
          db: {
            ...s.db,
            messages: s.db.messages.map((m) =>
              m.studentId === studentId ? { ...m, read: true } : m,
            ),
          },
        })),
      setCallbackStatus: (id, status) =>
        set((s) => ({
          db: { ...s.db, callbacks: s.db.callbacks.map((c) => (c.id === id ? { ...c, status } : c)) },
        })),
      addCallback: (input) =>
        set((s) => ({
          db: {
            ...s.db,
            callbacks: [
              {
                id: uid("cb"),
                name: input.name,
                phone: input.phone,
                interest: input.interest,
                note: input.note,
                status: "new" as const,
                createdAt: new Date().toISOString(),
              },
              ...s.db.callbacks,
            ],
          },
        })),

      correctAttendance: (id, status, note) =>
        set((s) => ({
          db: {
            ...s.db,
            attendance: s.db.attendance.map((a) => (a.id === id ? { ...a, status, note } : a)),
          },
        })),

      setDispatchStage: (id, stage, courier, tracking) =>
        set((s) => ({
          db: {
            ...s.db,
            dispatches: s.db.dispatches.map((d) =>
              d.id === id
                ? { ...d, stage, courier: courier ?? d.courier, tracking: tracking ?? d.tracking }
                : d,
            ),
          },
        })),
      resolveTuteRequest: (id, status) =>
        set((s) => ({
          db: {
            ...s.db,
            tuteRequests: s.db.tuteRequests.map((t) => (t.id === id ? { ...t, status } : t)),
          },
        })),

      toggleExamPublished: (id) =>
        set((s) => ({
          db: {
            ...s.db,
            exams: s.db.exams.map((e) => (e.id === id ? { ...e, published: !e.published } : e)),
          },
        })),
      addExam: (e) => set((s) => ({ db: { ...s.db, exams: [e, ...s.db.exams] } })),
      markResult: (id, patch) =>
        set((s) => ({
          db: {
            ...s.db,
            results: s.db.results.map((r) =>
              r.id === id ? { ...r, ...patch, marked: patch.marked ?? r.marked } : r,
            ),
          },
        })),

      addExpense: (e) => set((s) => ({ db: { ...s.db, expenses: [{ ...e, id: uid("x") }, ...s.db.expenses] } })),

      setStaffRole: (staffId, role) =>
        set((s) => ({
          db: { ...s.db, staff: s.db.staff.map((x) => (x.id === staffId ? { ...x, role } : x)) },
        })),
      setStaffActive: (staffId, active) =>
        set((s) => ({
          db: { ...s.db, staff: s.db.staff.map((x) => (x.id === staffId ? { ...x, active } : x)) },
        })),

      reset: () => set({ db: createSeed(), ...initialSession }),
    }),
    {
      name: "lmsv8-demo",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (s) => ({ db: s.db, siteLang: s.siteLang, lmsLang: s.lmsLang, currentStudentId: s.currentStudentId }) as AppState,
    },
  ),
);
