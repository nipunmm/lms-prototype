# Solo Teacher Platform: Business Requirements

**Scope:** What the business needs. No architecture, deployment, security or technical design (security and privacy are covered in a separate document).
**First client:** One teacher. The platform is general: it works for any subject and any level a teacher offers.
**Market:** Sri Lanka only. Currency: LKR. Classes are fully online. Languages: **the Public Website and the Student LMS work in Sinhala and English, with a language toggle on every screen; the Staff Portal is in English only** (Section 23).
**Story IDs:** `WS-` Public Website, `LM-` Student LMS, `SP-` Staff Portal. **Action IDs:** three-letter area code and number (for example `PAY-06`), listed in Section 8.

---

## 1. The big idea

This is **not just a learning system. It is a student-attracting system.** Everything is placed so that strangers find the teacher, join for free, get hooked on free daily value, and become paying students who stay.

It is made of **three separate applications**, each with its own audience, address and sign-in:

| # | Application | Who uses it | Its job |
|---|---|---|---|
| 1 | **Public Website** | Anyone | **Persuade and inform.** The shop window: who the teacher is, what he teaches, what classes cost, what is happening, proof that it works. No sign-in, nothing interactive (apart from the language switch), nothing tracked. Sinhala and English. |
| 2 | **Student LMS** | Students | **Engage and teach.** Sinhala and English. Free to join. Free hooks that bring students back daily, joining and paying for classes, live classes, study material, exams, tutes. |
| 3 | **Staff Portal** | Teacher, assistant, System Admin | **Run and grow the business.** Manages everything the other two show, decides every request, and handles the growth system (hooks, leads, follow-up). English only; staff enter the content for the other two in both languages. Students can never reach it. |

**The journey**

```
Visitor ──► Public Website: sees the teacher, classes with fees and
            timetables, latest updates, results ──► taps "Join free"
                                    │
                                    ▼
                    Student LMS: free account (Google or mobile)
                                    │
        Free hooks bring them back every day (daily question, past papers,
        leaderboard, battles, open classes, exam countdown)
                                    │
             Requests a class ──► Staff approve ──► Pays ──► Attends on Zoom
                                    │
                   Tutes, results, reminders keep them learning and paying

Staff Portal ── manages all of the above, follows up warm leads, tunes the hooks
```

**Out of scope**
- Selling tutes, books, videos or any other product to outsiders (a separate project)
- Parent or guardian accounts
- AI tutor
- Free trials and waitlists
- Physical classes, QR attendance, student ID cards
- Teaching several subjects under one account at launch (the structure allows it later)
- International customers and currencies
- Hosting video files (videos live on YouTube; see Section 16)
- Students' spoken or recorded answers
- Blog, photo gallery, and sample lesson videos
- Mobile apps (planned for later)
- Tamil or any language other than Sinhala and English (the structure allows it later)
- The Staff Portal in Sinhala (staff work in English; they only type Sinhala content)
- Automatic machine translation of content
- Refunds sent back through the payment provider (see Section 13)

---

## 2. How the three applications connect

The Staff Portal is the **only place where business information is created or changed**. The other two applications show it or collect input from people.

| From → To | What flows |
|---|---|
| **Staff Portal → Public Website** | Teacher profile, what is taught, classes with their fees and timetables, latest updates and events, results and testimonials (once approved), community numbers, information pages, all in Sinhala and English |
| **Staff Portal → Student LMS** | Classes, fees, timetables, Zoom sessions, notes, papers, past papers, exams, exam dates, updates, approvals, payment decisions, marks, tute dispatches, daily question bank, message templates, all in Sinhala and English |
| **Student LMS → Staff Portal** | Registrations, join requests, payments and slips, student answers, attendance (from Zoom), tute requests, messages, hook activity |
| **Public Website → Staff Portal** | Call-back requests (the only personal data the website ever receives) |
| **Public Website → Student LMS** | A visitor follows "Join free" or "Student login". The only thing passed on is the language the visitor was reading, so the Student LMS opens in the same language |

**Rules**
1. **Staff change things only in the Staff Portal.** The Public Website and Student LMS never change business information by themselves.
2. **Enter once, show wherever it is needed.** A fee or a timetable is entered one time and appears on the website and in the Student LMS from that one entry, so the two can never disagree.
3. A change staff make **appears in the other applications without further steps**.
4. **Nothing from the Staff Portal is reachable by students or visitors.**
5. The three applications **do not depend on each other to stay up**: a busy website must not slow live classes, and a Staff Portal problem must not stop students from studying.
6. **Content is entered once, in both languages.** Staff type the English and the Sinhala version of each text side by side in the Staff Portal; the website and the Student LMS show the version for the language the person chose (Section 23).

---

## 3. Class structure and enrolment

Sri Lankan tuition runs on classes with their own fee and timetable, several batches for different time slots, and extra revision and paper classes near exams. A student often attends more than one. This is how the product handles it.

### 3.1 Terms

