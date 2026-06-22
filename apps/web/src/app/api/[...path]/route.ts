import { NextRequest, NextResponse } from "next/server";
import {
  buildHostelDashboard,
  buildHostelOverview,
  getPortalData,
  learnerName,
  savePortalData,
  uid,
} from "@/src/server/portalData";

type RouteContext = { params: Promise<{ path: string[] }> };

export async function GET(request: NextRequest, context: RouteContext) {
  return handle(request, context);
}

export async function POST(request: NextRequest, context: RouteContext) {
  return handle(request, context);
}

export async function PUT(request: NextRequest, context: RouteContext) {
  return handle(request, context);
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  return handle(request, context);
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  return handle(request, context);
}

async function handle(request: NextRequest, { params }: RouteContext) {
  const { path } = await params;
  const route = path.join("/");
  const method = request.method;
  const data = await getPortalData();

  try {
    if (path[0] === "parent") return handleParent(request, method, path, data);
    if (path[0] === "teacher") return handleTeacher(request, method, path, data);
    if (path[0] === "teacher-assistant") return handleTeacherAssistant(request, method, path, data);
    if (path[0] === "students") return handleStudents(request, method, path, data);
    if (path[0] === "hostel") return handleHostel(request, method, path, data);
    if (path[0] === "applications") return handleApplications(request, method, path, data);
    if (path[0] === "identity") return handleIdentity(request, method, path, data);
  } catch (error: any) {
    return json({ error: error.message || "Portal request failed" }, 400);
  }

  return json({ error: `API route not found: /api/${route}` }, 404);
}

async function readBody(request: NextRequest) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}

function json(value: unknown, status = 200) {
  return NextResponse.json(value, { status });
}

function updateAssessmentCounts(assessment: any) {
  const scripts = assessment.scripts || [];
  assessment.counts = {
    total: scripts.length,
    ready: scripts.filter((script: any) => script.status === "READY_FOR_REVIEW").length,
    needsReview: scripts.filter((script: any) => script.status === "NEEDS_REVIEW").length,
  };
  assessment.status = scripts.some((script: any) => script.status === "NEEDS_REVIEW")
    ? "NEEDS_REVIEW"
    : scripts.some((script: any) => script.status === "READY_FOR_REVIEW")
      ? "READY_FOR_REVIEW"
      : assessment.status || "DRAFT";
}

function findAssistantScript(assessments: any[], scriptId: string) {
  for (const assessment of assessments) {
    const script = (assessment.scripts || []).find((item: any) => item.id === scriptId);
    if (script) return { assessment, script };
  }
  return null;
}

