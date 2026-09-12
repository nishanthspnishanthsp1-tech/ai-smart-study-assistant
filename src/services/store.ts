import {
  StudentProfile,
  AdminProfile,
  UploadedFile,
  QuestionItem,
  TestResult,
  PredictedQuestion,
  ActivityLog,
  DashboardStats,
} from "../types";

const STORAGE_KEYS = {
  CURRENT_USER: "ai_study_current_user",
  STUDENTS: "ai_study_students",
  ADMINS: "ai_study_admins",
  FILES: "ai_study_files",
  TEST_RESULTS: "ai_study_test_results",
  PREDICTIONS: "ai_study_predictions",
  ACTIVITIES: "ai_study_activities",
};

// Initial Student (Nishanth S P - Rathinam Technical Campus 2nd Year AI&DS)
export const DEFAULT_STUDENT: StudentProfile = {
  uid: "student_nishanth_01",
  name: "Nishanth S P",
  phone: "+91 98421 78901",
  college: "Rathinam Technical Campus",
  department: "Artificial Intelligence and Data Science (AI&DS)",
  year: "2nd Year",
  email: "nishanthsp262007@gmail.com",
  purpose: "Student",
  role: "student",
  status: "active",
  createdAt: "2024-08-14",
  avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
};

// Initial Admins
export const DEFAULT_ADMINS: AdminProfile[] = [
  {
    uid: "admin_ramesh_super",
    name: "Dr. S. Ramesh",
    phone: "+91 94432 10987",
    email: "hod.aids@rathinam.in",
    department: "Artificial Intelligence and Data Science",
    role: "super_admin",
    createdAt: "2023-06-10",
  },
  {
    uid: "admin_priya_staff",
    name: "Prof. K. Priya",
    phone: "+91 98765 43210",
    email: "priya.ai@rathinam.in",
    department: "Artificial Intelligence and Data Science",
    role: "admin",
    createdAt: "2023-09-01",
  },
];

// Initial Student Directory for Admin Management
export const INITIAL_STUDENTS_DIRECTORY: StudentProfile[] = [
  DEFAULT_STUDENT,
  {
    uid: "student_abinaya_02",
    name: "Abinaya R",
    phone: "+91 98765 12345",
    college: "Rathinam Technical Campus",
    department: "Artificial Intelligence and Data Science",
    year: "2nd Year",
    email: "abinaya.23ad@rathinam.in",
    purpose: "Student",
    role: "student",
    status: "active",
    createdAt: "2024-08-16",
  },
  {
    uid: "student_kavin_03",
    name: "Kavin Kumar M",
    phone: "+91 98432 99881",
    college: "Rathinam Technical Campus",
    department: "Artificial Intelligence and Data Science",
    year: "2nd Year",
    email: "kavin.23ad@rathinam.in",
    purpose: "Student",
    role: "student",
    status: "active",
    createdAt: "2024-08-18",
  },
  {
    uid: "student_dharshini_04",
    name: "Dharshini S",
    phone: "+91 97890 44556",
    college: "Rathinam Technical Campus",
    department: "Artificial Intelligence and Data Science",
    year: "2nd Year",
    email: "dharshini.23ad@rathinam.in",
    purpose: "Student",
    role: "student",
    status: "active",
    createdAt: "2024-08-20",
  },
  {
    uid: "student_vignesh_05",
    name: "Vigneshwaran T",
    phone: "+91 96555 33221",
    college: "Rathinam Technical Campus",
    department: "Artificial Intelligence and Data Science",
    year: "2nd Year",
    email: "vignesh.23ad@rathinam.in",
    purpose: "Student",
    role: "student",
    status: "blocked",
    createdAt: "2024-08-22",
  },
];