| Term | Meaning |
|---|---|
| **Subject** | What the class teaches (for example the teacher's subject). The structure allows several subjects |
| **Class type** | **Theory** (regular lessons), **Revision**, or **Paper** (past and model paper discussion) |
| **Medium** | Sinhala or English: the language the class is **taught** in. It is separate from the language a person chooses for the screens (Section 23) |
| **Batch** | A group with its own timetable (for example "Batch A, Saturday morning", or "2027 batch") |
| **Class** | One subject + type + medium + batch. A class has its own fee, timetable, capacity, Zoom sessions, attendance and payments |

### 3.2 Rules

1. **Classes decide what a student pays for and attends.** A student registers with only a name and nickname; no school or level is needed.
2. A student may be in **many classes at once** (for example a Theory class and its Revision class). Staff approve each one.
3. A student may be in **only one batch** of the same subject, type and medium at a time. Staff can move them to another batch.
4. **Revision and Paper classes are separate classes.** Each has its own fee, or is marked *included for active students of the Theory class of the same subject*, so no extra payment is needed.
5. **Study material is added once per subject** and tagged for the class types it serves. Every batch sees it automatically, so nothing is uploaded twice. **Recordings belong to a session**, so each batch has its own.
6. **Exams are set for a subject and class type** and taken by all its batches. Ranking is across all batches.
7. A **join request is for one class.** After approval the student pays monthly for it; access exists only for paid months.
8. At **the end of a term or year**, staff roll classes over: old classes are made inactive and new classes or batches are created, and students can be moved across in one step. All history stays.
9. A class shows on the website as **Admissions open**, **Full** (capacity reached) or **Closed**.

---

## 4. The growth system: hooks and conversion

The product's purpose is to turn strangers into paying students. Each stage has a job, and each hook lives in the one application where it works best.

### 4.1 The funnel

| Stage | Aim | What does the work | Where |
|---|---|---|---|
| **Attract** | Strangers find the teacher and trust him | Results wall, testimonials, latest updates and events, classes with fees, "Join free" | Public Website |
| **Sign up** | Turn a visitor into a known student, free | One-minute free account (Google or mobile) | Student LMS |
| **Engage** | Give a reason to return every day | Daily question and streak, free past papers, challenge leaderboard, quiz battles, badges, exam countdown, open classes, referral | Student LMS |
| **Convert** | Move free students into paying classes | Class list with fees, request to join, automatic nudges, warm-leads follow-up, open class invitations, referral rewards | Student LMS and Staff Portal |
| **Retain** | Keep them learning and paying | Zoom classes, attendance alerts, tutes, results, payment reminders, WhatsApp messages | All three |

### 4.2 The hooks

| Hook | Purpose | Where |
|---|---|---|
| **"Join free" account** | No cost barrier, so nobody has a reason to say no | Website → LMS |
| **Daily question** with streak | A 1-minute daily habit | LMS |
| **Free past papers** (by subject, year) | A strong reason to sign up and come back | LMS |
| **Challenge leaderboard** (nickname only) | Friendly competition | LMS |
| **Quiz battles** | Fun that spreads between friends | LMS |
| **Badges and levels** | A sense of progress | LMS |
| **Shareable result card** | Students advertise for the teacher | LMS |
| **Exam countdown and important dates** | Daily relevance, especially before exams | LMS |
| **Open class** (a free live Zoom session for all students) | The best sample of real teaching | LMS |
| **Referral link** with reward | Students bring friends | LMS |
| **Latest updates and events** | Shows the teacher is active and busy | Website (and LMS home) |
| **Results wall and testimonials** | Proof | Website |

### 4.3 Hook handling (Staff Portal)

The hooks need a management area so the teacher can see what is working and act on it.

- **Funnel view:** registered → requested a class → enrolled → paying, with conversion at each step, by source.
- **Hook engagement:** daily question answers, streaks, past-paper downloads, battles played, open-class attendance.
- **Warm leads list:** students not yet in a class, ordered by how engaged they are (streak, past papers downloaded, open classes attended, classes viewed, a pending request). Staff record each follow-up (called, messaged, not interested) with a note.
- **Automatic nudges** to students not yet in a class, with messages and timing chosen by staff. Examples: a welcome with the next open class (day 1), "your streak" (day 3), "classes you may like" (day 7), an invitation to request a class after an open class, and "revision class available" before exam dates. Students can opt out.
- **Hook switches and rules:** turn a hook on or off, set points and badge rules, set quiz battle rules.
- **Referral rewards:** the teacher decides the reward (for example a fee discount).
- **Source question:** at registration a student may say how they heard about the teacher (website, WhatsApp, friend, social media, school, other), so the teacher learns which channels work without tracking visitors.

**Rules**
1. A free account is free for good. Every hook is free.
2. Every hook ends on a **next step** (come back tomorrow, share, join an open class, request a class), never a dead end.
3. Nothing on the website needs a person's identity.
4. A hook that is not earning attention is switched off, not left to go stale.

---

## 5. What goes where: placement decisions

**Principles**
1. **The website persuades and informs. It never interacts and never tracks.** It is deliberately minimal and static: a few strong pages that need no upkeep beyond the single entries made in the Staff Portal. It answers five questions: *Who is the teacher? Does he or she teach what I need? Is the teacher good? What does it cost and when? How do I join?*
2. **The Student LMS is where everything interactive happens.** Hooks, joining, paying, learning.
3. **The Staff Portal is where everything is decided and managed.**
4. **Enter once, show wherever needed.** Fees and timetables are visible to visitors (they decide on them) but entered only once, in the Staff Portal.
5. **Only keep what adds value.** Every item has one home, and anything that does not help attract, convert, teach or retain has been left out.
6. **Sinhala and English everywhere a visitor or student looks; English only for staff.** The two public-facing applications carry a language toggle; the Staff Portal does not (Section 23).

**Placement table**

| Item | Public Website | Student LMS | Staff Portal |
|---|---|---|---|
| Teacher profile, photo, promise | Shows | | Edits |
| What is taught (short descriptions) | Shows | | Edits |
| **Classes with fees and weekly timetables** | Shows (open/full/closed) | Shows, with join request | Creates, sets once |
| How classes work, how to join, payment methods, FAQs | Shows | | Edits |
| **Latest updates and events** (new batches, changes, results, events) | Shows | Shows on home | Publishes |
| Results wall, testimonials, community numbers | Shows | | Manages and approves |
| Call-back request, WhatsApp button | Sends | | Inbox |
| "Join free" and "Student login" links | ✔ | | |
| **Language toggle (සිංහල / English)** | ✔ | ✔ | English only, no toggle |
| Sinhala and English versions of text | Shows the chosen one | Shows the chosen one | Enters both |
| Registration, sign-in, phone verification | | ✔ | Approves if needed |
| Daily question, streak, growth page | | ✔ | Manages the bank |
| Practice quizzes (saved), quiz battles, badges | | ✔ | Rules |
| Free past papers | | ✔ | Manages |
| Challenge leaderboard | | ✔ | Moderates |
| Exam countdown and important dates | | ✔ | Sets dates |
| Open classes | | ✔ | Marks sessions open |
| Referral link | | ✔ | Sets rewards |
| Join request | | Requests | Decides |
| Payments, receipts | | Pays, sees own | Verifies, records, reverses |
| Live class join (Zoom) | | Joins | Starts, monitors |
| Attendance | | Sees own | Reviews, corrects |
| Notes, recordings, papers | | Shows (enrolled) | Adds |
| Exams, marks, class ranking | | Takes, sees own | Creates, marks |
| Tutes | | Address, track, request | Dispatches |
| Messages and notifications | | Sends, receives | Inbox, replies |
| Funnel, warm leads, nudges | | | ✔ |
| Students, classes, finance | | | ✔ |
| Staff accounts, roles, dashboards, activity record | | | ✔ |

---

## 6. Personas and user types

| Persona | Application | Description |
|---|---|---|
| **Visitor** | Public Website | Anonymous person browsing; may be a student or a student's parent |
| **Student** | Student LMS | Anyone with a free account. **Not yet in a class:** uses the free hooks and can request a class. **In a class:** also has live classes, material, exams and tutes for the classes where their access is active |
| **Teacher** | Staff Portal | The owner and the brand |
| **Assistant** | Staff Portal | Helper |
| **System Admin** | Staff Portal | A predefined system role that configures roles and dashboards |

A student has one permanent **Student ID** from registration and one **preferred language** (Sinhala or English) that they can change at any time. A person who is both a student and a staff member has two separate accounts, one in each application.

---

## 7. Complete functionality map

### 7.1 Public Website: what a visitor can do (no sign-in)

| # | Function |
|---|---|
| 1 | See the teacher's photo, name, subject and promise |
| 2 | See what is taught, with a short description of each offering |
| 3 | See each class: subject, type, medium, batch, weekly timetable, monthly fee, and whether admissions are open, full or closed |
| 4 | Read the latest updates and events |
| 5 | See results, testimonials and community numbers |
| 6 | Read how classes work, how to join, payment methods and FAQs |
| 7 | Request a call-back, or open WhatsApp |
| 8 | Follow "Join free" or "Student login" to the Student LMS |
| 9 | Switch the whole site between Sinhala and English at any time, on every page |

A visitor **cannot** sign in, save anything, play any quiz or question, download anything, or see class material. The only thing remembered on the device is the language choice.

### 7.2 Student LMS: what a student can do

| Capability | Not yet in a class | In a class |
|---|---|---|
| Register free; sign in with Google or mobile (verified) | ✔ | ✔ |
| Edit own name, nickname, password, optional mobile | ✔ | ✔ |
| Switch between Sinhala and English at any time (saved in the account) | ✔ | ✔ |
| Daily question with streak and growth page | ✔ | ✔ |
| Practice quizzes with saved scores | ✔ | ✔ |
| Free past papers (download) | ✔ | ✔ |
| Challenge leaderboard, quiz battles, badges, share card | ✔ | ✔ |
| Exam countdown and important dates (for everyone and for own classes) | ✔ | ✔ |
| Join open classes | ✔ | ✔ |
| Referral link | ✔ | ✔ |
| Browse classes with fee and timetable; request to join | ✔ | ✔ |
| Pay (online or bank slip), payment history, receipts | After approval | ✔ |
| Live classes on Zoom, recordings, notes | ✘ | ✔ (active classes) |
| Attendance history | ✘ | ✔ |
| Class exams, written papers, marks, class ranking | ✘ | ✔ |
| Class updates and WhatsApp/Telegram group link | ✘ | ✔ |
| Tutes: address, tracking, requests | ✘ | ✔ |
| Message staff; notifications | ✔ | ✔ |

### 7.3 Staff Portal: what staff can do (by action, Section 8)

| Area | What staff can do |
|---|---|
| Dashboard | See the items chosen for their role |
| Growth | Funnel, hook engagement, warm leads, follow-ups, nudges, hook switches, referral rewards |
| Students | Registrations, join requests, enrolments, batch moves, fee waivers, class roll-over |
| Classes | Create classes, timetable, Zoom sessions, open classes, recordings, group links |
| Attendance | Review, correct, follow up absences |
| Content | Notes, video links, papers, past papers |
| Assessments | Exams, papers, question banks, daily question bank, marking, results, exam dates |
| Payments | Verify slips, record cash, reverse, adjust, unpaid list |
| Tutes | Monthly dispatch, parcel stages, requests, problems |
| Finance | Income, expenses, net result, collection rate |
| Communication | Announcements, messages, reminders, inbox |
| Website content | Everything the website shows, entered in Sinhala and English |
| Settings | Name, bank details, overdue and attendance rules, Zoom connection, phone verification method, default language, translation check |
| Access configuration | Roles, actions, dashboards, staff accounts, activity record |

---

## 8. Actions and roles (Staff Portal)

**Actions and roles are two different things.** An **action** is one thing a staff member can do (for example "approve a payment"). A **role** is a named group of actions. Every action is performed *by someone holding a role*.

### 8.1 Roles

There are **three roles**: **Teacher**, **Assistant** and **System Admin**. The System Admin is predefined by the system. Which actions the Teacher and Assistant may perform is **decided later**; this document only defines the actions.

### 8.2 Rules

1. Every staff action is performed through a role.
2. **One staff account holds exactly one role.**
3. **Creating roles, choosing a role's actions and choosing a role's dashboard items can be done only by the System Admin.** This is set up once at the start and rarely changes.
4. **Assigning a role to a staff account can be done by the Teacher** (and the System Admin).
5. Staff see only the menus and buttons their role allows.
6. Sensitive actions (reversing a payment, changing bank details, assigning roles) ask for confirmation and are recorded in the activity record.
7. **Nothing is ever erased.** Anything no longer needed is made *inactive*, so payments, attendance and history stay complete.
8. Students do not use roles; what they can do comes from their status and classes.

### 8.3 Action catalogue

**Access configuration (ACC)**

| ID | Action | Fixed rule |
|---|---|---|
| ACC-01 | Create and edit roles | System Admin only |
| ACC-02 | Choose the actions of a role | System Admin only |
| ACC-03 | Choose the dashboard items of a role | System Admin only |
| ACC-04 | Create a staff account | Decided later |
| ACC-05 | Assign a role to a staff account | Teacher can |
| ACC-06 | Make a staff account active or inactive | Decided later |
| ACC-07 | Reset a staff member's password | Decided later |
| ACC-08 | View the activity record (who did what, and when) | Decided later |

**Dashboard (DSH)**

| ID | Action |
|---|---|
| DSH-01 | View my dashboard (the items chosen for my role) |

*Dashboard items the System Admin can place on a role's dashboard:* today's classes; join requests waiting; payments waiting; unpaid students; new sign-ups; warm leads; items missing a translation; messages and call-backs waiting; tute requests and dispatch progress; absence follow-ups; money snapshot; growth funnel; sign-up and attendance charts.

**Growth and hooks (GRW)**

| ID | Action |
|---|---|
| GRW-01 | View the sign-up and conversion funnel |
| GRW-02 | View hook engagement |
| GRW-03 | View the warm leads list |
| GRW-04 | Record a follow-up on a lead |
| GRW-05 | Switch hooks on or off and set hook rules (points, badges, battle rules) |
| GRW-06 | Set nudge messages and timing |
| GRW-07 | Set referral rewards |

**Website content (WEB)**

| ID | Action |
|---|---|
| WEB-01 | Edit teacher profile, photo, headline, contact details and social links |
| WEB-02 | Edit the descriptions of what is taught |
| WEB-03 | Show or hide a class on the website |
| WEB-04 | Add and manage testimonials and results wall items |
| WEB-05 | Approve testimonials and results for publishing |
| WEB-06 | Edit information pages and FAQs |
| WEB-07 | Publish and manage website updates and event adverts (with show-from and show-until dates) |
| WEB-08 | Edit the community numbers |
| WEB-09 | Show, hide and reorder sections; choose colours |
| WEB-10 | Preview and publish changes |
| WEB-11 | Turn the "coming soon" page on or off |
| WEB-12 | Enter the Sinhala and English version of each website text, and preview the site in both languages |

**Students (USR)**

| ID | Action |
|---|---|
| USR-01 | View students and their details |
| USR-02 | Export the student list |
| USR-03 | View join requests |
| USR-04 | Approve a join request |
| USR-05 | Reject a join request with a reason |
| USR-06 | Approve a mobile registration (when staff approval is used instead of an SMS code) |
| USR-07 | Add a student manually |
| USR-08 | Import students in bulk (with preview) |
| USR-09 | Edit student details (name, guardian number, sign-in mobile) |
| USR-10 | Change an enrolment: pause, move to another batch, or end (make inactive) |
| USR-11 | Make a student account active or inactive |
| USR-12 | Grant or remove a fee waiver or scholarship |
| USR-13 | Roll classes over at the end of a term or year (move a whole batch to a new one) |

**Classes (CLS)**

| ID | Action |
|---|---|
| CLS-01 | Create and edit classes (subject, type, medium, batch, fee, capacity, who can join) |
| CLS-02 | Open or close a class to join requests; make a class inactive |
| CLS-03 | Set the weekly timetable of a class |
| CLS-04 | Add, change or cancel a single session |
| CLS-05 | Start a live session |
| CLS-06 | Add the recording link (YouTube) to a session |
| CLS-07 | Mark a session as an open class for all students |
| CLS-08 | Set the class WhatsApp or Telegram group link |

**Attendance (ATT)**

| ID | Action |
|---|---|
| ATT-01 | Correct a student's attendance with a reason (including marking *excused*) |
| ATT-02 | View and filter attendance |
| ATT-03 | Export attendance |
| ATT-04 | View the absence follow-up list |

**Content (CNT)**

| ID | Action |
|---|---|
| CNT-01 | Add notes, video links (YouTube) and papers to a subject, tagged with their language |
| CNT-02 | Edit content and make it inactive |
| CNT-03 | Mark content as class-only or free for all students |
| CNT-04 | Make notes view-only |
| CNT-05 | Set a release date for content |
| CNT-06 | Add and manage past papers and marking schemes |

**Assessments (ASM)**

| ID | Action |
|---|---|
| ASM-01 | Create, edit and publish MCQ exams |
| ASM-02 | Manage the question bank (add, edit, import) |
| ASM-03 | Manage the daily question bank (add, edit, make inactive, import), each question in Sinhala and English |
| ASM-04 | Create written papers; lock or unlock them |
| ASM-05 | Mark written papers and give comments |
| ASM-06 | View exam results, ranking and question analysis |
| ASM-07 | Export results |
| ASM-08 | Moderate the challenge leaderboard (hide a nickname) |
| ASM-09 | Set exam dates and important dates (for everyone or for a class) |

**Payments (PAY)**

| ID | Action |
|---|---|
| PAY-01 | View the payment queue and slips |
| PAY-02 | Approve a payment |
| PAY-03 | Reject a payment with a reason |
| PAY-04 | Approve or reject payments in bulk |
| PAY-05 | Record a cash or bank payment on a student's behalf |
| PAY-06 | Reverse a confirmed payment (status change only) |
| PAY-07 | Record a manual adjustment |
| PAY-08 | Review flagged duplicate slips |
| PAY-09 | View the unpaid list |
| PAY-10 | Export payments |

**Tutes (TUT)**

| ID | Action |
|---|---|
| TUT-01 | Create a tute dispatch for a class and month |
| TUT-02 | Set the delivery cost for a dispatch |
| TUT-03 | Update a parcel's stage, courier and tracking number |
| TUT-04 | Print address labels |
| TUT-05 | Review tute requests (approve or reject) |
| TUT-06 | View dispatch progress and problem reports |
| TUT-07 | Handle a problem report (replacement or note) |
| TUT-08 | Export a dispatch list |

**Finance (FIN)**

| ID | Action |
|---|---|
| FIN-01 | View income reports |
| FIN-02 | Record expenses |
| FIN-03 | View net result and collection rate |
| FIN-04 | Export and print finance reports |

**Communication (COM)**

| ID | Action |
|---|---|
| COM-01 | Publish announcements to students (a class or everyone), in Sinhala, English or both |
| COM-02 | Send a message to a student, a class or a guardian number |
| COM-03 | Manage message templates (Sinhala and English versions) and automatic reminders |
| COM-04 | Reply to student messages |
| COM-05 | View and reply to website call-back requests |
| COM-06 | Update the status of a call-back request |
| COM-07 | Export call-back requests |

**Settings (SET)**

| ID | Action |
|---|---|
| SET-01 | Edit name, logo and contact details |
| SET-02 | Edit the bank account details shown to students |
| SET-03 | Set overdue rules (reminders, grace period, access pause) |
| SET-04 | Set attendance rules (minimum time present, late limit) |
| SET-05 | Choose the mobile verification method (SMS code or staff approval) |
| SET-06 | Set my own alert preferences |
| SET-07 | Connect the Zoom account |
| SET-08 | Export all data (students, payments, content) |
| SET-09 | Set the default language for new visitors and new students |
| SET-10 | See every item that is missing a Sinhala or English version (translation check) |

---

## 9. Public Website: scenarios and stories

**Pages:** Home · What I teach and classes · Latest updates · Results and stories · How it works (with FAQs) · About · Contact. **Every page is available in Sinhala and English (WS-7).**

### WS-1 First impression: the teacher is the brand
**Scenario:** A person taps a link from WhatsApp. In three seconds they must know who this is, what he or she teaches, and why to trust the teacher, and what to do next.

- **WS-1.1** As a visitor, I want to see the teacher's photo, name and subject immediately so that I know who this is. *(WEB-01)*
- **WS-1.2** As a visitor, I want a one-line promise and a clear **"Join free"** button so that I know the next step costs nothing.
- **WS-1.3** As a visitor, I want credibility proof (experience, results, student numbers) so that I trust the teacher. *(WEB-08)*
- **WS-1.4** As a visitor on a slow mobile connection, I want pages to load quickly so that I do not leave.

### WS-2 What I teach and the classes
**Scenario:** A parent or student wants to know whether the teacher covers what they need, when classes run and what they cost, before spending time on an account.

- **WS-2.1** As a visitor, I want to see what is taught, with a short description of each offering (for example "Exam preparation course"), so that I know the teacher can help my child. *(WEB-02)*
- **WS-2.2** As a visitor, I want each class shown with subject, type (Theory, Revision, Paper), medium, batch, weekly timetable and monthly fee so that I can pick the right one.
- **WS-2.3** As a visitor, I want to see whether a class is **Admissions open, Full or Closed** so that I do not waste time. *(shown automatically from capacity and class status)*
- **WS-2.4** As a visitor, I want a "Join free" button on each class so that I can start straight away.
- **WS-2.5** As staff, I want classes, fees and timetables shown on the website **from the single entry I already made for the class**, so that I never type them twice. *(CLS-01, CLS-03)*
- **WS-2.6** As staff, I want to hide a class from the website if I choose so that only classes I want advertised appear. *(WEB-03)*

### WS-3 Latest updates and events
**Scenario:** The website shows the teacher is active. Updates appear for a set period and disappear by themselves, so nobody has to clean up.

- **WS-3.1** As a visitor, I want to see the latest updates (new batch starting, schedule changes, results released, holiday notices) so that I know the classes are alive.
- **WS-3.2** As a visitor, I want to see upcoming **events** (for example a revision seminar) with date, time and a short description so that I can plan. *(advertisement only; no booking)*
- **WS-3.3** As staff, I want to publish an update or event with a picture, a show-from date and a show-until date so that it appears and disappears automatically. *(WEB-07)*

### WS-4 Proof
- **WS-4.1** As a visitor, I want a **results wall** so that I see outcomes. *(WEB-04)*
- **WS-4.2** As a visitor, I want video and text **testimonials** so that I hear from real students. *(WEB-04)*
- **WS-4.3** As a visitor, I want community numbers (students taught, years teaching) and a "meet the teacher" story so that the teacher feels established. *(WEB-01, WEB-08; numbers staff choose to show; no personal data)*
- **WS-4.4** As the teacher, I want to approve every testimonial or result before it is shown, and keep the student's written permission, so that I respect students and protect my reputation. *(WEB-05)*

### WS-5 How it works
- **WS-5.1** As a visitor, I want a plain explanation of how classes work (live on Zoom, recordings, notes, tutes by post, exams, regular feedback) so that I know what to expect. *(WEB-06)*
- **WS-5.2** As a visitor, I want a clear "how to join" path (join free, choose a class, get approved, pay, start) so that I know the steps.
- **WS-5.3** As a visitor, I want to know the payment methods (online payment or bank deposit) so that I know what to expect.
- **WS-5.4** As a visitor, I want FAQs so that my common questions are answered. *(WEB-06)*

### WS-6 Contact
- **WS-6.1** As a visitor, I want a WhatsApp button so that I can chat quickly.
- **WS-6.2** As a visitor, I want to request a call-back (name, phone, and the class or subject they are interested in, if they like) so that the team can call me.
- **WS-6.3** As a visitor, I want a confirmation after sending so that I know it was received.
- **WS-6.4** As staff, I want call-back requests to arrive in the Staff Portal inbox so that I can follow them up. *(COM-05)*

### WS-7 Language
**Scenario:** A parent in a small town reads Sinhala more easily; a student in Colombo prefers English. Both must feel the website was made for them.

- **WS-7.1** As a visitor, I want a clearly visible **language toggle (සිංහල | English)** at the top of every page, including on a phone, so that I can read the site in my language.
- **WS-7.2** As a visitor, I want the whole page to change at once when I tap the toggle, and to stay on the same page, so that I do not lose my place.
- **WS-7.3** As a visitor, I want the site to remember my language on my device so that I do not have to choose every time.
- **WS-7.4** As a visitor, I want "Join free" and "Student login" to open the Student LMS in the language I was reading so that the experience stays consistent.
- **WS-7.5** As a visitor, I want classes, fees, timetables, updates, results, FAQs and the teacher's story in both languages, so that nothing important is only in one of them. *(WEB-12)*
- **WS-7.6** As staff, I want to enter the English and Sinhala version of each text side by side and preview both, so that the website is complete in both languages before it goes live. *(WEB-12, WEB-10)*

---

## 10. Student LMS: scenarios and stories

### LM-1 Registration and sign-in
**Scenario:** Joining is free and takes a minute. Google is the easy door; mobile is the alternative, and a mobile number must be verified.

- **LM-1.1** As a person, I want to continue with Google in one tap so that I do not need a new password.
- **LM-1.2** As a person without Google, I want to register with my mobile number and a password so that I am not excluded.
- **LM-1.3** As a mobile registrant, I want to verify my number with a **code sent by SMS**, or, if the teacher uses staff approval, to request access and wait for staff to approve me, so that only real numbers join.
- **LM-1.4** As a new student, I want to give only my name and nickname (and, if I like, how I heard about the teacher) so that registering is quick.
- **LM-1.5** As a student, I want a **permanent Student ID** from the moment I register, linked to my Google account or mobile number, so that I am always recognised as the same person.
- **LM-1.6** As a student, I want to link both a Google account and a mobile number to my account so that either works.
- **LM-1.7** As a student who signs in by mobile and forgot the password, I want to reset it myself with an SMS code so that I am not locked out. *(Google users sign in with Google; there is no password to reset.)*
- **LM-1.8** As a student, I want to change my name, nickname and password, and my mobile number after verification; staff correct other details so that records stay accurate.
- **LM-1.9** As a student, I want to stay signed in on my device and sign out when I choose so that others cannot use my account.
- **LM-1.10** As a student, I want to see clearly whether I am not yet in a class, awaiting approval, or active in a class so that I know what to do next.

### LM-2 My growth (free hooks)
**Scenario:** Every student, in a class or not, gets free daily value. It builds a habit, shows progress, and leads naturally to a class.

- **LM-2.1** As a student, I want a **daily question** (Section 17) with streak and history so that I build a daily habit.
- **LM-2.2** As a student, I want a **growth page** (questions answered, accuracy, current and best streak, quiz scores over time, points and level) so that I see my improvement.
- **LM-2.3** As a student, I want practice quizzes with my scores saved so that I can compare attempts.
- **LM-2.4** As a student, I want to **download past papers free** (with marking schemes where available), by subject and year, so that I can practise.
- **LM-2.5** As a student, I want a **challenge leaderboard** (nickname only) so that I compete and stay motivated.
- **LM-2.6** As a student, I want **quiz battles** against the system at easy, medium or hard, or against a friend, so that learning feels like a game.
- **LM-2.7** As a student, I want **badges and levels** ("7-day streak", "100 questions") so that I feel progress.
- **LM-2.8** As a student, I want a **shareable result card** for WhatsApp or social media so that I can show friends.
- **LM-2.9** As a student, I want **exam dates and a countdown** for my classes and for everyone (Section 17) so that I know what is coming.
- **LM-2.10** As a student, I want to join an **open class** on Zoom when the teacher opens one to everyone so that I can sample live teaching.
- **LM-2.11** As a student, I want a **referral link** so that I can invite friends, with a reward chosen by the teacher.
- **LM-2.12** As a student, I want an invitation to request a class at natural moments (after an open class, near exam dates) so that the next step is easy.

### LM-3 Finding a class, joining and paying
**Scenario:** A student finds a class and asks to join. Staff approve. The student pays for the month and gets access.

- **LM-3.1** As a student, I want to browse classes, with subject, type, medium, batch, timetable and fee, so that I find the right one.
- **LM-3.2** As a student, I want to request **more than one class** (for example a Theory class and its Revision class) so that I can learn and revise.
- **LM-3.3** As a student, I want to **request to join** a class with a short message so that staff can review.
- **LM-3.4** As a student, I want to see my request status (pending, approved, rejected with a reason) so that I know the next step.
- **LM-3.5** As a student, I want to see which classes I am already in, and which Revision or Paper classes are **included** with my Theory class, so that I do not pay twice.
- **LM-3.6** As an approved student, I want to choose the month(s) and, if offered, pay in full or in instalments so that I can manage the cost.
- **LM-3.7** As an approved student, I want to pay **online** (card or online banking, in LKR) and see it confirmed straight away so that I start without waiting.
- **LM-3.8** As an approved student, I want to pay by **bank deposit**: see the bank details, upload the slip, and see it as "pending" until a staff member approves it, so that I know where it stands.
- **LM-3.9** As a student, I want to pay for several classes and months in one payment so that it is convenient.
- **LM-3.10** As a student, I want a payment history (date, class, months, amount, method, status) and a receipt for each confirmed payment so that I have proof.
- **LM-3.11** As a student whose slip was rejected, I want to see the reason and upload again so that I can fix it.
- **LM-3.12** As a student, I want a warning before my access pauses for non-payment so that I can pay in time.
- **LM-3.13** As a student, I want to ask for a move to another batch (by message) so that my timetable suits me.

### LM-4 Live classes and attendance
**Scenario:** Classes run on Zoom. The student joins from the Student LMS; attendance is recorded automatically.

- **LM-4.1** As a student, I want a home page with my Student ID, my classes, the next session with a "live now" signal, updates, exam countdown, today's question and tute status so that I know what is happening.
- **LM-4.2** As a student, I want to **join a live class with one tap** from the Student LMS, a few minutes before it starts, so that I am never late.
- **LM-4.3** As a student, I want a clear reason ("Pay to unlock this class") when I cannot join so that I know what to do.
- **LM-4.4** As a student, I want to see my attendance (Present, Late, Absent, Excused) for every session so that I know how regular I am.
- **LM-4.5** As a student, I want to watch the recordings of past sessions inside the portal so that I can catch up.
- **LM-4.6** As a student, I want the class's WhatsApp or Telegram group link so that I can join the discussion.
- **LM-4.7** As a student, I want to read updates for my classes so that I never miss news.

### LM-5 Study materials
- **LM-5.1** As a student, I want notes, videos and papers grouped by subject and topic so that I find things easily.
- **LM-5.2** As a student, I want to download notes, or read them online if download is not allowed, so that I can study my way.
- **LM-5.3** As a student, I want to search videos so that I can revise any topic.
- **LM-5.4** As a student, I want to upload my answer sheet once (PDF or photo), with a clear warning that it is final, so that I submit confidently.
- **LM-5.5** As a student, I want to see marks, percentage and the teacher's comment so that I learn from feedback.
- **LM-5.6** As a student, I want locked content to show a clear reason ("Join a class to unlock") so that I know what to do.

### LM-6 Exams and results
- **LM-6.1** As a student, I want timed MCQ exams for my class, one attempt each, so that I am tested fairly.
- **LM-6.2** As a student, I want written papers (multiple-choice, short-answer, essay) where I type or upload photos so that I can do full papers.
- **LM-6.3** As a student, I want to see "submitted, awaiting marking" so that I know the teacher has not forgotten.
- **LM-6.4** As a student, I want a **class ranking** (my rank, MCQ marks, paper marks) so that I know where I stand among my classmates.
- **LM-6.5** As a student, I want my total score across exams and papers so that I see my overall standing.

### LM-7 Tutes
**Scenario:** Students in a class receive a printed tute by post each month. They need to know where it is, and ask for one if it goes missing.

- **LM-7.1** As a student, I want to save and update my delivery address, two phone numbers and nearest post office so that parcels reach me.
- **LM-7.2** As a student, I want to confirm my address when my tute is being prepared so that it is not posted to an old address.
- **LM-7.3** As a student, I want to see each month's tute for each class and its stage (Confirmed, Packed, Posted, Delivered) so that I know when it will arrive.
- **LM-7.4** As a student, I want the courier name and tracking number, with a link to track, so that I can follow the parcel.
- **LM-7.5** As a student, I want to confirm that I received the tute so that the teacher knows it arrived.
- **LM-7.6** As a student, I want to **request a tute** (not received, lost, extra copy) with a reason, and track the request, so that I always have the material.

### LM-8 Messages and notifications
- **LM-8.1** As a student, I want to message staff and see replies in one conversation so that I get help with account, payment or class problems.
- **LM-8.2** As a student, I want a notification list inside the portal so that I can see everything I was told.
- **LM-8.3** As a student, I want to choose which messages come to me on WhatsApp so that I am not spammed (Section 15).

### LM-9 Language
**Scenario:** A student chooses the language they are comfortable with and the whole Student LMS follows, including what is sent to them.

- **LM-9.1** As a person, I want the **language toggle (සිංහල | English)** in the top bar of every screen, including sign-in and registration, so that I can use the Student LMS in my language from the first screen.
- **LM-9.2** As a student, I want one tap to change the whole screen at once, without losing what I typed or where I am, so that switching is effortless.
- **LM-9.3** As a student, I want my language saved in my account so that it applies on every device I sign in on, and I can change it in my profile.
- **LM-9.4** As a student, I want the daily question, practice quizzes, explanations, badges, notifications, receipts and WhatsApp messages in my language so that I understand everything.
- **LM-9.5** As a student, I want to see the language of each note, paper and video, and to filter by language, so that I find material in the language I study in.
- **LM-9.6** As a student, I want each class to show clearly the **medium** it is taught in, separate from my screen language, so that I join the right class.
- **LM-9.7** As a student, I want to type my name, nickname, address and messages in Sinhala or English letters, and see them shown correctly everywhere, so that my details are right.

---

## 11. Staff Portal: scenarios and stories

*Every story is performed by a staff member through a role. The action IDs show which actions a role must hold (Section 8).*

### SP-1 Staff sign-in and access
**Scenario:** The Staff Portal is private. Staff are the system owners; they should not need a Gmail account to sign in.

- **SP-1.1** As staff, I want to sign in with my **mobile number and password**, and confirm with a one-time SMS code on a new device, so that only authorised people run the business without needing a Google account.
- **SP-1.2** As staff, I want to see only the menus and buttons my role allows so that I am not confused or tempted.
- **SP-1.3** As staff, I want to change my own name, photo and password, and sign out, so that my account stays current.
- **SP-1.4** As staff who forgot a password, I want a person with the right action to reset it so that I can return quickly. *(ACC-07)*

### SP-2 Dashboard (configurable per role)
**Scenario:** Each role should see what matters to it the moment it signs in. A teacher sees growth and money; an assistant sees work queues.

- **SP-2.1** As staff, I want a dashboard showing the items chosen for my role so that I see what needs action today. *(DSH-01)*
- **SP-2.2** As the System Admin, I want to choose which dashboard items each role sees so that dashboards fit the job. *(ACC-03)*
- **SP-2.3** As staff, I want alerts for new sign-ups, join requests, slips, tute requests and call-backs, also on my phone, so that I can act quickly. *(SET-06)*

### SP-3 Growth and hooks
- **SP-3.1** As staff, I want a **funnel view** (registered → requested → enrolled → paying, by source) so that I see where people drop off. *(GRW-01)*
- **SP-3.2** As staff, I want **hook engagement** (daily question answers, streaks, past-paper downloads, battles, open-class attendance) so that I know what works. *(GRW-02)*
- **SP-3.3** As staff, I want a **warm leads list** (students not in a class, most engaged first) so that I call the right people. *(GRW-03)*
- **SP-3.4** As staff, I want to record each follow-up (called, messaged, not interested) with a note so that nobody is chased twice or forgotten. *(GRW-04)*
- **SP-3.5** As staff, I want to set automatic nudges, their wording and timing, so that students are encouraged to join without manual work. *(GRW-06)*
- **SP-3.6** As staff, I want to switch hooks on or off and set points, badge and battle rules so that the hooks stay healthy. *(GRW-05)*
- **SP-3.7** As staff, I want to set referral rewards so that students are motivated to invite friends. *(GRW-07)*

### SP-4 Students and join requests
- **SP-4.1** As staff, I want a student list with counts (total, in a class, not yet in a class, fee-waived, inactive) and search by Student ID, name and class so that I find people quickly. *(USR-01)*
- **SP-4.2** As staff, I want to review join requests with the student's profile and message, then approve or reject with a reason, so that the right people join. *(USR-03, USR-04, USR-05)*
- **SP-4.3** As staff, I want to approve a mobile registration when we use staff approval instead of SMS codes so that only real students get in. *(USR-06)*
- **SP-4.4** As staff, I want to add a student manually, with the system first checking for an existing account so that duplicates are avoided. *(USR-07)*
- **SP-4.5** As staff, I want to import many students from a spreadsheet with a preview before saving so that I can onboard a batch safely. *(USR-08)*
- **SP-4.6** As staff, I want to edit a student's name, guardian phone number and sign-in mobile so that records stay correct. *(USR-09)*
- **SP-4.7** As staff, I want to pause an enrolment, move a student to another batch, or end it (made inactive) so that status matches reality. *(USR-10)*
- **SP-4.8** As staff, I want to make a student account inactive or active again so that people who have left no longer appear in active lists. *(USR-11)*
- **SP-4.9** As staff, I want to grant fee waivers or scholarships (full, partial, per class, with a note) so that discounts are handled. *(USR-12)*
- **SP-4.10** As staff, I want to roll a class over at the end of a term or year, moving a whole batch in one step so that I do not move students one by one. *(USR-13)*
- **SP-4.11** As staff, I want to export the student list so that I can share or archive it. *(USR-02)*

### SP-5 Classes and live sessions (Zoom)
- **SP-5.1** As staff, I want to create classes (subject, type, medium, batch, fee, capacity, who can join), open or close them to requests, and make old ones inactive, so that only the right classes can be joined. *(CLS-01, CLS-02)*
- **SP-5.2** As staff, I want to set a weekly timetable once so that Zoom sessions are created automatically and the timetable appears on the website and in the Student LMS. *(CLS-03)*
- **SP-5.3** As staff, I want to add, change or cancel a single session, with students notified, so that everyone is informed. *(CLS-04)*
- **SP-5.4** As staff, I want to start a live session from the Staff Portal so that I do not handle meeting links. *(CLS-05)*
- **SP-5.5** As staff, I want to add the recording as a YouTube link after class so that students can revise. *(CLS-06)*
- **SP-5.6** As staff, I want to mark a session as an open class so that any student can sample live teaching. *(CLS-07)*
- **SP-5.7** As staff, I want to set the class WhatsApp or Telegram group link so that students can join their group. *(CLS-08)*
- **SP-5.8** As staff, I want to connect the teacher's Zoom account once so that sessions can be created automatically. *(SET-07)*

### SP-6 Attendance
- **SP-6.1** As staff, I want attendance recorded automatically from the live session (rules in Section 12) so that nobody marks it by hand.
- **SP-6.2** As staff, I want to correct an entry with a reason (for example a power cut) or mark a student *excused* so that records are fair. *(ATT-01)*
- **SP-6.3** As staff, I want to view, filter and export attendance by class and date so that I can report. *(ATT-02, ATT-03)*
- **SP-6.4** As staff, I want an absence follow-up list (students absent N sessions in a row) so that I can call them. *(ATT-04)*
- **SP-6.5** As staff, I want to set the attendance rules (minimum time present, late limit) so that the rules fit my classes. *(SET-04)*

### SP-7 Content and past papers
- **SP-7.1** As staff, I want to add notes, YouTube video links and papers once per subject, tagged for the class types they serve, so that every batch sees them. *(CNT-01)*
- **SP-7.2** As staff, I want to mark each item *class only* or *free for all students* so that access is right. *(CNT-03)*
- **SP-7.3** As staff, I want to add past papers by subject and year, with marking schemes, free for all students, so that they work as a hook. *(CNT-06)*
- **SP-7.4** As staff, I want to make notes view-only so that students can read but not keep copies. *(CNT-04)*
- **SP-7.5** As staff, I want to set a release date so that content appears at the right time. *(CNT-05)*
- **SP-7.6** As staff, I want to edit content and make it inactive so that the library stays tidy. *(CNT-02)*
- **SP-7.7** As staff, I want to tag each note, paper, video and past paper as Sinhala or English so that students can find material in their language. *(CNT-01)*

### SP-8 Assessments, question banks and exam dates
- **SP-8.1** As staff, I want to create timed MCQ exams (draft or published) with text or image questions and up to five options so that varied exams are possible. *(ASM-01)*
- **SP-8.2** As staff, I want **one question bank** (with spreadsheet import) reused for class exams, practice quizzes and quiz battles so that I write once. *(ASM-02)*
- **SP-8.3** As staff, I want to create written papers mixing multiple-choice, short-answer and essay questions, and lock or unlock them. *(ASM-04)*
- **SP-8.4** As staff, I want to mark uploaded answers with marks and comments so that students receive feedback. *(ASM-05)*
- **SP-8.5** As staff, I want results with ranking, totals, averages and question-by-question analysis, and an export, so that I can improve exams and report. *(ASM-06, ASM-07)*
- **SP-8.6** As staff, I want to manage the **daily question bank** so that the daily question stays fresh. *(ASM-03)*
- **SP-8.7** As staff, I want to set exam dates and important dates for everyone or a class so that students see the right countdown. *(ASM-09)*
- **SP-8.8** As staff, I want to hide an inappropriate nickname from the leaderboard so that it stays friendly. *(ASM-08)*
- **SP-8.9** As staff, I want to enter each daily question, its options and its explanation in both Sinhala and English so that every student gets the same question in their language. *(ASM-03)*

### SP-9 Payments
- **SP-9.1** As staff, I want a queue of payments (slips and online) with student, class, month, amount, method and status so that I can verify them. *(PAY-01)*
- **SP-9.2** As staff, I want to view each slip and approve or reject it with a reason, singly or in bulk, because **a bank slip is always approved by a staff member** and stays pending until then. *(PAY-02, PAY-03, PAY-04)*
- **SP-9.3** As staff, I want online payments to be confirmed automatically and listed with the same details so that I do not recheck them. *(PAY-01)*
- **SP-9.4** As staff, I want to record a cash or bank payment on a student's behalf so that offline payments are captured. *(PAY-05)*
- **SP-9.5** As staff, I want to **reverse a confirmed payment** by changing its status, with the reason, the amount and a note of how the money was returned, while I return the money myself by my preferred method, so that the records match reality without touching the payment provider. *(PAY-06)*
- **SP-9.6** As staff, I want to record a manual adjustment with a reason so that corrections never erase history. *(PAY-07)*
- **SP-9.7** As staff, I want duplicate or reused slips flagged so that fraud is caught. *(PAY-08)*
- **SP-9.8** As staff, I want filters (status, class, student, date) and an export for bank reconciliation so that I can focus on what needs action. *(PAY-01, PAY-10)*
- **SP-9.9** As staff, I want an unpaid list with phone and class so that I can follow up. *(PAY-09)*
- **SP-9.10** As staff, I want overdue rules (reminders, grace period, then access pause) so that access follows payment without manual chasing. *(SET-03)*

### SP-10 Tutes
- **SP-10.1** As staff, I want to create a dispatch for a class and month, automatically listing every student with active access, so that nobody is forgotten. *(TUT-01)*
- **SP-10.2** As staff, I want to set the delivery cost per parcel, recorded as an expense, so that finance is accurate. *(TUT-02)*
- **SP-10.3** As staff, I want to move each parcel through Confirmed, Packed, Posted and Delivered, with courier and tracking number, so that progress is clear. *(TUT-03)*
- **SP-10.4** As staff, I want to print address labels so that packing is fast. *(TUT-04)*
- **SP-10.5** As staff, I want to see how many parcels are confirmed, posted and received, and any problem reports, so that I can chase delays. *(TUT-06)*
- **SP-10.6** As staff, I want to review students' tute requests and approve or reject them so that extra parcels are controlled. *(TUT-05)*
- **SP-10.7** As staff, I want to handle problem reports (replacement or note) so that every student gets their tute. *(TUT-07)*
- **SP-10.8** As staff, I want to export a dispatch list so that I can hand it to the courier. *(TUT-08)*

### SP-11 Finance
- **SP-11.1** As staff, I want income by month, by class and by payment method so that I see what earns. *(FIN-01)*
- **SP-11.2** As staff, I want to record expenses (advertising, assistant pay, printing, delivery, other) with category, amount and date so that all costs are captured. *(FIN-02)*
- **SP-11.3** As staff, I want net result by month and by class, and the collection rate (expected vs collected), so that I know profitability and cash flow. *(FIN-03)*
- **SP-11.4** As staff, I want to filter, export and print reports so that I can keep records. *(FIN-04)*

### SP-12 Communication and inbox
- **SP-12.1** As staff, I want to publish announcements to a class or everyone so that the right students hear. *(COM-01)*
- **SP-12.2** As staff, I want to send a message to a student, a class or a guardian number so that I can reach people directly. *(COM-02)*
- **SP-12.3** As staff, I want message templates and automatic reminders (Section 15) so that routine messages need no effort. *(COM-03)*
- **SP-12.4** As staff, I want one inbox for student messages and website call-back requests, with unread counts and status (unread, read, replied), so that nothing is missed. *(COM-04, COM-05, COM-06)*
- **SP-12.5** As staff, I want to reply in the same conversation so that history stays together. *(COM-04, COM-05)*
- **SP-12.6** As staff, I want to export call-back requests so that I can report. *(COM-07)*

### SP-13 Website content (small content manager)
*Staff manage what the Public Website shows from here.*
- **SP-13.1** As staff, I want to edit the teacher profile, photo, headline, contact details and social links so that the site is current. *(WEB-01)*
- **SP-13.2** As staff, I want to edit the descriptions of what is taught, and show or hide each class on the website, so that the right things are advertised. *(WEB-02, WEB-03)*
- **SP-13.3** As staff, I want to manage testimonials and results, with approval before anything is shown, so that quality is controlled. *(WEB-04, WEB-05)*
- **SP-13.4** As staff, I want to edit information pages and FAQs so that explanations stay current. *(WEB-06)*
- **SP-13.5** As staff, I want to publish updates and event adverts with show-from and show-until dates so that the site stays fresh by itself. *(WEB-07)*
- **SP-13.6** As staff, I want to edit the community numbers so that the proof stays accurate. *(WEB-08)*
- **SP-13.7** As staff, I want to preview changes, show or hide and reorder sections, choose colours, and use a "coming soon" page before launch so that mistakes do not go live. *(WEB-09, WEB-10, WEB-11)*
- **SP-13.8** As staff, I want every text field on the website to have an English part and a Sinhala part side by side, with a preview in each language and a flag on items that are missing one, so that visitors never see a half-finished page. *(WEB-12)*

### SP-14 Settings
- **SP-14.1** As staff, I want to set the name, logo and contact details so that the brand is correct everywhere. *(SET-01)*
- **SP-14.2** As staff, I want to set the bank account details shown to students so that deposits go to the right account. *(SET-02)*
- **SP-14.3** As staff, I want to choose how mobile numbers are verified (SMS code or staff approval) so that I can balance cost and convenience. *(SET-05)*
- **SP-14.4** As staff, I want to export students, payments and content so that the business always holds its own data. *(SET-08)*
- **SP-14.5** As staff, I want to choose the default language for new visitors and new students so that first-time people see the language most of them prefer. *(SET-09)*
- **SP-14.6** As staff, I want a **translation check** that lists everything missing a Sinhala or English version, so that I can complete it. *(SET-10)*
- **SP-14.7** As staff, I want the Staff Portal itself in English only, and to be able to type Sinhala into content fields, so that my own screens stay simple and the content stays complete.

### SP-15 Access configuration
- **SP-15.1** As the System Admin, I want to create and edit roles, choose their actions, and choose their dashboard items so that each role does only what is intended. *(ACC-01, ACC-02, ACC-03)*
- **SP-15.2** As the Teacher, I want to assign a role to a staff account so that the right person gets the right access. *(ACC-05)*
- **SP-15.3** As staff with the right action, I want to create staff accounts and make them active or inactive so that former staff lose access. *(ACC-04, ACC-06)*
- **SP-15.4** As staff with the right action, I want to view the activity record (who did what, and when) so that every sensitive change is traceable. *(ACC-08)*

---

## 12. Live classes, Zoom and attendance rules

1. **Live classes run on Zoom**, using the teacher's own Zoom account, connected once.
2. **Sessions are created automatically** from each class's timetable and from one-off sessions. Staff never type or send meeting links.
3. The teacher or assistant **starts the session** from the Staff Portal.
4. A student joins **only through the Student LMS**, with a **personal join link** that opens a few minutes before the session and closes when it ends.
5. **Only students with active access get a link.** Active means the class is approved and the current month is paid. Unpaid, paused or inactive students get no link and see why.
6. **Links are personal.** They identify the student and cannot be passed on to a friend; a link already in use by someone else is refused.
7. **Open classes** use the same personal links for any signed-in student, so the teacher also learns who is interested.
8. **Attendance is automatic and comes from the live session.** The system compares each student's time in the session with the session's length:
   - **Present:** stayed at least the minimum time (default to confirm: 75% of the session) and joined within the late limit.
   - **Late:** stayed at least the minimum time but joined after the late limit (default to confirm: 10 minutes after the start).
   - **Absent:** joined for less than the minimum time, or did not join.
   - **Excused:** set only by staff.
9. Attendance appears for staff and for the student soon after the session ends.
10. **Staff can correct** an entry with a reason (for example a power cut). Corrections are recorded.
11. **Watching a recording does not count as attendance.**
12. **Absence follow-up:** a student absent N sessions in a row (default to confirm: 2) appears on the follow-up list, and the teacher may also send a WhatsApp alert to the student or a guardian number.
13. The size of a live class is limited by the teacher's Zoom plan (Section 22).
14. **Recordings:** the teacher publishes the recording on YouTube and adds the link to the session (Section 16).

---

## 13. Money and fee rules

1. **Currency is LKR.** Each class has one monthly fee (or a one-time fee), set once in the Staff Portal and shown on the website and in the Student LMS.
2. **The teacher's money goes straight to the teacher's account.** The system never holds funds.
3. **Ways to pay:**
   - **Online payment** (card or online banking through a Sri Lankan provider): confirmed automatically when the provider confirms.
   - **Bank deposit with slip:** **always approved by a staff member.** The payment stays *pending* until a staff member approves or rejects it.
   - **Cash** recorded by staff.
4. **Approval before payment, payment before access.** After a join request is approved, a confirmed payment for a month gives access to that class for that month. Unpaid beyond the grace period pauses access; staff set the grace period and reminders.
5. **Reversing a confirmed payment changes its status only.** The application never sends money back and is **not connected to the payment provider for reversals**, even for online payments. Staff record the reason, the amount and how the money was returned, and return the money **manually, by whatever method they prefer**. A reversal withdraws the access that payment gave, unless staff choose otherwise.
6. **Every confirmed payment gets a receipt.**
7. **Duplicate or reused slips** are flagged for review.
8. **Every money change leaves a record** (who, when, what, and the note given).
9. **Fee waivers and scholarships** are recorded with a note.
10. **Tutes are included in the class fee** (Section 14).

---

## 14. Tute rules

1. A **tute** is a printed study pack posted each month to a student for a class, as part of the class.
2. **Who gets one:** every student with active access to that class for that month.
3. **Dispatch:** staff create a dispatch for a class and month; every eligible student is listed automatically.
4. **Stages:** Confirmed → Packed → Posted → Delivered, ending when the student confirms receipt. Courier name and tracking number are recorded.
5. **Address:** the student keeps a delivery address, two phone numbers and the nearest post office, and confirms the address when the tute is being prepared.
6. **Requests:** a student may request a tute (not received, lost, extra copy). Staff approve or reject; an approved request goes into a dispatch.
7. **Problems** (not received, damaged) are reported by the student and handled by staff with a replacement or a note.
8. **Delivery cost** is recorded as an expense.
9. Selling tutes to people outside the classes is **not** part of this product.

---

## 15. Messaging and notification rules

**Channels**

| Channel | Used for | Cost |
|---|---|---|
| **In-app** (messages and notices in the Student LMS and Staff Portal) | Support conversations, notices, the full list of everything sent | Free |
| **WhatsApp** | Useful notifications to students (and, if the teacher chooses, to a guardian number), click-to-chat from the website, class group links | Paid per message |
| **SMS** | Verification codes only (students and staff) | Paid per message |

**Support conversation:** students message staff inside the Student LMS, and replies come back there. WhatsApp replies are not part of the first release.

**Message catalogue**

| Event | To | Channel |
|---|---|---|
| Verification code | Student, staff | SMS |
| Join request received, approved or rejected | Student | In-app + WhatsApp |
| Payment approved, rejected (with reason), due soon, access paused | Student (and guardian number if chosen) | In-app + WhatsApp |
| Class starting soon | Student | WhatsApp + in-app |
| Session cancelled or changed | Students of the class | WhatsApp + in-app |
| Absent from sessions | Student (and guardian number if chosen) | WhatsApp |
| Tute posted, with tracking | Student | WhatsApp + in-app |
| New result published | Student | In-app |
| Exam countdown milestones (30, 7 and 1 days) | Students who see that date | In-app |
| Streak at risk, daily question | Students who opted in | In-app |
| Nudges to students not in a class | Student | In-app + WhatsApp |
| New sign-up, join request, slip, tute request, call-back request | Staff | In-app + phone alert |

**Rules**
1. Students choose which messages come on WhatsApp; the rest stay in-app, so the teacher's WhatsApp budget is spent on messages that matter.
2. Marketing-type nudges go only to students who have not opted out.
3. A guardian number is a contact detail only. It gives no login and no access.
4. **Language.** Every template exists in Sinhala and English. A student receives messages, notices and receipts in their preferred language. Staff-written free messages are sent as typed (no automatic translation); the inbox shows the student's language so staff can reply in it. Verification codes use the language of the screen where they were requested. Messages to staff are in English.

---

## 16. Video and file rules

1. **Videos live on YouTube.** Staff upload class recordings to YouTube and paste the link into the Staff Portal. The application stores only the link.
2. **Recordings** are attached to the session they belong to and shown only to students with active access, inside the Student LMS.
3. YouTube privacy settings (for example "unlisted") are the teacher's responsibility. Some sharing of links cannot be prevented, and this is accepted for now.
4. **Documents and images** (notes, papers, past papers, payment slips, student answer sheets) are files uploaded to the application.
5. **Notes, papers, past papers and videos carry a language tag** (Sinhala or English). A file is not translated by the system; staff upload a version for each language where both exist.

---

## 17. Hook rules

**Daily question**
1. The system holds a **bank of 365 general questions** (MCQ with a short explanation) for everyone, ready at launch.
2. **One question per day**, the same for everyone, picked at random from the bank, not repeating until the whole bank has been used.
3. It is shown **only in the Student LMS**. A student's answer is saved and builds a **streak** and a **growth record**.
4. Staff keep the bank fresh (add, edit, make inactive, import) (ASM-03). With no action from staff, it keeps working by itself.
5. **Each question exists in Sinhala and English** (question, options and explanation). Every student gets the same question on the same day, shown in their language. A question that is missing a language is not used until it is complete.

**Exam dates and countdown**
1. Staff set **important dates** for everyone or for a class (ASM-09). They are of two kinds: **official exams** (for example a national exam or school term tests) and **the teacher's own tests** (a monthly test for a class).
2. Each student sees **only the dates that apply to them**: dates set for everyone, plus dates for the classes they are in.
3. The student's home shows the **next date as "N days left"**, the nearest one first.
4. Countdown milestones (30, 7 and 1 days) can trigger a reminder (Section 15), and a revision class can be suggested.

**Leaderboards**
1. **Challenge leaderboard:** points from the daily question, practice quizzes and battles, nickname only, open to every student.
2. **Class ranking:** exam and paper marks, shown only to students in that class (Section 3).
3. These are separate on purpose: one rewards effort, the other shows results.

---

## 18. Identity and sign-in rules

**Student LMS**
1. **One person, one account**, with one **permanent Student ID** from registration.
2. Sign-in options: **Google** or **mobile number + password**. A person may link both to the same account.
3. A mobile number is **verified** by an SMS code, or by staff approval when the teacher chooses that instead.
4. **Password reset is self-service for mobile accounts**, using an SMS code. Google accounts have no password to reset.
5. Registration asks only for a **name and nickname** (and, optionally, how the student heard about the teacher).
6. Being not yet in a class and being in a class are **states of the same account**, so scores, streaks and history are kept.
7. When staff add a student manually, the system checks for an existing account first.
8. **Marketing messages** go only to students who have not opted out.

**Staff Portal**
9. Staff accounts are separate from student accounts. Staff sign in with a **mobile number and password plus an SMS code on a new device**. A Google account is not required.
10. A student can never sign in to the Staff Portal.

**Language**
11. A student's **preferred language** is part of their account and follows them to every device.
12. The Staff Portal is **English only**; staff accounts have no language choice.

---

## 19. Quality expectations (in business terms)

- The Public Website and Student LMS work on low-cost phones and slow connections; the Staff Portal works on a computer and on a phone.
- The Public Website and Student LMS work fully in **Sinhala and English**; the Staff Portal is in English only. Sinhala text must display correctly on common low-cost phones, and every screen must stay readable when the Sinhala text is longer than the English.
- Staff can type Sinhala in the Staff Portal (on their computer and phone) for content fields.
- Busy moments (class start, exam season, payment deadlines) are handled without failing.
- A problem or a traffic spike in one application does not stop the others (Section 2).
- A teacher and an assistant can run it after a short training session.
- Website content is low-maintenance: classes, fees and timetables come from one entry, and updates remove themselves.
- Dashboards show each role only what matters to it.

*Security, privacy and data protection are covered in a separate document.*

---

## 20. Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Too much scope for the first release | Never ships | Follow the phases in Section 21 |
| The three applications show different facts | Confusion, lost trust | Staff change things only in the Staff Portal; enter once, show wherever needed |
| Few visitors tap "Join free" | Weak funnel | Visible fees and timetables, clear join steps, updates that show activity |
| Free students never convert | Weak revenue | Warm leads follow-up, nudges, open classes, class invitations at the right moments |
| Teacher cannot produce enough free content | Weak hooks | 365-question bank prepared before launch, one question bank reused everywhere, past papers |
| Zoom plan too small for a class | Students locked out | Choose a Zoom plan that fits the biggest class before launch (Section 22) |
| Zoom links shared with friends | Lost revenue | Personal links that cannot be passed on |
| SMS and WhatsApp costs grow | Running cost | Students choose WhatsApp messages; SMS only for codes; staff approval as a free alternative |
| Fake or reused payment slips | Revenue loss | Staff approve every slip; duplicate flagging |
| Payment reversal forgotten or manual refund not recorded | Records disagree with the bank | Reversal needs a reason and a note of how money was returned; activity record |
| Online payment provider unavailable, expensive or slow to approve | No online payments | Decide the provider early; bank slip always remains available |
| Multi-class enrolment confuses students | Wrong payments, wrong access | Classes show subject, type and batch clearly; staff approve each enrolment |
| YouTube links shared outside the class | Lost value | Use unlisted videos; accept some leakage; consider a file server later |
| Wrong actions given to a role | Money or data errors | Roles configured only by the System Admin; sensitive actions confirmed and recorded |
| Abuse in leaderboard and battles | Brand damage | Nicknames, staff moderation |
| Content exists in only one language | Half-finished pages in one language; lost trust | Side-by-side entry of both languages; translation check; the other language shows instead of a blank until fixed |
| Preparing everything twice is too much work (365 questions, FAQs, templates) | Delayed launch or poor translation | Decide early who translates (open question 15); start with the website and the most-used templates; add the question bank translations before the daily question goes live |
| Sinhala text breaks on some phones or in printed labels | Unreadable screens, wrong parcel labels | Test on common low-cost phones and on printed tute labels before launch |

---

## 21. Phased roadmap

**Phase 1: Core class business**
- *Staff Portal:* sign-in, System Admin and roles, per-role dashboards, join requests, students, classes and timetable, Zoom connection, attendance, content with YouTube links, MCQ exams and papers, payments (slip), tutes, communication and inbox, website content.
- *Student LMS:* registration with verification, join request and payment, live classes on Zoom, attendance, recordings, notes, exams, tutes, messages.
- *Public Website:* home, what I teach, classes with fees and timetables, updates, proof, how it works, contact.
- *Languages:* Sinhala and English on the Public Website and Student LMS with the language toggle; both-language entry and the translation check in the Staff Portal; the Staff Portal in English.

**Phase 2: Growth engine**
- *Student LMS:* daily question, growth page, free past papers, practice quizzes, challenge leaderboard, badges, share cards, exam dates and countdown, open classes, referral.
- *Staff Portal:* growth area (funnel, engagement, warm leads, nudges, hook rules), daily question bank (in both languages), past paper management.
- Online payment; WhatsApp notifications.

**Phase 3: Expansion**
Quiz battles, two-way WhatsApp in the inbox, mobile app for students, a file server for videos, additional subjects, and other languages (for example Tamil) or the Staff Portal in Sinhala if ever needed.

---

## 22. Open questions and decisions

| # | Question | Why it matters |
|---|---|---|
| 1 | Which Zoom plan will the teacher use, who owns the account, and what is the biggest class size it must hold? | Class size limit, cost, automatic sessions |
| 2 | Confirm the attendance defaults: present at 75% of the session, late after 10 minutes, follow-up after 2 absences in a row. | Fair attendance |
| 3 | Which SMS provider and budget? Is the default phone verification an SMS code or staff approval? | Running cost, sign-up convenience |
| 4 | WhatsApp budget per month, and should alerts also go to guardian numbers? | Running cost, parent engagement |
| 5 | Confirm staff sign in with mobile number, password and an SMS code on a new device. | Staff convenience and safety |
| 6 | Which Sri Lankan online payment provider, and what are its fees and approval time? (decided later) | Online payment date |
| 7 | Are tutes included in the class fee (this document assumes yes)? Who prints and posts them, and what is the delivery cost per parcel? | Fees, expenses |
| 8 | Are Revision and Paper classes usually included free with the Theory class, or paid separately? (Each class can be set either way.) | Fee structure |
| 9 | Confirm a student may be in several classes at once, with staff approval of each. | Class rules |
| 10 | Events are advertised only on the website (no booking or payment). Confirm. | Scope |
| 11 | Who prepares the 365 daily questions and the first past papers before launch? | Launch readiness |
| 12 | Who sets the official exam dates (for example a national exam date) each year? | Countdown accuracy |
| 13 | Which medium or mediums are taught (Sinhala, English, both)? | Class setup |
| 14 | Which language should first-time visitors and new students see by default, Sinhala or English? | First impression, sign-up rate |
| 15 | Who writes the Sinhala and English versions of the website text, the 365 daily questions and the message templates, and by when? | Launch readiness, quality |
| 16 | Should class exams follow the class medium (Sinhala-medium class gets a Sinhala exam), as this document assumes? | Exam preparation |

---

## 23. Language rules (Sinhala and English)

### 23.1 Which application uses which language

| Application | Languages | Language toggle |
|---|---|---|
| Public Website | Sinhala and English | Yes, on every page |
| Student LMS | Sinhala and English | Yes, on every screen, including sign-in and registration |
| Staff Portal | English only | No |

### 23.2 The language toggle

What a person sees:

```
┌────────────────────────────────────────────────────────────────┐
│ ☰  Teacher name               [ සිංහල | English ]   [Join free] │
└────────────────────────────────────────────────────────────────┘
        the active language is highlighted; one tap switches the page
```

1. **One switch, always in the top bar.** A two-option toggle labelled **සිංහල | English** is in the top bar of every Public Website page and every Student LMS screen, including the sign-in, registration and password-reset screens. On a phone it stays in the top bar and is never hidden inside a menu.
2. **Each option is written in its own language**, so a person who cannot read the current language can still find the other one.
3. **The active language is clearly highlighted.**
4. **One tap changes the whole page at once.** The person stays on the same page, and anything they were typing is kept.
5. **Everything changes together:** labels, buttons, messages, errors, empty states, and the teacher's own content (classes, updates, FAQs, results, the daily question). No page is left half in one language.
6. **The choice is remembered.** For a visitor, on their device. For a student, in their account, so it applies on every device and is used for the messages sent to them.
7. **First visit:** the page opens in the default language the teacher has set (SET-09), until the person chooses.
8. **From the website to the Student LMS:** "Join free" and "Student login" open the Student LMS in the language the visitor was reading.
9. **The toggle changes the screen language only.** It does not change the medium a class is taught in, or the language of a note or a paper.
10. **If a text is missing in the chosen language**, the other language is shown in its place, so a page is never blank, and the item is flagged to staff (23.4).

### 23.3 What exists in both languages

| Content | Rule |
|---|---|
| Fixed screen text (buttons, labels, messages, errors, empty states) | Provided in both languages as part of the product |
| Website content staff enter: teacher profile and story, headline, descriptions of what is taught, class descriptions, updates and events, results and testimonials, how it works, FAQs, community number labels | Staff enter the English and the Sinhala version of each item (WEB-12) |
| Daily question bank | Every question, its options and its explanation in both languages (Section 17) |
| Question bank for practice quizzes and battles | Items carry a language; a student sees their language, or the other language when only one exists |
| Class exams | Written in the class medium |
| Notes, papers, past papers, marking schemes and videos | Tagged Sinhala or English; students can filter by language (Section 16) |
| Message templates, notices, receipts, payment history | Both versions; sent in the student's language (Section 15) |
| Free messages typed by staff | Sent as typed; not translated by the system |
| Names, nicknames, addresses, messages typed by visitors and students | Sinhala or English letters accepted, and shown correctly on screens, receipts and printed tute labels |
| Numbers, money and dates | Arabic numerals in both languages; the currency label follows the language (Rs. or රු.) |
| Staff Portal screens | English only |

### 23.4 Staff entering both languages (Staff Portal, English only)

1. Every text that visitors or students read has an **English part and a Sinhala part side by side** in the Staff Portal.
2. A staff member can **save with one language first**; the item then shows in the available language and is flagged *Sinhala missing* or *English missing* in lists.
3. The **translation check** (SET-10) lists every item missing a language, and a dashboard item can show the count.
4. **Preview in both languages** before publishing (WEB-10, WEB-12).
5. **Translating is a staff responsibility.** The system does not translate automatically.
6. Staff can type Sinhala in these fields even though the Staff Portal itself is in English.
7. The student record shows the student's **preferred language**, and the inbox shows it beside each message, so staff reply in the right language.

### 23.5 Class medium and screen language

A student can read the screens in Sinhala and join an English-medium class, or the reverse. The class card always shows the medium. The class type and batch rules (Section 3) do not change with language.

---

## 24. Glossary

| Term | Meaning |
|---|---|
| **Public Website** | The open, no-sign-in application that persuades and informs |
| **Student LMS** | The sign-in application where students engage, join, pay and learn |
| **Staff Portal** | The private application for staff to run and grow the business |
| **Visitor** | Anyone using the Public Website; not signed in, not tracked |
| **Student** | Anyone with a free account; *not yet in a class* or *in a class* |
| **Student ID** | The permanent unique ID given at registration |
| **Class** | One subject + type + medium + batch, with its own fee, timetable and enrolment |
| **Class type** | Theory, Revision or Paper |
| **Medium** | The language a class is taught in (Sinhala or English) |
| **Batch** | A group of students with its own timetable |
| **Open class** | A live session the teacher opens to all students |
| **Hook** | A free feature that attracts students and brings them back |
| **Warm lead** | A student not yet in a class who shows interest |
| **Nudge** | An automatic message encouraging a student to take the next step |
| **Action** | One thing a staff member can do (for example `PAY-02`) |
| **Role** | A named group of actions: Teacher, Assistant or System Admin |
| **Inactive** | The business meaning of "removed": kept for records, hidden from use |
| **Reversal** | A status change on a confirmed payment; the money is returned manually |
| **Personal join link** | A Zoom link that identifies one student and works only while their access is active |
| **Language toggle** | The switch (සිංහල \| English) on every page of the Public Website and every screen of the Student LMS |
| **Screen language** | The language a person chooses to read the screens in. Not the same as the class medium |
| **Translation check** | A staff view listing every item missing a Sinhala or English version |