async function handleParent(request: NextRequest, method: string, path: string[], data: any) {
  if (method === "GET" && path.join("/") === "parent/children") {
    const links = data.learners.flatMap((learner: any) =>
      (learner.guardians || []).map((link: any) => ({
        learner,
        permissions: {
          relationshipType: link.relationshipType,
          viewFees: link.viewFees,
          payFees: link.payFees,
          viewReports: link.viewReports,
          viewHomework: link.viewHomework,
          receiveAnnouncements: link.receiveAnnouncements,
          messageTeachers: link.messageTeachers,
          authorisePickup: link.authorisePickup,
          submitApplications: link.submitApplications,
          bookAppointments: link.bookAppointments,
          viewHostel: link.viewHostel,
          applyHostel: link.applyHostel,
          viewHostelBilling: link.viewHostelBilling,
          submitHostelConcerns: link.submitHostelConcerns,
          viewHostelMovement: link.viewHostelMovement,
        },
      })),
    );
    return json(links);
  }

  const learnerId = path[2];
  if (method === "GET" && path[1] === "children" && learnerId && path[3] === "overview") {
    const classes = data.classes.filter((item: any) => (item.learners || []).some((learner: any) => learner.id === learnerId));
    const workItems = classes.flatMap((item: any) => item.workItems || []).filter((item: any) => item.visibleToParents !== false);
    return json({
      homework: workItems.filter((item: any) => item.type === "HOMEWORK"),
      attendance: [{ id: "att-1", title: "Present", status: "PRESENT", startsAt: new Date().toISOString() }],
      assessments: workItems.filter((item: any) => item.type === "ASSESSMENT"),
      announcements: data.teacher.dashboard.announcements || [],
      appointments: [{ id: "appt-1", title: "Parent teacher meeting", startsAt: "2026-06-26T13:00:00.000Z", status: "CONFIRMED" }],
    });
  }

  if (method === "GET" && path[1] === "children" && learnerId && path[3] === "fees") {
    return json(data.parent.fees);
  }

  if (method === "GET" && path[1] === "children" && learnerId && path[3] === "applications") {
    return json(data.applications.forms.flatMap((form: any) => form.submissions || []));
  }

  if (method === "GET" && path[1] === "children" && learnerId && path[3] === "hostel") {
    const overview = buildHostelOverview(data);
    const allocation = overview.allocations.find((item: any) => item.learnerId === learnerId) || null;
    return json({
      application: overview.applications.find((item: any) => item.learnerId === learnerId) || null,
      allocation,
      charges: data.hostel.charges.filter((item: any) => item.learnerId === learnerId),
      notices: data.hostel.notices,
      movementHistory: allocation ? [{ id: "movement-1", status: allocation.status, createdAt: allocation.startDate || new Date().toISOString() }] : [],
    });
  }

  if (method === "POST" && path[1] === "children" && learnerId && path[3] === "hostel" && path[4] === "applications") {
    const body = await readBody(request);
    data.hostel.applications.unshift({ id: uid("hostel-app"), learnerId, status: "PENDING", ...body });
    await savePortalData(data);
    return json(data.hostel.applications[0], 201);
  }

  if (method === "POST" && path[1] === "children" && learnerId && path[3] === "hostel" && path[4] === "concerns") {
    const body = await readBody(request);
    data.hostel.maintenance.unshift({ id: uid("maintenance"), learnerId, source: "Parent Portal", status: "OPEN", priority: "MEDIUM", ...body });
    await savePortalData(data);
    return json(data.hostel.maintenance[0], 201);
  }

  if (method === "GET" && path.join("/") === "parent/orders") return json(data.parent.orders);
  if (method === "GET" && path.join("/") === "parent/tickets") return json(data.parent.tickets);

  return json({ error: `API route not found: /api/${path.join("/")}` }, 404);
}

async function handleTeacher(request: NextRequest, method: string, path: string[], data: any) {
  if (method === "GET" && path.join("/") === "teacher/dashboard") return json(data.teacher.dashboard);
  if (method === "GET" && path.join("/") === "teacher/classes") return json(data.classes);

  if (method === "POST" && path.join("/") === "teacher/work-items") {
    const body = await readBody(request);
    const workItem = { id: uid("work"), ...body, createdAt: new Date().toISOString() };
    const targetClasses = body.classId ? data.classes.filter((item: any) => item.id === body.classId) : data.classes;
    targetClasses.forEach((item: any) => item.workItems.unshift(workItem));
    data.teacher.dashboard.announcements = body.type === "ANNOUNCEMENT" ? [workItem, ...(data.teacher.dashboard.announcements || [])] : data.teacher.dashboard.announcements;
    await savePortalData(data);
    return json(workItem, 201);
  }

  if (method === "POST" && path.join("/") === "teacher/attendance") {
    const body = await readBody(request);
    return json({ id: uid("attendance"), status: body.submit ? "SUBMITTED" : "DRAFT", ...body }, 201);
  }

  return json({ error: `API route not found: /api/${path.join("/")}` }, 404);
}

