export type Lang = "en" | "si";

/** A text value that must exist in both languages (Section 23). */
export type Bilingual = { en: string; si: string };

export type ClassType = "Theory" | "Revision" | "Paper";
export type Medium = "Sinhala" | "English";
export type ClassStatus = "open" | "full" | "closed";

export interface TimetableSlot {
  day: "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
  start: string; // "18:00"
  end: string; // "20:00"
}

export interface ClassRecord {
  id: string;
  subject: string;
  type: ClassType;
  medium: Medium;
  batch: string;
  monthlyFee: number;
  capacity: number;
  enrolled: number;
  status: ClassStatus;
  active: boolean;
  shownOnWebsite: boolean;
  /** true when Revision/Paper is included free for active Theory students */
  includedWithTheory: boolean;
  theoryParentId?: string;
  timetable: TimetableSlot[];
  groupLink?: string;
  description: Bilingual;
  startDate: string;
}

export type StudentState = "not-in-class" | "awaiting-approval" | "active";

export interface Student {
  id: string; // permanent Student ID
  name: string;
  nickname: string;
  mobile: string;
  guardianMobile?: string;
  google: boolean;
  language: Lang;
  state: StudentState;
  source: string;
  joined: string;
  active: boolean;
  feeWaiver?: string;
  avatarHue: number;
  points: number;
  streak: number;
  bestStreak: number;
  accuracy: number;
}

export type EnrolmentStatus = "active" | "paused" | "ended";
export interface Enrolment {
  id: string;
  studentId: string;
  classId: string;
  status: EnrolmentStatus;
  startedAt: string;
}

export type RequestStatus = "pending" | "approved" | "rejected";
export interface JoinRequest {
  id: string;
  studentId: string;
  classId: string;
  message: string;
  status: RequestStatus;
  reason?: string;
  createdAt: string;
}

export type PaymentStatus = "pending" | "confirmed" | "rejected" | "reversed";
export type PaymentMethod = "online" | "slip" | "cash";
export interface Payment {
  id: string;
  studentId: string;
  classIds: string[];
  months: string[];
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  reference: string;
  slipNote?: string;
  rejectionReason?: string;
  createdAt: string;
  confirmedAt?: string;
  duplicateFlag?: boolean;
  isAdjustment?: boolean;
}

export interface Session {
  id: string;
  classId: string;
  date: string;
  start: string;
  end: string;
  status: "scheduled" | "live" | "completed" | "cancelled";
  openClass: boolean;
  recordingUrl?: string;
}

export type AttendanceStatus = "present" | "late" | "absent" | "excused";
export interface AttendanceRecord {
  id: string;
  sessionId: string;
  studentId: string;
  status: AttendanceStatus;
  note?: string;
}

export type ContentKind = "note" | "video" | "paper" | "pastpaper";
export interface ContentItem {
  id: string;
  subject: string;
  topic: string;
  kind: ContentKind;
  language: Medium;
  classOnly: boolean;
  viewOnly: boolean;
  releaseDate?: string;
  url?: string;
  active: boolean;
  forTypes: ClassType[];
}

export interface ExamQuestion {
  id: string;
  text: Bilingual;
  options: Bilingual[];
  answer: number;
  explanation: Bilingual;
}

export interface Exam {
  id: string;
  title: Bilingual;
  subject: string;
  type: ClassType;
  mode: "mcq" | "written";
  durationMins: number;
  published: boolean;
  totalMarks: number;
}

export interface ExamResult {
  id: string;
  examId: string;
  studentId: string;
  mcqMark: number;
  paperMark: number;
  submitted: boolean;
  marked: boolean;
  comment?: string;
}

export interface DailyQuestion {
  id: string;
  text: Bilingual;
  options: Bilingual[];
  answer: number;
  explanation: Bilingual;
  active: boolean;
}

export type TuteStage = "Confirmed" | "Packed" | "Posted" | "Delivered";
export interface TuteDispatch {
  id: string;
  classId: string;
  month: string;
  deliveryCost: number;
  stage: TuteStage;
  courier?: string;
  tracking?: string;
}
export interface TuteRequest {
  id: string;
  studentId: string;
  classId: string;
  reason: string;
  status: RequestStatus;
  createdAt: string;
}

export interface Message {
  id: string;
  studentId: string;
  from: "student" | "staff";
  body: string;
  at: string;
  read: boolean;
}

export interface CallbackRequest {
  id: string;
  name: string;
  phone: string;
  interest: string;
  note: string;
  status: "new" | "contacted" | "closed";
  createdAt: string;
}

export interface Lead {
  id: string;
  studentId: string;
  engagementScore: number;
  lastFollowUp?: string;
  followUpType?: "called" | "messaged" | "not-interested";
  followUpNote?: string;
}

export interface Update {
  id: string;
  title: Bilingual;
  body: Bilingual;
  kind: "update" | "event";
  eventDate?: string;
  showFrom: string;
  showUntil: string;
  published: boolean;
}

export interface Testimonial {
  id: string;
  studentName: string;
  quote: Bilingual;
  video: boolean;
  approved: boolean;
  permissionHeld: boolean;
}

export interface ResultWallItem {
  id: string;
  studentName: string;
  achievement: Bilingual;
  year: number;
  approved: boolean;
}

export interface Faq {
  id: string;
  question: Bilingual;
  answer: Bilingual;
}

export interface ImportantDate {
  id: string;
  title: Bilingual;
  date: string;
  scope: "everyone" | string; // class id
  kind: "official" | "test";
}

export interface HookConfig {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  points?: number;
}

export interface Nudge {
  id: string;
  day: number;
  message: Bilingual;
  channel: "in-app" | "whatsapp" | "both";
  enabled: boolean;
}

export type RoleName = "Teacher" | "Assistant" | "System Admin";
export interface Role {
  name: RoleName;
  actions: string[];
  dashboard: string[];
  locked?: boolean;
}
export interface StaffAccount {
  id: string;
  name: string;
  mobile: string;
  role: RoleName;
  active: boolean;
}
export interface ActivityEntry {
  id: string;
  actor: string;
  action: string;
  detail: string;
  at: string;
}
export interface Expense {
  id: string;
  category: "Advertising" | "Assistant pay" | "Printing" | "Delivery" | "Other";
  amount: number;
  date: string;
  note: string;
}

export interface Settings {
  platformName: string;
  bankName: string;
  bankAccount: string;
  bankBranch: string;
  verificationMethod: "sms" | "staff";
  defaultLanguage: Lang;
  overdueReminders: boolean;
  graceDays: number;
  minPresentPct: number;
  lateLimitMins: number;
  absenceFollowUp: number;
  zoomConnected: boolean;
  whatsappEnabled: boolean;
}

export interface TeacherProfile {
  name: string;
  headline: Bilingual;
  subject: Bilingual;
  promise: Bilingual;
  story: Bilingual;
  experienceYears: number;
  studentsTaught: number;
  phone: string;
  whatsapp: string;
  email: string;
  facebook: string;
  youtube: string;
  avatarHue: number;
}
