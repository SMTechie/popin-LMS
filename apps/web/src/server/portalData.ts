import { randomUUID } from "crypto";
import { getSetting, putSetting } from "./settings";

const now = () => new Date().toISOString();

export type PortalData = ReturnType<typeof defaultPortalData>;

export function defaultPortalData() {
  const grades = [
    { id: "grade-8", name: "Grade 8", code: "G8" },
    { id: "grade-9", name: "Grade 9", code: "G9" },
  ];
  const subjects = [
    { id: "subject-math", name: "Mathematics", code: "MATH" },
    { id: "subject-science", name: "Natural Sciences", code: "SCI" },
    { id: "subject-english", name: "English", code: "ENG" },
  ];
  const learners = [
    {
      id: "learner-1",
      firstName: "Ari",
      lastName: "Khumalo",
      preferredName: "Ari",
      dateOfBirth: "2012-03-14",
      identityNumber: "1203140000000",
      email: "ari.khumalo@school.co.za",
      phone: "",
      studentNumber: "POP-7001",
      gradeId: "grade-8",
      classId: "class-8a",
      status: "ACTIVE",
      medicalNotes: "Mild peanut allergy.",
    },
    {
      id: "learner-2",
      firstName: "Mila",
      lastName: "Khumalo",
      preferredName: "Mila",
      dateOfBirth: "2011-09-02",
      identityNumber: "1109020000000",
      email: "mila.khumalo@school.co.za",
      phone: "",
      studentNumber: "POP-6904",
      gradeId: "grade-9",
      classId: "class-9b",
      status: "ACTIVE",
      medicalNotes: "",
    },
  ];
  const guardian = {
    id: "guardian-1",
    email: "admin@school.co.za",
    name: "Sarah Khumalo",
  };
  const guardianLinks = learners.map((learner, index) => ({
    id: `guardian-link-${index + 1}`,
    learnerId: learner.id,
    guardian,
    relationshipType: index === 0 ? "Mother" : "Guardian",
    status: "VERIFIED",
    isPrimary: index === 0,
    viewFees: true,
    payFees: true,
    viewReports: true,
    viewHomework: true,
    receiveAnnouncements: true,
    messageTeachers: true,
    authorisePickup: true,
    submitApplications: true,
    bookAppointments: true,
    viewHostel: true,
    applyHostel: true,
    viewHostelBilling: true,
    submitHostelConcerns: true,
    viewHostelMovement: true,
  }));
  const classes = [
    {
      id: "class-8a",
      name: "8A",
      gradeId: "grade-8",
      room: "B12",
      grade: grades[0],
      learners: [learners[0]],
      assignments: [{ subject: "Mathematics" }, { subject: "Natural Sciences" }],
      timetable: [
        { id: "tt-1", startsAt: "08:00", endsAt: "08:45", subject: "Mathematics", room: "B12", class: { name: "8A", room: "B12" } },
        { id: "tt-2", startsAt: "09:00", endsAt: "09:45", subject: "Natural Sciences", room: "Lab 2", class: { name: "8A", room: "B12" } },
      ],
      workItems: [
        { id: "work-1", type: "HOMEWORK", title: "Algebra practice", status: "PUBLISHED", dueAt: "2026-06-24T14:00:00.000Z", instructions: "Complete exercises 1 to 12.", visibleToParents: true },
        { id: "work-2", type: "LESSON_PLAN", title: "Fractions revision", status: "DRAFT", instructions: "Review common denominators.", visibleToParents: false },
        { id: "work-3", type: "ASSESSMENT", title: "Science quiz", status: "PUBLISHED", dueAt: "2026-06-28T10:00:00.000Z", instructions: "Short quiz on lab safety.", visibleToParents: true },
      ],
    },
    {
      id: "class-9b",
      name: "9B",
      gradeId: "grade-9",
      room: "C08",
      grade: grades[1],
      learners: [learners[1]],
      assignments: [{ subject: "English" }, { subject: "Mathematics" }],
      timetable: [{ id: "tt-3", startsAt: "10:00", endsAt: "10:45", subject: "English", room: "C08", class: { name: "9B", room: "C08" } }],
      workItems: [{ id: "work-4", type: "HOMEWORK", title: "Comprehension worksheet", status: "PUBLISHED", dueAt: "2026-06-25T14:00:00.000Z", instructions: "Read and answer the worksheet.", visibleToParents: true }],
    },
  ];

  const applicationForm = {
    id: "form-admissions",
    name: "Admissions Application",
    slug: "admissions",
    admissionsOpenState: "open",
    opensAt: "",
    closesAt: "",
    closedMessage: "Admissions are currently closed.",
    openingMessage: "Applications are open for the 2026 academic year.",
    publishedVersionId: "form-version-1",
    versions: [
      {
        id: "form-version-1",
        version: 1,
        createdAt: now(),
        schemaJson: {
          title: "Admissions Application",
          description: "Complete the form to apply for admission.",
          steps: [
            {
              id: "step-learner",
              title: "Learner details",
              fields: [
                { id: "field-student-name", type: "text", key: "student_name", label: "Learner Full Name", required: true },
                { id: "field-grade", type: "select", key: "student_grade", label: "Grade Applying For", required: true, options: ["Grade 8", "Grade 9", "Grade 10"] },
                { id: "field-guardian", type: "text", key: "guardian_name", label: "Guardian Name", required: true },
                { id: "field-email", type: "email", key: "guardian_email", label: "Guardian Email", required: true },
              ],
            },
          ],
        },
      },
    ],
    submissions: [
      {
        id: "submission-1",
        submissionReference: "APP-0001",
        applicantName: "Neo Dlamini",
        guardianName: "Thandi Dlamini",
        status: "SUBMITTED",
        submittedAt: "2026-06-21T09:00:00.000Z",
        submissionChannel: "website",
      },
    ],
  };

  const hostel = {
    buildings: [
      {
        id: "hostel-building-1",
        name: "North House",
        code: "NH",
        genderPolicy: "MIXED",
        address: "Main campus",
        blocks: [
          {
            id: "hostel-block-1",
            name: "A Block",
            code: "A",
            rooms: [
              {
                id: "hostel-room-1",
                roomNumber: "A101",
                capacity: 2,
                monthlyFee: 2500,
                beds: [
                  { id: "hostel-bed-1", label: "Bed 1", status: "OCCUPIED" },
                  { id: "hostel-bed-2", label: "Bed 2", status: "AVAILABLE" },
                ],
              },
            ],
          },
        ],
      },
    ],
    applications: [{ id: "hostel-app-1", learnerId: "learner-2", academicYear: 2026, preferredBuildingId: "hostel-building-1", status: "WAITLISTED" }],
    allocations: [{ id: "allocation-1", learnerId: "learner-1", bedId: "hostel-bed-1", status: "CHECKED_IN", startDate: "2026-01-15" }],
    rollCalls: [{ id: "roll-1", rollDate: "2026-06-22", session: "MORNING", status: "SUBMITTED", entries: [{ learnerId: "learner-1", status: "PRESENT" }] }],
    meals: [{ id: "meal-1", mealDate: "2026-06-22", mealType: "BREAKFAST", plannedCount: 48, servedCount: 45 }],
    incidents: [{ id: "incident-1", learnerId: "learner-1", title: "Late lights-out", severity: "LOW", category: "Routine", status: "OPEN", occurredAt: "2026-06-20T20:30:00.000Z" }],
    maintenance: [{ id: "maintenance-1", title: "Window latch loose", source: "Hostel", buildingId: "hostel-building-1", priority: "MEDIUM", status: "OPEN", category: "Facilities", description: "Room A101 latch needs repair." }],
    visitors: [{ id: "visitor-1", learnerId: "learner-1", visitorName: "Sarah Khumalo", checkedInAt: "2026-06-21T14:00:00.000Z", status: "CHECKED_OUT" }],
    charges: [{ id: "charge-1", learnerId: "learner-1", description: "June hostel fee", billingPeriod: "2026-06", amount: 2500, paidAmount: 1000, dueDate: "2026-06-30", status: "PARTIAL" }],
    notices: [{ id: "notice-1", title: "Winter study hours", message: "Study hall starts at 18:30 this week.", createdAt: now() }],
  };

  const identityProviders = ["microsoft", "google", "apple"].map((provider) => ({
    id: `identity-${provider}`,
    provider,
    displayName: provider === "microsoft" ? "Microsoft 365 / Entra ID" : provider === "google" ? "Google Workspace" : "Sign in with Apple",
    tenantDomain: "",
    status: "NOT_CONFIGURED",
    credentialsConfigured: false,
    tokenHealth: "Not connected",
    lastSyncAt: null,
    lastError: "",
    settings: { allowedPortals: provider === "apple" ? ["parent"] : ["admin", "teacher", "parent"], autoCreateTeachers: false, autoCreateAdmins: false },
    roleMappings: [],
    syncLogs: [],
  }));

  return {
    grades,
    subjects,
    classes,
    learners: learners.map((learner) => ({
      ...learner,
      guardians: guardianLinks.filter((link) => link.learnerId === learner.id),
      classHistory: [{ id: `history-${learner.id}`, changedAt: "2026-01-10T08:00:00.000Z", reason: "Initial placement" }],
    })),
    parent: {
      guardianEmail: guardian.email,
      fees: [{ id: "fee-1", term: "Term 2", amount: 12500, paidAmount: 9000, status: "PARTIAL" }],
      orders: [{ id: "parent-order-1", status: "READY_FOR_COLLECTION", totalAmount: 1030, createdAt: "2026-06-21T10:00:00.000Z", items: [{ id: "line-1", name: "Grade 8 Blazer", quantity: 1 }] }],
      tickets: [{ id: "parent-ticket-1", title: "Transport question", status: "OPEN", description: "Question about afternoon pickup." }],
    },
    teacher: {
      dashboard: {
        today: classes.flatMap((item) => item.timetable),
        homeworkDueToday: classes.flatMap((item) => item.workItems).filter((item) => item.type === "HOMEWORK"),
        parentQueries: [{ id: "query-1", subject: "Homework clarification", status: "OPEN", message: "Can you confirm the due date?" }],
        attendanceTasks: classes.map((item) => ({ id: `attendance-${item.id}`, classId: item.id, title: item.name })),
        lessonPlansIncomplete: classes.flatMap((item) => item.workItems).filter((item) => item.type === "LESSON_PLAN"),
        requisitions: [],
        announcements: [{ id: "announcement-1", title: "Science expo", status: "PUBLISHED", instructions: "Expo projects are due next Friday." }],
        teacherAssistant: { readyForReview: 1, needsAttention: 1 },
      },
    },
    applications: { forms: [applicationForm] },
    hostel,
    identityProviders,
    teacherAssistant: {
      assessments: [
        {
          id: "assessment-1",
          name: "Grade 8 Algebra Test",
          subject: "Mathematics",
          status: "READY_FOR_REVIEW",
          counts: { total: 2, ready: 1, needsReview: 1 },
          scripts: [],
          questions: [],
        },
      ],
    },
  };
}