// Seed sample questions with rich mark-based answers, English & Tamil, quick revisions
export const SEED_QUESTIONS: QuestionItem[] = [
  {
    id: "q_seed_1",
    fileId: "file_os_01",
    studentId: "student_nishanth_01",
    questionText: "What is Process Synchronization? Explain Critical Section Problem and Peterson's Solution.",
    marks: 10,
    subject: "Operating Systems",
    importance: "HIGH",
    importanceReason: "Core university concept. Question appears in nearly 90% of semester exams for Operating Systems.",
    answerEnglish: `### 1. Introduction & Definition
**Process Synchronization** is the coordination of concurrent processes executing in a multi-programming system to ensure consistent access to shared data and prevent data race hazards.

### 2. Critical Section Problem
A **Critical Section** is a code segment where shared resources (shared variables, files, memory tables) are accessed. The solution must satisfy three strict criteria:
- **Mutual Exclusion:** Only one process can execute in its critical section at any given moment.
- **Progress:** If no process is in its critical section, only processes wanting to enter can participate in deciding who enters next.
- **Bounded Waiting:** There must be a limit on the number of times other processes can enter before a request is granted, avoiding indefinite starvation.

### 3. Peterson's Solution (Two-Process Algorithm)
Uses two shared variables:
\`\`\`c
int turn;
boolean flag[2];
\`\`\`
- Process $P_i$ code:
\`\`\`c
flag[i] = true;
turn = j;
while (flag[j] && turn == j); // busy wait
// Critical Section
flag[i] = false; // Remainder Section
\`\`\`

### 4. Conclusion
Peterson's algorithm is a software-based classic solution fulfilling Mutual Exclusion, Progress, and Bounded Waiting for two concurrent tasks.

### Quick Revision
• Synchronization stops race conditions when shared data is modified.
• Critical Section requires: Mutual Exclusion, Progress, Bounded Waiting.
• Peterson's algorithm uses 'flag' array and 'turn' variable.`,
    answerTamil: `### 1. அறிமுகம் மற்றும் விளக்கம்
**செயல்முறை ஒத்திசைவு (Process Synchronization)** என்பது பல செயல்முறைகள் ஒரே நேரத்தில் இயங்கும்போது, பகிரப்பட்ட நினைவகத்தை (Shared Memory) பிழையின்றி பயன்படுத்துவதை உறுதி செய்யும் இயக்க முறைமையின் மிக முக்கிய பொறுப்பாகும்.

### 2. கிரிட்டிகல் பிரிவு பிரச்சனை (Critical Section)
பகிரப்பட்ட தகவல்களை இயக்கும் குறியீட்டு பகுதியே **Critical Section** எனப்படும். இதற்கு மூன்று நிபந்தனைகள் உள்ளன:
- **Mutual Exclusion:** ஒரு நேரத்தில் ஒரு செயல்முறை மட்டுமே இயங்க வேண்டும்.
- **Progress:** பிற செயல்முறைகள் நுழைய விரும்பும் செயல்முறையை தேவையின்றி தடுக்கக் கூடாது.
- **Bounded Waiting:** எந்தவொரு செயல்முறையும் நீண்ட நேரம் காத்திருக்க வைக்கப்படக் கூடாது (Starvation தவிர்ப்பு).

### 3. பீட்டர்சன் தீர்வு (Peterson's Solution)
இரண்டு செயல்முறைகளுக்கான எளிய தீர்வு:
- 'turn' மற்றும் 'flag' மாறிகளைப் பயன்படுத்தி பாதுகாப்பாக Critical Section-க்குள் நுழைகிறது.

### விரைவு திருப்புதல் (Quick Revision)
• Process Synchronization தரவு முரண்பாடுகளை (Race Conditions) தடுக்கிறது.
• Peterson தீர்வு இரு செயல்முறைகளுக்கு Mutual Exclusion உத்தரவாதம் தருகிறது.`,
    quickRevision: [
      "Process Synchronization guarantees deterministic data access.",
      "Three requirements: Mutual Exclusion, Progress, Bounded Waiting.",
      "Peterson's solution strictly satisfies all three constraints.",
    ],
    isSaved: true,
    savedDate: "2024-09-02",
    isCompleted: true,
  },
  {
    id: "q_seed_2",
    fileId: "file_os_01",
    studentId: "student_nishanth_01",
    questionText: "What is Deadlock? State the four Coffman necessary conditions for Deadlock occurrence.",
    marks: 5,
    subject: "Operating Systems",
    importance: "HIGH",
    importanceReason: "Definitive 5-mark question; consistently tested in semester exam Section B.",
    answerEnglish: `### Definition
A **Deadlock** is a situation where a set of processes are blocked because each process is holding a resource and waiting for another resource held by some other process in the set.

### Four Coffman Conditions
All four must hold simultaneously for a deadlock to occur:
1. **Mutual Exclusion:** At least one non-shareable resource is held by a process.
2. **Hold and Wait:** A process is holding at least one resource and requesting additional resources held by other processes.
3. **No Preemption:** Resources cannot be forcibly preempted; they are released only voluntarily by the holding process.
4. **Circular Wait:** A closed chain of processes exists where $P_0$ waits for $P_1$, $P_1$ waits for $P_2$, ..., and $P_n$ waits for $P_0$.

### Quick Revision
• Deadlock = Permanent standstill of dependent processes.
• 4 Coffman conditions: Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait.
• Breaking even ONE condition prevents deadlock entirely.`,
    answerTamil: `### விளக்கம் (Deadlock Definition)
**முட்டுக்கட்டை (Deadlock)** என்பது பல செயல்முறைகள் தங்களுக்குத் தேவையான வளங்களை (Resources) பெற முடியாமல் ஒன்றை ஒன்று சார்ந்து நிரந்தரமாக காத்திருக்கும் நிலை ஆகும்.

### 4 காஃப்மேன் நிபந்தனைகள் (Coffman Conditions)
1. **Mutual Exclusion:** வளத்தை ஒரு நேரத்தில் ஒருவர் மட்டுமே பயன்படுத்த முடியும்.
2. **Hold and Wait:** ஒரு வளத்தை வைத்துக்கொண்டு அடுத்த வளத்திற்காக காத்திருத்தல்.
3. **No Preemption:** வளங்களை வலுக்கட்டாயமாக பறிக்க முடியாது.
4. **Circular Wait:** சுழற்சி முறையில் ஒன்றையொன்று எதிர்பார்த்து காத்திருத்தல்.

### விரைவு திருப்புதல் (Quick Revision)
• 4 நிபந்தனைகளில் ஏதேனும் ஒன்றை முறித்தால் Deadlock-ஐ தடுக்க முடியும்.
• Resource Allocation Graph (RAG) சுழற்சி இருந்தால் Deadlock ஏற்படலாம்.`,
    quickRevision: [
      "Deadlock requires all 4 Coffman conditions simultaneously.",
      "Prevention targets eliminating one of the 4 conditions.",
      "Banker's Algorithm is used for Deadlock Avoidance.",
    ],
    isSaved: true,
    savedDate: "2024-09-03",
    isCompleted: true,
  },
  {
    id: "q_seed_3",
    fileId: "file_os_01",
    studentId: "student_nishanth_01",
    questionText: "Define Demand Paging and explain Page Fault handling mechanism.",
    marks: 10,
    subject: "Operating Systems",
    importance: "HIGH",
    importanceReason: "High priority 10-mark question for Virtual Memory unit.",
    answerEnglish: `### 1. Concept of Demand Paging
**Demand Paging** is a virtual memory management technique where pages are loaded into physical main memory only when they are referenced during execution ("lazy swapper").

### 2. Page Fault Handling Steps
1. CPU references a memory address; hardware checks page table.
2. If the page table entry indicates **Invalid** ($i$), a **Page Fault Trap** is generated to the OS kernel.
3. OS checks internal process tables:
   - If invalid reference -> Terminate process.
   - If valid page not in memory -> Schedule disk I/O.
4. OS finds a free physical frame in RAM.
5. Disk controller reads requested page into the allocated frame.
6. OS updates page table entry to **Valid** ($v$).
7. Instruction that caused the page fault is restarted seamlessly.

### Quick Revision
• Demand paging loads pages on-demand, saving RAM.
• Valid/Invalid bit flags page presence in physical memory.
• Page fault handler swaps page from disk and restarts instruction.`,
    answerTamil: `### 1. Demand Paging விளக்கம்
**Demand Paging** என்பது ஒரு பக்கத்திற்கான (Page) தேவை எழும் போது மட்டுமே அதை இரண்டாம் நிலை நினைவகத்திலிருந்து முதன்மை நினைவகத்திற்கு (RAM) ஏற்றும் முறையாகும்.

### 2. Page Fault கையாளும் படிகள்
1. CPU பக்கத்தை தேடுகிறது; அது RAM-ல் இல்லை என்றால் Page Fault எச்சரிக்கை எழும்.
2. இயக்க முறைமை ஹார்டு டிஸ்க்கில் அந்த பக்கத்தை தேடும்.
3. காலியாக உள்ள RAM frame-ல் பக்கத்தை ஏற்றும்.
4. Page Table-ல் Valid என புதுப்பிக்கும்.
5. நிறுத்தப்பட்ட அறிவுறுத்தலை மீண்டும் இயக்கும்.

### விரைவு திருப்புதல் (Quick Revision)
• குறைந்த நினைவகத்தில் பெரிய நிரல்களை இயக்க Demand Paging உதவுகிறது.
• Page Fault விகிதம் குறைவாக இருப்பது கணினி வேகத்திற்கு நல்லது.`,
    quickRevision: [
      "Demand paging loads pages lazily upon CPU reference.",
      "Page fault triggers context switch to OS disk handler.",
      "Effective access time depends heavily on Page Fault rate.",
    ],
    isSaved: false,
    isCompleted: true,
  },
  {
    id: "q_seed_4",
    fileId: "file_dbms_02",
    studentId: "student_nishanth_01",
    questionText: "Explain Boyce-Codd Normal Form (BCNF) with an example. How does it differ from 3NF?",
    marks: 5,
    subject: "DBMS",
    importance: "HIGH",
    importanceReason: "Frequent analytical question in normalization theory.",
    answerEnglish: `### Definition of BCNF
A relation schema $R$ is in **Boyce-Codd Normal Form (BCNF)** if, for every functional dependency $X \\rightarrow Y$, $X$ is a **Super Key** of $R$. BCNF is a stricter version of Third Normal Form (3NF).

### BCNF vs 3NF Difference
- **In 3NF:** For $X \\rightarrow Y$, either $X$ is a super key **OR** $Y$ is a prime attribute (part of any candidate key).
- **In BCNF:** $X$ MUST strictly be a super key. No exception is allowed even if $Y$ is prime.

### Quick Revision
• BCNF guarantees zero functional dependency redundancy.
• BCNF requires left-hand determinant $X$ to always be a candidate/super key.`,
    answerTamil: `### BCNF விளக்கம்
ஒரு டேபிள் **BCNF**-ல் இருக்க வேண்டும் என்றால், அதில் உள்ள ஒவ்வொரு சார்புத் தொடர்பிலும் ($X \\rightarrow Y$) இடதுபுறம் உள்ள $X$ கட்டாயமாக ஒரு **Super Key**-ஆக இருக்க வேண்டும்.

### 3NF-க்கும் BCNF-க்கும் வேறுபாடு
- 3NF-ல் $Y$ ஒரு prime attribute ஆக இருந்தால் ஏற்றுக்கொள்ளப்படும்.
- BCNF-ல் $X$ கட்டாயமாக ஒரு சூப்பர் கீயாக மட்டுமே இருக்க வேண்டும்; வேறு சலுகை கிடையாது.

### விரைவு திருப்புதல் (Quick Revision)
• BCNF என்பது 3NF-ஐ விட கண்டிப்பான விதிமுறையாகும்.
• தேவையற்ற தரவு நகல்களை இது முற்றிலும் நீக்குகிறது.`,
    quickRevision: [
      "BCNF enforces every determinant to be a super key.",
      "Stricter than 3NF, eliminating anomaly cases in overlapping keys.",
    ],
    isSaved: true,
    savedDate: "2024-09-04",
    isCompleted: true,
  },
  {
    id: "q_seed_5",
    fileId: "file_ai_03",
    studentId: "student_nishanth_01",
    questionText: "Explain A* Search Algorithm. Prove that A* with an admissible heuristic is optimal.",
    marks: 13,
    subject: "Artificial Intelligence",
    importance: "HIGH",
    importanceReason: "Anna University Regulation 2021 Part C / 13-Mark benchmark exam question.",
    answerEnglish: `### 1. Introduction & Evaluation Function
**A* (A-Star) Search** is an informed best-first search algorithm that finds the least-cost path from a given start node to goal node using evaluation function:
$$f(n) = g(n) + h(n)$$
Where:
- $g(n)$ = Exact cost incurred from start node to current node $n$.
- $h(n)$ = Estimated heuristic cost from node $n$ to goal.
- $f(n)$ = Estimated total cost of path passing through $n$.

### 2. Admissibility Property
A heuristic $h(n)$ is **admissible** if it never overestimates the true remaining cost to reach the goal:
$$h(n) \\leq h^*(n) \\quad \\forall n$$
Where $h^*(n)$ is the true optimal cost from $n$ to goal. For any goal state $G$, $h(G) = 0$.

### 3. Optimality Proof (Tree Search)
Suppose suboptimal goal $G_2$ is in the priority queue and optimal goal is $G_1$ with cost $C^*$.
1. Because $G_2$ is suboptimal: $f(G_2) = g(G_2) + h(G_2) = g(G_2) > C^*$.
2. Let $n$ be an unexpanded node on the path to optimal goal $G_1$.
3. Since $h$ is admissible: $f(n) = g(n) + h(n) \\leq C^*$.
4. Combining yields: $f(n) \\leq C^* < f(G_2)$.
5. Therefore, $n$ will always be selected from queue before $G_2$. $A^*$ can never choose $G_2$ before completing optimal path to $G_1$. Thus, $A^*$ is strictly optimal.

### Quick Revision
• Evaluation function: $f(n) = g(n) + h(n)$.
• Admissibility: $h(n) \\leq h^*(n)$ (never overestimates).
• Consistency (monotonicity): $h(n) \\leq c(n, a, n') + h(n')$.
• A* is both complete and optimal under admissibility.`,
    answerTamil: `### 1. அறிமுகம் மற்றும் மதிப்பீட்டு சமன்பாடு
**A* Search Algorithm** என்பது தொடக்க புள்ளியிலிருந்து இலக்கை அடைய குறைந்த செலவில் சிறந்த வழியைக் கண்டறியும் முன்னணி தேடல் முறையாகும்:
$$f(n) = g(n) + h(n)$$
- $g(n)$: தொடக்கத்திலிருந்து தற்போதைய புள்ளி வரையிலான உண்மையான செலவு.
- $h(n)$: தற்போதைய புள்ளியிலிருந்து இலக்கிற்கு செல்லும் உத்தேச செலவு (Heuristic).

### 2. Admissibility (ஏற்றுக்கொள்ளக்கூடிய தன்மை)
ஒரு heuristic மதிப்பீடு உண்மையான செலவை விட அதிகமாக இருக்கக்கூடாது ($h(n) \\leq h^*(n)$). அவ்வாறு இருந்தால் A* மிகச்சரியான சிறந்த பாதையை (Optimal Path) மட்டுமே தேர்ந்தெடுக்கும்.

### விரைவு திருப்புதல் (Quick Revision)
• A* வழிமுறையானது Dijkstra மற்றும் Greedy தேடல்களின் சிறந்த கலவையாகும்.
• Admissible Heuristic இருந்தால் எப்போதும் சிறந்த முடிவை தரும்.`,
    quickRevision: [
      "Combines path cost g(n) with heuristic estimate h(n).",
      "Admissibility prevents overestimation.",
      "Widely utilized in robotic navigation, gaming, and route planning.",
    ],
    isSaved: true,
    savedDate: "2024-09-05",
    isCompleted: false,
  },
];

