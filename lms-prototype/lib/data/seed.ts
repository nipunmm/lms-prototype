import type {
  ActivityEntry, AttendanceRecord, CallbackRequest, ClassRecord, ContentItem, DailyQuestion, Enrolment, Exam, ExamResult,
  Expense, Faq, HookConfig, ImportantDate, JoinRequest, Lead, Message, Nudge, Payment, ResultWallItem, Role, Session,
  Settings, StaffAccount, Student, TeacherProfile, Testimonial, TuteDispatch, TuteRequest, Update,
} from "../types";

export interface DB {
  teacher: TeacherProfile; classes: ClassRecord[]; students: Student[]; enrolments: Enrolment[]; requests: JoinRequest[];
  payments: Payment[]; sessions: Session[]; attendance: AttendanceRecord[]; content: ContentItem[]; exams: Exam[];
  results: ExamResult[]; dailyQuestions: DailyQuestion[]; dispatches: TuteDispatch[]; tuteRequests: TuteRequest[];
  messages: Message[]; callbacks: CallbackRequest[]; leads: Lead[]; updates: Update[]; testimonials: Testimonial[];
  resultsWall: ResultWallItem[]; faqs: Faq[]; importantDates: ImportantDate[]; hooks: HookConfig[]; nudges: Nudge[];
  roles: Role[]; staff: StaffAccount[]; activity: ActivityEntry[]; expenses: Expense[]; settings: Settings;
}

const b = (en: string, si: string) => ({ en, si });