async function handleTeacherAssistant(request: NextRequest, method: string, path: string[], data: any) {
  const assessments = data.teacherAssistant.assessments;
  if (method === "GET" && path.length === 1) {
    const scripts = assessments.flatMap((assessment: any) => assessment.scripts || []);
    return json({
      metrics: {
        scriptsWaiting: scripts.filter((script: any) => ["QUEUED", "OCR", "MARKING"].includes(script.status)).length,
        readyForReview: scripts.filter((script: any) => script.status === "READY_FOR_REVIEW").length,
        needsAttention: scripts.filter((script: any) => script.status === "NEEDS_REVIEW").length,
        averageReviewSeconds: scripts.length ? 18 : 0,
      },
      assessments,
    });
  }
  if (method === "GET" && path[1] === "assessments" && path[2] && path.length === 3) {
    return json(assessments.find((item: any) => item.id === path[2]) || null);
  }
  if (method === "POST" && path[1] === "assessments" && path.length === 2) {
    const body = await readBody(request);
    const assessment = { id: uid("assessment"), status: "DRAFT", counts: { total: 0, ready: 0, needsReview: 0 }, scripts: [], ...body };
    assessments.unshift(assessment);
    await savePortalData(data);
    return json(assessment, 201);
  }
  if (method === "GET" && path[1] === "assessments" && path[3] === "analytics") {
    const assessment = assessments.find((item: any) => item.id === path[2]);
    const totals: number[] = (assessment?.scripts || []).map((script: any) => Number(script.finalTotal ?? script.suggestedTotal ?? 0));
    const sorted = [...totals].sort((a, b) => a - b);
    const average = totals.length ? totals.reduce((sum, value) => sum + value, 0) / totals.length : 0;
    return json({
      classAverage: average,
      highest: sorted.at(-1) || 0,
      lowest: sorted[0] || 0,
      median: sorted.length ? sorted[Math.floor(sorted.length / 2)] : 0,
      passRate: totals.length ? Math.round((totals.filter((value) => value >= Number(assessment?.totalMarks || 1) * 0.5).length / totals.length) * 100) : 0,
    });
  }
  if (method === "POST" && path[1] === "assessments" && path[3] === "scripts") {
    const assessment = assessments.find((item: any) => item.id === path[2]);
    if (!assessment) return json({ error: "Assessment not found" }, 404);
    const body = await readBody(request);
    const scripts = Array.isArray(body.scripts) ? body.scripts : [];
    const created = scripts.map((script: any) => {
      const results = (assessment.questions || []).map((question: any) => ({
        id: uid("result"),
        questionNumber: question.questionNumber,
        expectedAnswer: question.expectedAnswers || [],
        detectedAnswer: "",
        matchingRule: "Ready for teacher review",
        suggestedMarks: 0,
        finalMarks: 0,
      }));
      return {
        id: uid("script"),
        status: "READY_FOR_REVIEW",
        learnerId: script.learnerId || null,
        originalFiles: script.originalFiles || [],
        extractedText: script.extractedText || "",
        ocrConfidence: script.extractedText ? 0.94 : null,
        markingConfidence: null,
        suggestedTotal: 0,
        finalTotal: 0,
        flags: script.extractedText ? [] : ["Awaiting OCR text"],
        results,
        createdAt: new Date().toISOString(),
      };
    });
    assessment.scripts = [...created, ...(assessment.scripts || [])];
    updateAssessmentCounts(assessment);
    await savePortalData(data);
    return json({ scripts: created }, 201);
  }
  if (method === "PATCH" && path[1] === "scripts" && path[3] === "extracted-text") {
    const match = findAssistantScript(assessments, path[2]);
    if (!match) return json({ error: "Script not found" }, 404);
    Object.assign(match.script, await readBody(request), { status: "READY_FOR_REVIEW", ocrConfidence: 0.94 });
    updateAssessmentCounts(match.assessment);
    await savePortalData(data);
    return json(match.script);
  }
  if (method === "PATCH" && path[1] === "scripts" && path[3] === "results") {
    const match = findAssistantScript(assessments, path[2]);
    if (!match) return json({ error: "Script not found" }, 404);
    const body = await readBody(request);
    for (const result of body.results || []) {
      const target = (match.script.results || []).find((item: any) => item.id === result.resultId);
      if (target) Object.assign(target, { finalMarks: result.finalMarks, note: result.note });
    }
    match.script.finalTotal = (match.script.results || []).reduce((sum: number, result: any) => sum + Number(result.finalMarks || 0), 0);
    await savePortalData(data);
    return json(match.script);
  }
  if (method === "POST" && path[1] === "assessments" && ["approve", "publish"].includes(path[3])) {
    const assessment = assessments.find((item: any) => item.id === path[2]);
    if (!assessment) return json({ error: "Assessment not found" }, 404);
    const body = await readBody(request);
    const scriptIds = new Set(body.scriptIds || []);
    for (const script of assessment.scripts || []) {
      if (scriptIds.has(script.id)) script.status = path[3] === "approve" ? "APPROVED" : "PUBLISHED";
    }
    updateAssessmentCounts(assessment);
    await savePortalData(data);
    return json({ status: "OK" });
  }
  if (method === "POST" || method === "PATCH") {
    return json({ status: "QUEUED" });
  }
  return json({ error: `API route not found: /api/${path.join("/")}` }, 404);
}