// Initial Uploaded Files
export const INITIAL_FILES: UploadedFile[] = [
  {
    fileId: "file_os_01",
    studentId: "student_nishanth_01",
    fileName: "Operating Systems Question Bank.pdf",
    fileType: "application/pdf",
    fileSize: "2.4 MB",
    uploadDate: "2024-08-28",
    subject: "Operating Systems",
    questionCount: 15,
    questionsAnswered: 15,
    importantCount: 8,
    testStatus: "Completed",
    processingStatus: "completed",
    questions: SEED_QUESTIONS.filter((q) => q.fileId === "file_os_01"),
  },
  {
    fileId: "file_dbms_02",
    studentId: "student_nishanth_01",
    fileName: "DBMS Question Paper Semester IV.pdf",
    fileType: "application/pdf",
    fileSize: "1.8 MB",
    uploadDate: "2024-09-01",
    subject: "DBMS",
    questionCount: 12,
    questionsAnswered: 12,
    importantCount: 6,
    testStatus: "Attempted",
    processingStatus: "completed",
    questions: SEED_QUESTIONS.filter((q) => q.fileId === "file_dbms_02"),
  },
  {
    fileId: "file_ai_03",
    studentId: "student_nishanth_01",
    fileName: "Artificial Intelligence Unit 1-3 Question Bank.pdf",
    fileType: "application/pdf",
    fileSize: "3.1 MB",
    uploadDate: "2024-09-05",
    subject: "Artificial Intelligence",
    questionCount: 18,
    questionsAnswered: 18,
    importantCount: 9,
    testStatus: "Completed",
    processingStatus: "completed",
    questions: SEED_QUESTIONS.filter((q) => q.fileId === "file_ai_03"),
  },
  {
    fileId: "file_cn_04",
    studentId: "student_nishanth_01",
    fileName: "Computer Networks Semester Model Paper.pdf",
    fileType: "application/pdf",
    fileSize: "1.5 MB",
    uploadDate: "2024-09-08",
    subject: "Computer Networks",
    questionCount: 10,
    questionsAnswered: 10,
    importantCount: 5,
    testStatus: "Not Taken",
    processingStatus: "completed",
    questions: [],
  },
];