export async function getPortalData() {
  return getSetting<PortalData>("portal-data", defaultPortalData());
}

export async function savePortalData(data: PortalData) {
  await putSetting("portal-data", data);
  return data;
}

export function uid(prefix: string) {
  return `${prefix}-${randomUUID()}`;
}

export function learnerName(data: PortalData, learnerId: string) {
  const learner = data.learners.find((item) => item.id === learnerId);
  return learner ? `${learner.firstName} ${learner.lastName}` : "Learner";
}

export function buildHostelOverview(data: PortalData) {
  const learners = data.learners;
  const buildings = data.hostel.buildings.map((building) => ({
    ...building,
    blocks: building.blocks.map((block) => ({
      ...block,
      rooms: block.rooms.map((room) => ({
        ...room,
        beds: room.beds.map((bed) => ({
          ...bed,
          status: data.hostel.allocations.some((allocation) => allocation.bedId === bed.id && ["RESERVED", "CHECKED_IN"].includes(allocation.status)) ? "OCCUPIED" : bed.status,
        })),
      })),
    })),
  }));
  const bedIndex = new Map<string, any>();
  for (const building of buildings) {
    for (const block of building.blocks) {
      for (const room of block.rooms) {
        for (const bed of room.beds) bedIndex.set(bed.id, { ...bed, room: { ...room, block: { ...block, building } } });
      }
    }
  }
  return {
    learners,
    buildings,
    applications: data.hostel.applications.map((item) => ({
      ...item,
      learner: learners.find((learner) => learner.id === item.learnerId),
      preferredBuilding: buildings.find((building) => building.id === item.preferredBuildingId),
    })),
    allocations: data.hostel.allocations.map((item) => ({
      ...item,
      learner: learners.find((learner) => learner.id === item.learnerId),
      bed: bedIndex.get(item.bedId),
    })),
    rollCalls: data.hostel.rollCalls,
    meals: data.hostel.meals,
    incidents: data.hostel.incidents,
    maintenance: data.hostel.maintenance,
    visitors: data.hostel.visitors,
    charges: data.hostel.charges,
    notices: data.hostel.notices,
  };
}

export function buildHostelDashboard(data: PortalData) {
  const overview = buildHostelOverview(data);
  const beds = overview.buildings.flatMap((building: any) => building.blocks.flatMap((block: any) => block.rooms.flatMap((room: any) => room.beds)));
  const occupied = overview.allocations.filter((item: any) => ["RESERVED", "CHECKED_IN"].includes(item.status)).length;
  return {
    capacity: beds.length,
    occupied,
    available: Math.max(beds.length - occupied, 0),
    pendingApplications: data.hostel.applications.filter((item) => item.status === "PENDING").length,
    waitingList: data.hostel.applications.filter((item) => item.status === "WAITLISTED").length,
    outstandingFees: data.hostel.charges.reduce((sum, item) => sum + item.amount - item.paidAmount, 0),
    checkIns: data.hostel.allocations.filter((item) => item.status === "CHECKED_IN").length,
    checkOuts: data.hostel.allocations.filter((item) => item.status === "CHECKED_OUT").length,
    mealAttendance: data.hostel.meals[0]?.servedCount || 0,
    incidentsThisWeek: data.hostel.incidents.length,
    openMaintenance: data.hostel.maintenance.filter((item) => item.status !== "RESOLVED").length,
  };
}