async function handleStudents(request: NextRequest, method: string, path: string[], data: any) {
  if (method === "GET" && path.length === 1) {
    const status = request.nextUrl.searchParams.get("status") || "ACTIVE";
    const search = (request.nextUrl.searchParams.get("search") || "").toLowerCase();
    const items = data.learners.filter((item: any) => item.status === status && `${item.firstName} ${item.lastName} ${item.studentNumber} ${item.identityNumber}`.toLowerCase().includes(search));
    return json({ items, grades: data.grades, classes: data.classes, subjects: data.subjects });
  }

  if (method === "POST" && path.length === 1) {
    const body = await readBody(request);
    const learner = { id: uid("learner"), status: "ACTIVE", guardians: [], classHistory: [], ...body };
    data.learners.unshift(learner);
    await savePortalData(data);
    return json(learner, 201);
  }

  if (method === "POST" && path[1] === "import") {
    const body = await readBody(request);
    const students = Array.isArray(body.students) ? body.students : [];
    students.forEach((student: any) => data.learners.unshift({ id: uid("learner"), status: "ACTIVE", guardians: [], classHistory: [], ...student }));
    await savePortalData(data);
    return json({ created: students.length, rejected: 0 });
  }

  if (method === "POST" && path[1] === "teachers") return json({ id: uid("teacher"), ...(await readBody(request)) }, 201);
  if (method === "POST" && ["grades", "classes", "subjects"].includes(path[1])) {
    const body = await readBody(request);
    const item = { id: uid(path[1].slice(0, -1)), ...body };
    data[path[1]].push(item);
    await savePortalData(data);
    return json(item, 201);
  }

  const learner = data.learners.find((item: any) => item.id === path[1]);
  if (!learner) return json({ error: "Student not found" }, 404);
  if (method === "GET" && path.length === 2) return json(learner);
  if (method === "PATCH" && path.length === 2) {
    Object.assign(learner, await readBody(request));
    await savePortalData(data);
    return json(learner);
  }
  if (method === "POST" && path[2] === "guardians") {
    const body = await readBody(request);
    const link = { id: uid("guardian-link"), status: "VERIFIED", guardian: { id: uid("guardian"), email: body.email, name: body.name }, ...body };
    learner.guardians = [link, ...(learner.guardians || [])];
    await savePortalData(data);
    return json(link, 201);
  }
  if (method === "POST" && path[2] === "move") {
    const body = await readBody(request);
    learner.gradeId = body.gradeId || learner.gradeId;
    learner.classId = body.classId || learner.classId;
    learner.classHistory = [{ id: uid("history"), changedAt: new Date().toISOString(), reason: body.reason || "Placement updated" }, ...(learner.classHistory || [])];
    await savePortalData(data);
    return json(learner);
  }
  if (method === "PATCH" && path[2] === "archive") {
    learner.status = "ARCHIVED";
    await savePortalData(data);
    return json(learner);
  }

  return json({ error: `API route not found: /api/${path.join("/")}` }, 404);
}