// Initial Test Results
export const INITIAL_TEST_RESULTS: TestResult[] = [
  {
    id: "tr_01",
    testId: "t_os_test_1",
    studentId: "student_nishanth_01",
    fileId: "file_os_01",
    fileName: "Operating Systems Question Bank.pdf",
    score: 8,
    total: 10,
    percentage: 80,
    date: "2024-09-03",
    subject: "Operating Systems",
    details: [
      {
        questionText: "Which scheduling algorithm assigns fixed time quantum to each active process?",
        selected: "B",
        correct: "B",
        isCorrect: true,
        explanation: "Round Robin uses fixed time quantum slices.",
      },
      {
        questionText: "What condition is NOT part of Coffman's 4 deadlock conditions?",
        selected: "C",
        correct: "C",
        isCorrect: true,
        explanation: "Preemption is not a deadlock condition; No-Preemption is.",
      },
      {
        questionText: "What layer of OSI model handles logical IP routing?",
        selected: "B",
        correct: "B",
        isCorrect: true,
        explanation: "Network Layer handles IP addressing and packet routing.",
      },
    ],
  },
  {
    id: "tr_02",
    testId: "t_dbms_test_2",
    studentId: "student_nishanth_01",
    fileId: "file_dbms_02",
    fileName: "DBMS Question Paper Semester IV.pdf",
    score: 7,
    total: 10,
    percentage: 70,
    date: "2024-09-06",
    subject: "DBMS",
    details: [],
  },
  {
    id: "tr_03",
    testId: "t_ai_test_3",
    studentId: "student_nishanth_01",
    fileId: "file_ai_03",
    fileName: "Artificial Intelligence Unit 1-3 Question Bank.pdf",
    score: 9,
    total: 10,
    percentage: 90,
    date: "2024-09-09",
    subject: "Artificial Intelligence",
    details: [],
  },
];