export function createSeed(): DB {
  const teacher: TeacherProfile = {
    name: "Mr. Sanjeewa Perera",
    headline: b("A/L Combined Maths, taught with clarity and results.", "පැහැදිලිව, ප්‍රතිඵල සමඟ උසස් පෙළ සංයුක්ත ගණිතය."),
    subject: b("Combined Mathematics", "සංයුක්ත ගණිතය"),
    promise: b(
      "Live Zoom classes, recordings, printed tutes by post, weekly papers and progress tracking — everything in one place for 2026 & 2027 A/L students.",
      "Zoom සජීවී පන්ති, පටිගත කිරීම්, තැපෑලෙන් ටියුට්, සතිපතා ප්‍රශ්න පත්‍ර සහ ප්‍රගති නිරීක්ෂණය — 2026 සහ 2027 උසස් පෙළ සිසුන්ට සියල්ල එකම තැනක.",
    ),
    story: b(
      "For 18 years I have helped A/L students master Combined Mathematics with a simple, exam-focused method: strong theory, guided practice and constant feedback. Classes are live and personal, with recordings and materials available in the LMS so no one falls behind.",
      "වසර 18ක් පුරා උසස් පෙළ සිසුන්ට සංයුක්ත ගණිතය ජය ගැනීමට උපකාර කර ඇත්තේ සරල, විභාග කේන්ද්‍රීය ක්‍රමයකින් — ශක්තිමත් සිද්ධාන්තය, මඟපෙන්වන පුහුණුව සහ අඛණ්ඩ ප්‍රතිපෝෂණය. පන්ති සජීවීව සහ සමීපව සිදුවන අතර, පටිගත කිරීම් සහ අධ්‍යයන ද්‍රව්‍ය LMS තුළ ලබාගත හැකි නිසා කිසිවෙකු පසු නොවේ.",
    ),
    experienceYears: 18, studentsTaught: 9200,
    phone: "+94 77 123 4567", whatsapp: "+94 77 123 4567", email: "hello@sanjeewa-maths.lk",
    facebook: "facebook.com/sanjeewamaths", youtube: "youtube.com/@sanjeewamaths", avatarHue: 174,
  };

  const classes: ClassRecord[] = [
    { id: "c-theory-a", subject: "Combined Mathematics", type: "Theory", medium: "Sinhala", batch: "2026 A/L · Theory · Saturday", monthlyFee: 3500, capacity: 40, enrolled: 32, status: "open", active: true, shownOnWebsite: true, includedWithTheory: false, timetable: [{ day: "Sat", start: "08:00", end: "10:30" }], groupLink: "https://chat.whatsapp.com/demo-theory-a", description: b("Full syllabus theory with weekly assignments and exam-style questions.", "සම්පූර්ණ විෂය නිර්දේශ සිද්ධාන්තය, සතිපතා පැවරුම් සහ විභාග විලාසයේ ප්‍රශ්න සමඟ."), startDate: "2026-01-10" },
    { id: "c-theory-b", subject: "Combined Mathematics", type: "Theory", medium: "Sinhala", batch: "2026 A/L · Theory · Sunday", monthlyFee: 3500, capacity: 40, enrolled: 28, status: "open", active: true, shownOnWebsite: true, includedWithTheory: false, timetable: [{ day: "Sun", start: "17:00", end: "19:30" }], groupLink: "https://chat.whatsapp.com/demo-theory-b", description: b("Evening theory batch for students who need a later time.", "පස්වරු/සවස් වේලාවක් අවශ්‍ය සිසුන් සඳහා සිද්ධාන්ත කණ්ඩායම."), startDate: "2026-01-11" },
    { id: "c-theory-en", subject: "Combined Mathematics", type: "Theory", medium: "English", batch: "2026 A/L · English Medium · Wednesday", monthlyFee: 4000, capacity: 30, enrolled: 30, status: "full", active: true, shownOnWebsite: true, includedWithTheory: false, timetable: [{ day: "Wed", start: "19:00", end: "21:30" }], groupLink: "https://chat.whatsapp.com/demo-theory-en", description: b("English-medium theory class covering the full A/L syllabus.", "සම්පූර්ණ උසස් පෙළ විෂය නිර්දේශය ආවරණය කරන ඉංග්‍රීසි මාධ්‍ය සිද්ධාන්ත පන්තිය."), startDate: "2026-01-07" },
    { id: "c-rev-si", subject: "Combined Mathematics", type: "Revision", medium: "Sinhala", batch: "2026 A/L · Revision", monthlyFee: 2500, capacity: 60, enrolled: 41, status: "open", active: true, shownOnWebsite: true, includedWithTheory: true, theoryParentId: "c-theory-a", timetable: [{ day: "Tue", start: "18:30", end: "20:30" }], description: b("Exam-focused revision. Free for active Theory students of this batch.", "විභාග කේන්ද්‍රීය පුනරීක්ෂණය. මෙම කණ්ඩායමේ ක්‍රියාකාරී සිද්ධාන්ත සිසුන්ට නොමිලේ."), startDate: "2026-06-02" },
    { id: "c-paper-si", subject: "Combined Mathematics", type: "Paper", medium: "Sinhala", batch: "2026 A/L · Paper Discussion", monthlyFee: 2000, capacity: 60, enrolled: 22, status: "open", active: true, shownOnWebsite: true, includedWithTheory: true, theoryParentId: "c-theory-a", timetable: [{ day: "Thu", start: "18:30", end: "20:30" }], description: b("Past and model papers discussed question by question with marking guidance.", "පසුගිය සහ ආදර්ශ ප්‍රශ්න පත්‍ර ලකුණු මඟපෙන්වීම සමඟ ප්‍රශ්නයෙන් ප්‍රශ්නය සාකච්ඡා කරයි."), startDate: "2026-06-04" },
    { id: "c-theory-2027", subject: "Combined Mathematics", type: "Theory", medium: "Sinhala", batch: "2027 A/L · New Batch", monthlyFee: 3500, capacity: 45, enrolled: 12, status: "open", active: true, shownOnWebsite: true, includedWithTheory: false, timetable: [{ day: "Fri", start: "17:00", end: "19:30" }], description: b("New 2027 batch from fundamentals — ideal if you are beginning early.", "මූලික කරුණු වලින් 2027 නව කණ්ඩායම — කලින් ආරම්භ කරන සිසුන්ට සුදුසුය."), startDate: "2026-11-06" },
  ];

  const students: Student[] = [
    { id: "s1", name: "Nimal Perera", nickname: "NimalP", mobile: "+94771234567", google: false, language: "si", state: "active", source: "Friend", joined: "2026-01-05", active: true, avatarHue: 210, points: 120, streak: 4, bestStreak: 7, accuracy: 78 },
    { id: "s2", name: "Kavindi Silva", nickname: "Kavi", mobile: "+94772345678", google: true, language: "si", state: "active", source: "Facebook", joined: "2026-01-10", active: true, avatarHue: 160, points: 95, streak: 2, bestStreak: 5, accuracy: 72 },
    { id: "s3", name: "Arun Kumar", nickname: "Arun", mobile: "+94773456789", google: true, language: "en", state: "active", source: "Google", joined: "2026-02-01", active: true, avatarHue: 30, points: 60, streak: 1, bestStreak: 3, accuracy: 65 },
  ];

  const enrolments: Enrolment[] = [
    { id: "e1", studentId: "s1", classId: "c-theory-a", status: "active", startedAt: "2026-01-10" },
    { id: "e2", studentId: "s2", classId: "c-theory-a", status: "active", startedAt: "2026-01-12" },
    { id: "e3", studentId: "s3", classId: "c-theory-en", status: "active", startedAt: "2026-02-02" },
  ];

  const resultsWall: ResultWallItem[] = [
    { id: "r1", studentName: "K. Fernando", achievement: b("Island Rank 12 · A for Combined Maths (2025)", "දිවයිනෙන් 12 · සංයුක්ත ගණිතය A (2025)"), year: 2025, approved: true },
    { id: "r2", studentName: "S. Jayasinghe", achievement: b("District 1st · A pass (2025)", "දිස්ත්‍රික්කයෙන් 1 · A සාමාර්ථය (2025)"), year: 2025, approved: true },
    { id: "r3", studentName: "M. Perera", achievement: b("A pass · University of Moratuwa Engineering", "A සාමාර්ථය · මොරටුව විශ්වවිද්‍යාල ඉංජිනේරු"), year: 2024, approved: true },
    { id: "r4", studentName: "D. Silva", achievement: b("Improved from S to A in 8 months", "මාස 8කින් S සිට A දක්වා"), year: 2025, approved: true },
  ];

  const testimonials: Testimonial[] = [
    { id: "t1", studentName: "Nimal P. (2025 A/L)", quote: b("The explanations are clear and weekly papers built my confidence. Recordings helped whenever I missed a class.", "පාඩම් පැහැදිලියි. සතිපතා ප්‍රශ්න පත්‍ර මට විශ්වාසයක් දුන්නා. පන්තියක් මගහැරුන විට පටිගත කිරීම් උපකාරී වුණා."), video: false, approved: true, permissionHeld: true },
    { id: "t2", studentName: "Kavindi S. (2026 batch)", quote: b("I joined the 2027 batch early. The LMS, tutes by post and quick feedback keep me on track every week.", "මම කලින්ම 2027 කණ්ඩායමට එකතු වුණා. LMS, තැපෑලෙන් ටියුට් සහ ඉක්මන් ප්‍රතිපෝෂණය සෑම සතියකම මාව නිවැරදි මාර්ගයේ තබයි."), video: false, approved: true, permissionHeld: true },
  ];

  const updates: Update[] = [
    { id: "u1", title: b("2027 A/L New Theory Batch — Admissions Open", "2027 උසස් පෙළ නව සිද්ධාන්ත කණ්ඩායම — ඇතුළත් කිරීම් විවෘතයි"), body: b("Friday 5.00–7.30 PM (Sinhala medium). Limited seats. Request to join from the website or LMS.", "සිකුරාදා ප.ව. 5.00–7.30 (සිංහල මාධ්‍ය). ආසන සීමිතයි. වෙබ් අඩවියෙන් හෝ LMS හරහා එකතු වීමට ඉල්ලන්න."), kind: "update", published: true, showFrom: "2026-10-01", showUntil: "2026-12-31" },
    { id: "u2", title: b("April Holiday Revision Programme", "අප්‍රේල් නිවාඩු පුනරීක්ෂණ වැඩසටහන"), body: b("Special revision + model paper series for 2026 candidates. Schedule shared in class groups.", "2026 අපේක්ෂකයින් සඳහා විශේෂ පුනරීක්ෂණ සහ ආදර්ශ ප්‍රශ්න පත්‍ර මාලාව. කාලසටහන පන්ති කණ්ඩායම්වල දැනුම් දෙනු ඇත."), kind: "event", published: true, showFrom: "2026-03-01", showUntil: "2026-04-30", eventDate: "2026-04-10" },
    { id: "u3", title: b("Printed tutes dispatched for March", "මාර්තු මාසයේ මුද්‍රිත ටියුට් යවා ඇත"), body: b("March tutes have been posted to active students. Track delivery status inside your LMS.", "මාර්තු ටියුට් ක්‍රියාකාරී සිසුන්ට තැපැල් කර ඇත. බෙදාහැරීමේ තත්ත්වය LMS තුළ බලන්න."), kind: "update", published: true, showFrom: "2026-03-05", showUntil: "2026-03-31" },
  ];

  const faqs: Faq[] = [
    { id: "f1", question: b("How do I join a class?", "පන්තියකට එකතු වන්නේ කෙසේද?"), answer: b("Create a free student account, choose your class and send a join request. Once approved, pay and access class materials in the LMS.", "නොමිලේ ශිෂ්‍ය ගිණුමක් සාදා පන්තිය තෝරා එකතු වීමේ ඉල්ලීමක් යවන්න. අනුමත වූ පසු ගෙවා LMS තුළ අධ්‍යයන ද්‍රව්‍ය ලබාගන්න.") },
    { id: "f2", question: b("Are classes live? What if I miss one?", "පන්ති සජීවීද? මගහැරුනොත්?"), answer: b("Classes are live on Zoom. Recordings and notes are uploaded to the LMS so you can catch up anytime.", "පන්ති Zoom හරහා සජීවීයි. පටිගත කිරීම් සහ සටහන් LMS වෙත එක් වන නිසා ඕනෑම වේලාවක නැවත ඉගෙනගත හැක.") },
    { id: "f3", question: b("How can I pay the class fee?", "පන්ති ගාස්තු ගෙවන්නේ කෙසේද?"), answer: b("Pay online in LKR (card/online banking) or upload a bank deposit slip for staff approval.", "LKR වලින් මාර්ගගතව ගෙවන්න හෝ බැංකු තැන්පත් රිසිට්පතක් උඩුගත කර අනුමැතිය ලබාගන්න.") },
    { id: "f4", question: b("Do you teach in Sinhala and English medium?", "සිංහල සහ ඉංග්‍රීසි මාධ්‍ය පන්ති තිබේද?"), answer: b("Yes. Each batch shows its medium clearly. Use the language toggle to read details in Sinhala or English.", "ඔව්. සෑම කණ්ඩායමකම මාධ්‍යය පැහැදිලිව දක්වා ඇත. භාෂා මාරුවෙන් විස්තර සිංහල/ඉංග්‍රීසියෙන් කියවන්න.") },
  ];

  const requests: JoinRequest[] = [];
  const payments: Payment[] = [];
  const sessions: Session[] = [];
  const attendance: AttendanceRecord[] = [];
  const content: ContentItem[] = [];
  const exams: Exam[] = [];
  const results: ExamResult[] = [];
  const dailyQuestions: DailyQuestion[] = [];
  const dispatches: TuteDispatch[] = [];
  const tuteRequests: TuteRequest[] = [];
  const messages: Message[] = [];
  const callbacks: CallbackRequest[] = [];
  const leads: Lead[] = [];
  const importantDates: ImportantDate[] = [];
  const hooks: HookConfig[] = [];
  const nudges: Nudge[] = [];
  const roles: Role[] = [
    { name: "Teacher", actions: ["all"], dashboard: ["overview"], locked: true },
    { name: "Assistant", actions: ["students.read", "payments.read"], dashboard: ["overview"] },
    { name: "System Admin", actions: ["all"], dashboard: ["overview"], locked: true },
  ];
  const staff: StaffAccount[] = [
    { id: "st1", name: "Admin", mobile: "+94770000000", role: "System Admin", active: true },
  ];
  const activity: ActivityEntry[] = [];
  const expenses: Expense[] = [];
  const settings: Settings = {
    platformName: "Sanjeewa Maths LMS",
    bankName: "Commercial Bank",
    bankAccount: "Sanjeewa Perera · 1234567890",
    bankBranch: "Colombo 07",
    verificationMethod: "sms",
    defaultLanguage: "si",
    overdueReminders: true,
    graceDays: 7,
    minPresentPct: 75,
    lateLimitMins: 10,
    absenceFollowUp: 2,
    zoomConnected: true,
    whatsappEnabled: true,
  };

  return {
    teacher, classes, students, enrolments, requests, payments, sessions, attendance, content, exams, results,
    dailyQuestions, dispatches, tuteRequests, messages, callbacks, leads, updates, testimonials, resultsWall,
    faqs, importantDates, hooks, nudges, roles, staff, activity, expenses, settings,
  };
}