async function handleHostel(request: NextRequest, method: string, path: string[], data: any) {
  if (method === "GET" && path[1] === "dashboard") return json(buildHostelDashboard(data));
  if (method === "GET" && path[1] === "overview") return json(buildHostelOverview(data));
  if (method === "GET" && path[1] === "reports") {
    const dashboard = buildHostelDashboard(data);
    const overview = buildHostelOverview(data);
    return json({
      dashboard,
      meals: { servedCount: data.hostel.meals.reduce((sum: number, item: any) => sum + Number(item.servedCount || 0), 0) },
      occupancyByBuilding: overview.buildings.map((building: any) => {
        const beds = building.blocks.flatMap((block: any) => block.rooms.flatMap((room: any) => room.beds));
        const occupied = beds.filter((bed: any) => bed.status === "OCCUPIED").length;
        return { id: building.id, name: building.name, capacity: beds.length, occupied };
      }),
    });
  }

  if (method === "POST") {
    const body = await readBody(request);
    if (path[1] === "allocations" && path[3] === "check-in") {
      const allocation = data.hostel.allocations.find((item: any) => item.id === path[2]);
      if (!allocation) return json({ error: "Allocation not found" }, 404);
      Object.assign(allocation, { status: "CHECKED_IN", checkedInAt: new Date().toISOString() });
      await savePortalData(data);
      return json(allocation);
    }
    if (path[1] === "allocations" && path[3] === "check-out") {
      const allocation = data.hostel.allocations.find((item: any) => item.id === path[2]);
      if (!allocation) return json({ error: "Allocation not found" }, 404);
      Object.assign(allocation, { status: "CHECKED_OUT", checkedOutAt: new Date().toISOString(), checkOutReason: body.reason || "" });
      await savePortalData(data);
      return json(allocation);
    }
    if (path[1] === "allocations" && path[3] === "transfer") {
      const allocation = data.hostel.allocations.find((item: any) => item.id === path[2]);
      if (!allocation) return json({ error: "Allocation not found" }, 404);
      Object.assign(allocation, { bedId: body.bedId || allocation.bedId, status: "CHECKED_IN", transferReason: body.reason || "", transferredAt: new Date().toISOString() });
      await savePortalData(data);
      return json(allocation);
    }
    if (path[1] === "visitors" && path[3] === "check-out") {
      const visitor = data.hostel.visitors.find((item: any) => item.id === path[2]);
      if (!visitor) return json({ error: "Visitor not found" }, 404);
      Object.assign(visitor, { status: "CHECKED_OUT", checkedOutAt: new Date().toISOString() });
      await savePortalData(data);
      return json(visitor);
    }

    const collectionMap: Record<string, string> = {
      buildings: "buildings",
      applications: "applications",
      allocations: "allocations",
      "roll-calls": "rollCalls",
      meals: "meals",
      incidents: "incidents",
      maintenance: "maintenance",
      visitors: "visitors",
      charges: "charges",
      notices: "notices",
    };
    if (path[1] === "blocks") {
      const building = data.hostel.buildings.find((item: any) => item.id === body.buildingId);
      if (!building) return json({ error: "Building not found" }, 404);
      const block = { id: uid("block"), rooms: [], ...body };
      building.blocks = [block, ...(building.blocks || [])];
      await savePortalData(data);
      return json(block, 201);
    }
    if (path[1] === "rooms") {
      const building = data.hostel.buildings.find((item: any) => (item.blocks || []).some((block: any) => block.id === body.blockId));
      const block = building?.blocks.find((item: any) => item.id === body.blockId);
      if (!block) return json({ error: "Block not found" }, 404);
      const capacity = Math.max(Number(body.capacity || 1), 1);
      const room = {
        id: uid("room"),
        ...body,
        capacity,
        monthlyFee: Number(body.monthlyFee || 0),
        beds: Array.from({ length: capacity }, (_, index) => ({ id: uid("bed"), label: `Bed ${index + 1}`, status: "AVAILABLE" })),
      };
      block.rooms = [room, ...(block.rooms || [])];
      await savePortalData(data);
      return json(room, 201);
    }
    const key = collectionMap[path[1]];
    if (key) {
      const defaultStatus: Record<string, string> = {
        applications: "PENDING",
        allocations: "RESERVED",
        incidents: "OPEN",
        maintenance: "OPEN",
        visitors: "CHECKED_IN",
        charges: "UNPAID",
      };
      const item = {
        id: uid(path[1]),
        status: body.status || defaultStatus[key] || "OPEN",
        ...(key === "buildings" ? { blocks: [] } : {}),
        ...(key === "visitors" ? { checkedInAt: new Date().toISOString() } : {}),
        ...(key === "charges" ? { paidAmount: 0 } : {}),
        ...body,
      };
      data.hostel[key].unshift(item);
      await savePortalData(data);
      return json(item, 201);
    }
  }

  if (method === "PATCH") {
    const collections = ["applications", "incidents", "maintenance"];
    const collection = collections.includes(path[1]) ? data.hostel[path[1]] : null;
    const item = collection?.find((entry: any) => entry.id === path[2]);
    if (item) {
      Object.assign(item, await readBody(request));
      await savePortalData(data);
      return json(item);
    }
  }

  return json({ error: `API route not found: /api/${path.join("/")}` }, 404);
}