// Initial Activity Logs
export const INITIAL_ACTIVITIES: ActivityLog[] = [
  {
    id: "act_1",
    studentId: "student_nishanth_01",
    title: "Question Paper uploaded",
    description: "Computer Networks Semester Model Paper.pdf uploaded for analysis",
    timestamp: "2024-09-08 11:30 AM",
    type: "upload",
  },
  {
    id: "act_2",
    studentId: "student_nishanth_01",
    title: "Test completed - 90%",
    description: "Scored 9/10 in Artificial Intelligence Practice Test",
    timestamp: "2024-09-09 03:45 PM",
    type: "test",
  },
  {
    id: "act_3",
    studentId: "student_nishanth_01",
    title: "25 questions completed",
    description: "Completed study review for Operating Systems Unit 2 & 3",
    timestamp: "2024-09-07 05:20 PM",
    type: "complete",
  },
  {
    id: "act_4",
    studentId: "student_nishanth_01",
    title: "10 important questions saved",
    description: "Saved High Priority questions for quick exam revision",
    timestamp: "2024-09-05 06:10 PM",
    type: "save",
  },
];

// -------------------------------------------------------------------
// Store State Engine
// -------------------------------------------------------------------
class AppStore {
  private listeners: Set<() => void> = new Set();

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((fn) => fn());
  }

  // Current User Management (Student or Admin)
  public getCurrentUser(): (StudentProfile | AdminProfile) | null {
    if (typeof window === "undefined") return DEFAULT_STUDENT;
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!raw) {
      // Default to student Nishanth S P on first visit
      this.setCurrentUser(DEFAULT_STUDENT);
      return DEFAULT_STUDENT;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_STUDENT;
    }
  }

  public setCurrentUser(user: (StudentProfile | AdminProfile) | null) {
    if (typeof window === "undefined") return;
    if (!user) {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    } else {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    }
    this.notify();
  }

  // Students Directory
  public getStudents(): StudentProfile[] {
    if (typeof window === "undefined") return INITIAL_STUDENTS_DIRECTORY;
    const raw = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(INITIAL_STUDENTS_DIRECTORY));
      return INITIAL_STUDENTS_DIRECTORY;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_STUDENTS_DIRECTORY;
    }
  }

  public updateStudentStatus(uid: string, status: "active" | "blocked") {
    const list = this.getStudents().map((s) => (s.uid === uid ? { ...s, status } : s));
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(list));

    // If current logged-in user is this student, update session immediately
    const curr = this.getCurrentUser();
    if (curr && "role" in curr && curr.role === "student" && curr.uid === uid) {
      this.setCurrentUser({ ...(curr as StudentProfile), status });
    }
    this.notify();
  }

  public addStudent(student: StudentProfile) {
    const list = [student, ...this.getStudents()];
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(list));
    this.notify();
  }

  public updateStudentProfile(updated: StudentProfile) {
    const list = this.getStudents().map((s) => (s.uid === updated.uid ? updated : s));
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(list));
    const curr = this.getCurrentUser();
    if (curr && curr.uid === updated.uid) {
      this.setCurrentUser(updated);
    }
    this.notify();
  }

  // Admins Directory
  public getAdmins(): AdminProfile[] {
    if (typeof window === "undefined") return DEFAULT_ADMINS;
    const raw = localStorage.getItem(STORAGE_KEYS.ADMINS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.ADMINS, JSON.stringify(DEFAULT_ADMINS));
      return DEFAULT_ADMINS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_ADMINS;
    }
  }

  public addAdmin(admin: AdminProfile) {
    const list = [admin, ...this.getAdmins()];
    localStorage.setItem(STORAGE_KEYS.ADMINS, JSON.stringify(list));
    this.notify();
  }

  // Uploaded Files
  public getFiles(): UploadedFile[] {
    if (typeof window === "undefined") return INITIAL_FILES;
    const raw = localStorage.getItem(STORAGE_KEYS.FILES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.FILES, JSON.stringify(INITIAL_FILES));
      return INITIAL_FILES;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_FILES;
    }
  }

  public addFile(file: UploadedFile) {
    const list = [file, ...this.getFiles()];
    localStorage.setItem(STORAGE_KEYS.FILES, JSON.stringify(list));
    this.logActivity({
      id: `act_${Date.now()}`,
      studentId: file.studentId,
      title: "Question Paper uploaded",
      description: `${file.fileName} uploaded and analyzed (${file.questions.length} questions extracted)`,
      timestamp: new Date().toLocaleString(),
      type: "upload",
    });
    this.notify();
  }

  public updateFileQuestions(fileId: string, questions: QuestionItem[]) {
    const list = this.getFiles().map((f) => {
      if (f.fileId === fileId) {
        return {
          ...f,
          questionCount: questions.length,
          questionsAnswered: questions.length,
          importantCount: questions.filter((q) => q.importance === "HIGH").length,
          questions,
          processingStatus: "completed" as const,
        };
      }
      return f;
    });
    localStorage.setItem(STORAGE_KEYS.FILES, JSON.stringify(list));
    this.notify();
  }

  // Questions & Saved Questions
  public getAllQuestions(): QuestionItem[] {
    const files = this.getFiles();
    const all: QuestionItem[] = [...SEED_QUESTIONS];
    files.forEach((f) => {
      if (f.questions && f.questions.length > 0) {
        f.questions.forEach((q) => {
          if (!all.some((existing) => existing.id === q.id)) {
            all.push(q);
          }
        });
      }
    });
    return all;
  }

  public toggleSaveQuestion(questionId: string) {
    let nowSaved = false;
    // Update inside files
    const files = this.getFiles().map((f) => {
      const updatedQuestions = f.questions.map((q) => {
        if (q.id === questionId) {
          const isSaved = !q.isSaved;
          nowSaved = isSaved;
          return {
            ...q,
            isSaved,
            savedDate: isSaved ? new Date().toISOString().split("T")[0] : undefined,
          };
        }
        return q;
      });
      return { ...f, questions: updatedQuestions };
    });
    localStorage.setItem(STORAGE_KEYS.FILES, JSON.stringify(files));

    // Also update seed questions in memory
    const seed = SEED_QUESTIONS.find((q) => q.id === questionId);
    if (seed) {
      seed.isSaved = !seed.isSaved;
      seed.savedDate = seed.isSaved ? new Date().toISOString().split("T")[0] : undefined;
      nowSaved = seed.isSaved;
    }

    this.logActivity({
      id: `act_${Date.now()}`,
      studentId: "student_nishanth_01",
      title: nowSaved ? "Answer saved for revision" : "Answer removed from saved collection",
      description: nowSaved ? "Saved to your study bookmarks for quick review" : "Updated saved bookmarks",
      timestamp: new Date().toLocaleString(),
      type: "save",
    });

    this.notify();
  }

  public getSavedQuestions(): QuestionItem[] {
    return this.getAllQuestions().filter((q) => q.isSaved);
  }

  public updateQuestionCustomAnswer(
    questionId: string,
    marks: number,
    language: "en" | "ta" | "hi",
    answerText: string
  ) {
    const files = this.getFiles().map((f) => {
      const updatedQuestions = f.questions.map((q) => {
        if (q.id === questionId) {
          const currentAnswers = q.answersByMarks || {};
          const markEntry = currentAnswers[marks] || {};
          return {
            ...q,
            marks,
            answersByMarks: {
              ...currentAnswers,
              [marks]: {
                ...markEntry,
                [language]: answerText,
              },
            },
            ...(language === "en" ? { answerEnglish: answerText } : {}),
            ...(language === "ta" ? { answerTamil: answerText } : {}),
            ...(language === "hi" ? { answerHindi: answerText } : {}),
          };
        }
        return q;
      });
      return { ...f, questions: updatedQuestions };
    });
    localStorage.setItem(STORAGE_KEYS.FILES, JSON.stringify(files));

    const seed = SEED_QUESTIONS.find((q) => q.id === questionId);
    if (seed) {
      const currentAnswers = seed.answersByMarks || {};
      const markEntry = currentAnswers[marks] || {};
      seed.marks = marks;
      seed.answersByMarks = {
        ...currentAnswers,
        [marks]: {
          ...markEntry,
          [language]: answerText,
        },
      };
      if (language === "en") seed.answerEnglish = answerText;
      if (language === "ta") seed.answerTamil = answerText;
      if (language === "hi") seed.answerHindi = answerText;
    }

    this.notify();
  }

  public toggleQuestionCompleted(questionId: string) {
    let newStatus = false;
    const files = this.getFiles().map((f) => {
      const updatedQuestions = f.questions.map((q) => {
        if (q.id === questionId) {
          newStatus = !q.isCompleted;
          return { ...q, isCompleted: newStatus };
        }
        return q;
      });
      return { ...f, questions: updatedQuestions };
    });
    localStorage.setItem(STORAGE_KEYS.FILES, JSON.stringify(files));

    const seed = SEED_QUESTIONS.find((q) => q.id === questionId);
    if (seed) {
      seed.isCompleted = !seed.isCompleted;
      newStatus = seed.isCompleted;
    }

    this.logActivity({
      id: `act_${Date.now()}`,
      studentId: "student_nishanth_01",
      title: newStatus ? "Question marked as prepared" : "Question moved to pending revision",
      description: "Updated your personal exam preparedness status",
      timestamp: new Date().toLocaleString(),
      type: "revision",
    });

    this.notify();
  }

  public getRepeatedQuestions(): (QuestionItem & { occurrences: number; detectedCategory: string })[] {
    const all = this.getAllQuestions();
    const result: (QuestionItem & { occurrences: number; detectedCategory: string })[] = [];

    const normalize = (t: string) =>
      t
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "")
        .replace(/\b(what|is|explain|describe|define|the|and|in|of|for|with|state|list|discuss)\b/g, "")
        .trim();

    for (let i = 0; i < all.length; i++) {
      const q = all[i];
      const normQ = normalize(q.questionText);
      let matchCount = 1;
      let matchedReason = q.repeatedReason || "Repeated in multiple semester papers";
      let cat = q.repeatedType || "similar";

      for (let j = 0; j < all.length; j++) {
        if (i !== j) {
          const otherNorm = normalize(all[j].questionText);
          if (normQ === otherNorm && normQ.length > 5) {
            matchCount++;
            cat = "exact";
          } else if (
            normQ.length > 8 &&
            otherNorm.length > 8 &&
            (normQ.includes(otherNorm) ||
              otherNorm.includes(normQ) ||
              (q.subject && all[j].subject && q.subject === all[j].subject && q.marks === all[j].marks))
          ) {
            matchCount++;
          }
        }
      }

      if (matchCount > 1 || q.isRepeated || q.importance === "HIGH") {
        result.push({
          ...q,
          isRepeated: true,
          occurrences: Math.max(matchCount, q.frequencyCount || 2),
          detectedCategory:
            cat === "exact"
              ? "Exact Repeated Question"
              : cat === "concept"
              ? "Repeated Core Concept"
              : "Similar Exam Question",
          repeatedReason:
            matchedReason || "Detected across multiple past question papers (Anna Univ / RTC pattern)",
        });
      }
    }

    return result;
  }

  // Test Results
  public getTestResults(): TestResult[] {
    if (typeof window === "undefined") return INITIAL_TEST_RESULTS;
    const raw = localStorage.getItem(STORAGE_KEYS.TEST_RESULTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.TEST_RESULTS, JSON.stringify(INITIAL_TEST_RESULTS));
      return INITIAL_TEST_RESULTS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_TEST_RESULTS;
    }
  }

  public recordTestResult(result: TestResult) {
    const list = [result, ...this.getTestResults()];
    localStorage.setItem(STORAGE_KEYS.TEST_RESULTS, JSON.stringify(list));

    // Update file testStatus
    const files = this.getFiles().map((f) => {
      if (f.fileId === result.fileId) {
        return { ...f, testStatus: "Completed" as const };
      }
      return f;
    });
    localStorage.setItem(STORAGE_KEYS.FILES, JSON.stringify(files));

    this.logActivity({
      id: `act_${Date.now()}`,
      studentId: result.studentId,
      title: `Test completed - ${result.percentage}%`,
      description: `Scored ${result.score}/${result.total} in ${result.subject || result.fileName}`,
      timestamp: new Date().toLocaleString(),
      type: "test",
    });

    this.notify();
  }

  // Activity Logs
  public getActivities(): ActivityLog[] {
    if (typeof window === "undefined") return INITIAL_ACTIVITIES;
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(INITIAL_ACTIVITIES));
      return INITIAL_ACTIVITIES;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_ACTIVITIES;
    }
  }

  public logActivity(activity: ActivityLog) {
    const list = [activity, ...this.getActivities()].slice(0, 20);
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(list));
    this.notify();
  }

  // Dynamic Dashboard Stats Calculation
  public getDashboardStats(): DashboardStats {
    const files = this.getFiles();
    const questions = this.getAllQuestions();
    const testResults = this.getTestResults();
    const saved = questions.filter((q) => q.isSaved);
    const repeated = this.getRepeatedQuestions();

    const filesUploaded = files.length;
    const questionsGenerated = questions.length;
    const completedList = questions.filter((q) => q.isCompleted);
    const questionsCompleted = completedList.length || Math.min(questions.length, 8);
    const importantQuestions = questions.filter((q) => q.importance === "HIGH").length;
    const testsTaken = testResults.length;

    const avg =
      testsTaken > 0
        ? Math.round(testResults.reduce((acc, curr) => acc + curr.percentage, 0) / testsTaken)
        : 78;

    const best =
      testsTaken > 0 ? Math.max(...testResults.map((r) => r.percentage)) : 90;

    const revisionProgress =
      questions.length > 0
        ? Math.min(100, Math.round((questionsCompleted / questions.length) * 100))
        : 65;

    return {
      filesUploaded,
      questionsGenerated,
      questionsCompleted,
      importantQuestions,
      repeatedQuestions: repeated.length,
      savedAnswers: saved.length,
      testsTaken,
      averageScore: avg,
      bestScore: best,
      revisionProgress,
    };
  }

  // Admin Dashboard Global Statistics
  public getAdminStats() {
    const students = this.getStudents();
    const files = this.getFiles();
    const questions = this.getAllQuestions();
    const tests = this.getTestResults();

    const totalStudents = students.length;
    const blockedStudents = students.filter((s) => s.status === "blocked").length;
    const activeStudents = totalStudents - blockedStudents;

    return {
      totalStudents,
      activeNow: Math.max(activeStudents, 1),
      blockedStudents,
      totalFilesUploaded: files.length,
      totalQuestionsGenerated: questions.length,
      totalTestsTaken: tests.length,
    };
  }

  // Reset to seed demo state
  public resetToDemo() {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    localStorage.removeItem(STORAGE_KEYS.STUDENTS);
    localStorage.removeItem(STORAGE_KEYS.ADMINS);
    localStorage.removeItem(STORAGE_KEYS.FILES);
    localStorage.removeItem(STORAGE_KEYS.TEST_RESULTS);
    localStorage.removeItem(STORAGE_KEYS.PREDICTIONS);
    localStorage.removeItem(STORAGE_KEYS.ACTIVITIES);
    this.setCurrentUser(DEFAULT_STUDENT);
    this.notify();
  }
}

export const appStore = new AppStore();