async function handleApplications(request: NextRequest, method: string, path: string[], data: any) {
  const forms = data.applications.forms;
  if (method === "GET" && path.join("/") === "applications/forms") return json(forms);
  if (method === "POST" && path.join("/") === "applications/forms") {
    const body = await readBody(request);
    const form = { id: uid("form"), name: body.name, slug: body.slug, admissionsOpenState: "open", versions: [], submissions: [] };
    forms.unshift(form);
    await savePortalData(data);
    return json(form, 201);
  }

  if (method === "GET" && path.join("/") === "applications/new") {
    const slug = request.nextUrl.searchParams.get("slug") || "admissions";
    const form = forms.find((item: any) => item.slug === slug) || forms[0] || null;
    if (!form) {
      return json({
        admissionsOpen: false,
        closedMessage: "Application form not available.",
        form: null,
      });
    }
    const version = (form.versions || []).find((item: any) => item.id === form.publishedVersionId) || (form.versions || [])[0] || null;
    const state = form.admissionsOpenState || "open";
    return json({
      id: form.id,
      formId: form.id,
      slug: form.slug,
      name: form.name,
      admissionsOpen: state !== "closed",
      admissionsOpenState: state,
      opensAt: form.opensAt || null,
      closesAt: form.closesAt || null,
      openingMessage: form.openingMessage || "",
      closedMessage: form.closedMessage || "Admissions are currently closed. Please check back later.",
      form: version,
    });
  }

  if (method === "POST" && path.join("/") === "applications/new") {
    const body = await readBody(request);
    const form = forms.find((item: any) => item.slug === body.slug) || forms[0];
    const submission = { id: uid("submission"), submissionReference: `APP-${String((form.submissions || []).length + 1).padStart(4, "0")}`, status: "SUBMITTED", submittedAt: new Date().toISOString(), submissionChannel: "website", ...body };
    form.submissions = [submission, ...(form.submissions || [])];
    await savePortalData(data);
    return json(submission, 201);
  }

  const form = forms.find((item: any) => item.id === path[2]);
  if (!form) return json({ error: "Form not found" }, 404);
  if (method === "GET" && path.length === 3) return json(form);
  if (method === "GET" && path[3] === "submissions") return json(form.submissions || []);
  if (method === "POST" && path[3] === "versions") {
    const body = await readBody(request);
    const version = { id: uid("form-version"), version: (form.versions || []).length + 1, createdAt: new Date().toISOString(), schemaJson: body.schema };
    form.versions = [version, ...(form.versions || [])];
    await savePortalData(data);
    return json(version, 201);
  }
  if (method === "POST" && path[3] === "publish") {
    const body = await readBody(request);
    form.publishedVersionId = body.versionId;
    await savePortalData(data);
    return json(form);
  }
  if (method === "PATCH" && path[3] === "status") {
    Object.assign(form, await readBody(request));
    await savePortalData(data);
    return json(form);
  }

  return json({ error: `API route not found: /api/${path.join("/")}` }, 404);
}

async function handleIdentity(request: NextRequest, method: string, path: string[], data: any) {
  if (method === "GET" && path.join("/") === "identity/providers") return json(data.identityProviders);
  const provider = data.identityProviders.find((item: any) => item.provider === path[2]);
  if (!provider) return json({ error: "Provider not found" }, 404);
  if (method === "PUT" && path[1] === "providers" && path.length === 3) {
    Object.assign(provider, await readBody(request), { status: "CONFIGURED", credentialsConfigured: true, tokenHealth: "Ready" });
    await savePortalData(data);
    return json(provider);
  }
  if (method === "DELETE" && path[1] === "providers" && path.length === 3) {
    Object.assign(provider, { status: "NOT_CONFIGURED", credentialsConfigured: false, tokenHealth: "Disconnected" });
    await savePortalData(data);
    return json(provider);
  }
  if (method === "POST" && path[1] === "providers" && path[3] === "sync") {
    provider.lastSyncAt = new Date().toISOString();
    provider.syncLogs = [{ id: uid("sync"), operation: "MANUAL_SYNC", status: "QUEUED", createdAt: provider.lastSyncAt }, ...(provider.syncLogs || [])];
    await savePortalData(data);
    return json({ status: "QUEUED" });
  }
  return json({ error: `API route not found: /api/${path.join("/")}` }, 404);
}
