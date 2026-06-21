import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const tenant = await prisma.tenant.upsert({
    where: { code: "BREB" },
    update: { name: "Brebner Primary School" },
    create: {
      name: "Brebner Primary School",
      code: "BREB",
      portalUrl: "https://brebnerps.popin-itsm.co.za",
      websiteUrl: "https://brebnerprimary.co.za"
    }
  });

  const adminRole = await prisma.role.upsert({
    where: { name: "Administrator" },
    update: {},
    create: { name: "Administrator", description: "Full access" }
  });

  const teacherRole = await prisma.role.upsert({
    where: { name: "Teacher" },
    update: {},
    create: { name: "Teacher", description: "Teaching staff" }
  });

  const parentRole = await prisma.role.upsert({
    where: { name: "Parent" },
    update: {},
    create: { name: "Parent", description: "Parent portal" }
  });

  const operationalRole = await prisma.role.upsert({
    where: { name: "Operational Staff" },
    update: {},
    create: { name: "Operational Staff", description: "Operations" }
  });

  const hostelAdminRole = await prisma.role.upsert({ where: { name: "Hostel Admin" }, update: {}, create: { name: "Hostel Admin", description: "Full hostel operations" } });
  const hostelWardenRole = await prisma.role.upsert({ where: { name: "Hostel Warden" }, update: {}, create: { name: "Hostel Warden", description: "Hostel allocations, attendance, incidents and welfare" } });
  const houseParentRole = await prisma.role.upsert({ where: { name: "House Parent" }, update: {}, create: { name: "House Parent", description: "Daily hostel care and roll call" } });
  const financeAdminRole = await prisma.role.upsert({ where: { name: "Finance Admin" }, update: {}, create: { name: "Finance Admin", description: "School and hostel billing" } });

  const permissions = [
    { module: "board", action: "view" },
    { module: "board", action: "create" },
    { module: "board", action: "edit" },
    { module: "board", action: "move" },
    { module: "board", action: "comment" },
    { module: "payments", action: "edit" },
    { module: "licensing", action: "view" },
    { module: "licensing", action: "edit" },
    { module: "branding", action: "view" },
    { module: "branding", action: "edit" },
    { module: "automation", action: "view" },
    { module: "automation", action: "create" },
    { module: "email", action: "view" },
    { module: "email", action: "create" },
    { module: "inventory", action: "view" },
    { module: "inventory", action: "inventory.item.create" },
    { module: "inventory", action: "inventory.item.update" },
    { module: "inventory", action: "inventory.item.archive" },
    { module: "inventory", action: "inventory.stock.receive" },
    { module: "inventory", action: "inventory.stock.adjust" },
    { module: "inventory", action: "inventory.stock.transfer" },
    { module: "inventory", action: "inventory.stock.issue" },
    { module: "inventory", action: "inventory.request.create" },
    { module: "inventory", action: "inventory.request.approve" },
    { module: "inventory", action: "inventory.request.fulfill" },
    { module: "inventory", action: "inventory.count.manage" },
    { module: "inventory", action: "inventory.settings.manage" },
    { module: "inventory", action: "inventory.reports.view" },
    { module: "inventory", action: "inventory.valuation.view" },
    { module: "inventory", action: "inventory.location.manage" },
    { module: "inventory", action: "inventory.import" },
    { module: "inventory", action: "inventory.export" },
    { module: "inventory", action: "inventory.audit.view" },
    { module: "requisition", action: "view" },
    { module: "requisition", action: "create" },
    { module: "requisition", action: "edit" },
    { module: "requisition", action: "approve" },
    { module: "requisition", action: "purchase" },
    { module: "requisition", action: "deliver" },
    { module: "integrations", action: "integrations.manage" },
    { module: "integrations", action: "integrations.credentials.generate" },
    { module: "integrations", action: "integrations.credentials.rotate" },
    { module: "integrations", action: "integrations.logs.view" },
    { module: "uniform_store", action: "store.view" },
    { module: "uniform_store", action: "store.manage" },
    { module: "uniform_store", action: "store.publish" },
    { module: "parent_portal", action: "view" },
    { module: "parent_portal", action: "create" },
    { module: "admissions", action: "applications.form.manage" },
    { module: "admissions", action: "applications.form.publish" },
    { module: "admissions", action: "applications.open.close" },
    { module: "admissions", action: "applications.submissions.view" },
    { module: "admissions", action: "admissions.ticket.manage" },
    { module: "teacher_portal", action: "teacher.view" },
    { module: "teacher_portal", action: "teacher.manage" },
    { module: "teacher_portal", action: "teacher.attendance" },
    { module: "teacher_portal", action: "teacher.communicate" }
    , { module: "teacher_portal", action: "teacher.assistant" }
    , { module: "students", action: "student.view" }
    , { module: "students", action: "student.manage" }
    , { module: "students", action: "student.import" }
    , { module: "students", action: "guardian.manage" }
    , { module: "students", action: "teacher.manage" }
    , { module: "hostel", action: "hostel.view" }
    , { module: "hostel", action: "hostel.setup.manage" }
    , { module: "hostel", action: "hostel.applications.manage" }
    , { module: "hostel", action: "hostel.allocations.manage" }
    , { module: "hostel", action: "hostel.attendance.manage" }
    , { module: "hostel", action: "hostel.meals.manage" }
    , { module: "hostel", action: "hostel.incidents.manage" }
    , { module: "hostel", action: "hostel.maintenance.manage" }
    , { module: "hostel", action: "hostel.visitors.manage" }
    , { module: "hostel", action: "hostel.billing.manage" }
    , { module: "hostel", action: "hostel.communicate" }
    , { module: "hostel", action: "hostel.reports.view" }
  ];

  const permissionIds = [] as string[];
  for (const perm of permissions) {
    const existing = await prisma.permission.findFirst({
      where: { module: perm.module, action: perm.action, boardId: null, stageId: null }
    });

    const p =
      existing ??
      (await prisma.permission.create({
        data: { module: perm.module, action: perm.action }
      }));

    permissionIds.push(p.id);
  }

  await prisma.rolePermission.deleteMany({ where: { roleId: adminRole.id } });
  await prisma.rolePermission.createMany({
    data: permissionIds.map((permissionId) => ({ roleId: adminRole.id, permissionId }))
  });

  const hostelPermissions = await prisma.permission.findMany({ where: { module: "hostel" } });
  const hostelRoleMatrix: Array<{ role: { id: string }; actions: string[] }> = [
    { role: hostelAdminRole, actions: hostelPermissions.map((permission) => permission.action) },
    { role: hostelWardenRole, actions: ["hostel.view", "hostel.applications.manage", "hostel.allocations.manage", "hostel.attendance.manage", "hostel.meals.manage", "hostel.incidents.manage", "hostel.maintenance.manage", "hostel.visitors.manage", "hostel.communicate", "hostel.reports.view"] },
    { role: houseParentRole, actions: ["hostel.view", "hostel.attendance.manage", "hostel.meals.manage", "hostel.incidents.manage", "hostel.maintenance.manage", "hostel.visitors.manage", "hostel.communicate"] },
    { role: financeAdminRole, actions: ["hostel.view", "hostel.billing.manage", "hostel.reports.view"] }
  ];
  for (const entry of hostelRoleMatrix) {
    await prisma.rolePermission.deleteMany({ where: { roleId: entry.role.id } });
    await prisma.rolePermission.createMany({ data: hostelPermissions.filter((permission) => entry.actions.includes(permission.action)).map((permission) => ({ roleId: entry.role.id, permissionId: permission.id })) });
  }

  const parentPermissions = await prisma.permission.findMany({
    where: { OR: [{ module: "uniform_store", action: "store.view" }, { module: "parent_portal", action: { in: ["view", "create"] } }] }
  });

  await prisma.rolePermission.deleteMany({ where: { roleId: parentRole.id } });
  await prisma.rolePermission.createMany({
    data: parentPermissions.map((permission) => ({ roleId: parentRole.id, permissionId: permission.id }))
  });

  const teacherPermissions = await prisma.permission.findMany({ where: { module: "teacher_portal" } });
  await prisma.rolePermission.deleteMany({ where: { roleId: teacherRole.id } });
  await prisma.rolePermission.createMany({
    data: teacherPermissions.map((permission) => ({ roleId: teacherRole.id, permissionId: permission.id }))
  });

  const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@school.co.za";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "Admin123!";
  const adminPasswordHash = await bcrypt.hash(adminPassword, 12);

  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      name: "Admin",
      status: "ACTIVE",
      passwordHash: adminPasswordHash
      , userType: "ADMIN"
    },
    create: {
      email: adminEmail,
      name: "Admin",
      status: "ACTIVE",
      passwordHash: adminPasswordHash
      , userType: "ADMIN"
    }
  });

  await prisma.userRole.createMany({
    data: [{ userId: adminUser.id, roleId: adminRole.id }],
    skipDuplicates: true
  });

  const grade = await prisma.academicGrade.upsert({
    where: { tenantId_code: { tenantId: tenant.id, code: "G7" } },
    update: { name: "Grade 7", isActive: true },
    create: { tenantId: tenant.id, name: "Grade 7", code: "G7", sortOrder: 7 }
  });
  const schoolClass = await prisma.schoolClass.upsert({
    where: { tenantId_code_academicYear: { tenantId: tenant.id, code: "7A", academicYear: new Date().getFullYear() } },
    update: { name: "Grade 7A", room: "A12", isActive: true },
    create: { tenantId: tenant.id, gradeId: grade.id, name: "Grade 7A", code: "7A", academicYear: new Date().getFullYear(), room: "A12" }
  });
  await prisma.teacherClassAssignment.upsert({
    where: { teacherId_classId_subject: { teacherId: adminUser.id, classId: schoolClass.id, subject: "Mathematics" } },
    update: { isPrimary: true },
    create: { tenantId: tenant.id, teacherId: adminUser.id, classId: schoolClass.id, subject: "Mathematics", isPrimary: true }
  });
  await prisma.learnerProfile.createMany({
    data: [
      { tenantId: tenant.id, classId: schoolClass.id, gradeId: grade.id, studentNumber: "POP-7001", firstName: "Amahle", lastName: "Dlamini", parentIds: [adminUser.id] },
      { tenantId: tenant.id, classId: schoolClass.id, gradeId: grade.id, studentNumber: "POP-7002", firstName: "Liam", lastName: "Naidoo", parentIds: [adminUser.id] },
      { tenantId: tenant.id, classId: schoolClass.id, gradeId: grade.id, studentNumber: "POP-7003", firstName: "Naledi", lastName: "Mokoena", parentIds: [adminUser.id] }
    ],
    skipDuplicates: true
  });
  const seededLearners = await prisma.learnerProfile.findMany({ where: { tenantId: tenant.id, studentNumber: { in: ["POP-7001", "POP-7002", "POP-7003"] } } });
  for (const learner of seededLearners) {
    await prisma.guardianStudentLink.upsert({
      where: { guardianUserId_learnerId_relationshipType: { guardianUserId: adminUser.id, learnerId: learner.id, relationshipType: "Guardian" } },
      update: { status: "ACTIVE", verifiedAt: new Date(), viewFees: true, payFees: true, viewReports: true, viewHomework: true, receiveAnnouncements: true, messageTeachers: true, submitApplications: true, bookAppointments: true, viewHostel: true, applyHostel: true, viewHostelBilling: true, submitHostelConcerns: true, viewHostelMovement: true },
      create: { tenantId: tenant.id, guardianUserId: adminUser.id, learnerId: learner.id, relationshipType: "Guardian", status: "ACTIVE", verifiedAt: new Date(), verifiedById: adminUser.id, createdById: adminUser.id, viewFees: true, payFees: true, viewReports: true, viewHomework: true, receiveAnnouncements: true, messageTeachers: true, submitApplications: true, bookAppointments: true, viewHostel: true, applyHostel: true, viewHostelBilling: true, submitHostelConcerns: true, viewHostelMovement: true }
    });
  }
  const hostelBuilding = await prisma.hostelBuilding.upsert({ where: { tenantId_code: { tenantId: tenant.id, code: "MADIBA" } }, update: { name: "Madiba House", isActive: true }, create: { tenantId: tenant.id, name: "Madiba House", code: "MADIBA", genderPolicy: "MIXED", address: "North Campus" } });
  let hostelBlock = await prisma.hostelBlock.findFirst({ where: { buildingId: hostelBuilding.id, code: "A" } });
  if (!hostelBlock) hostelBlock = await prisma.hostelBlock.create({ data: { tenantId: tenant.id, buildingId: hostelBuilding.id, name: "Block A", code: "A" } });
  for (const roomNumber of ["A01", "A02", "A03"]) {
    let room = await prisma.hostelRoom.findFirst({ where: { blockId: hostelBlock.id, roomNumber } });
    if (!room) room = await prisma.hostelRoom.create({ data: { tenantId: tenant.id, blockId: hostelBlock.id, roomNumber, capacity: 4, monthlyFee: 2850 } });
    for (let bed = 1; bed <= 4; bed++) await prisma.hostelBed.upsert({ where: { roomId_label: { roomId: room.id, label: `Bed ${bed}` } }, update: {}, create: { tenantId: tenant.id, roomId: room.id, label: `Bed ${bed}` } });
  }
  const demoLearner = seededLearners.find((learner) => learner.studentNumber === "POP-7001");
  if (demoLearner) {
    const existingApplication = await prisma.hostelApplication.findFirst({ where: { tenantId: tenant.id, learnerId: demoLearner.id, academicYear: new Date().getFullYear() } });
    if (!existingApplication) await prisma.hostelApplication.create({ data: { tenantId: tenant.id, learnerId: demoLearner.id, parentUserId: adminUser.id, academicYear: new Date().getFullYear(), preferredBuildingId: hostelBuilding.id, reason: "Weekly boarding placement", status: "SUBMITTED" } });
    const existingCharge = await prisma.hostelCharge.findFirst({ where: { tenantId: tenant.id, learnerId: demoLearner.id, billingPeriod: "Demo term" } });
    if (!existingCharge) await prisma.hostelCharge.create({ data: { tenantId: tenant.id, learnerId: demoLearner.id, description: "Hostel accommodation", billingPeriod: "Demo term", amount: 8550, paidAmount: 3000, status: "PARTIAL", dueDate: new Date(Date.now() + 14 * 86400000), createdById: adminUser.id } });
  }
  for (const entry of [
    { dayOfWeek: 1, startsAt: "08:00", endsAt: "08:45" },
    { dayOfWeek: 3, startsAt: "10:15", endsAt: "11:00" },
    { dayOfWeek: 5, startsAt: "09:00", endsAt: "09:45" }
  ]) {
    const existing = await prisma.teacherTimetableEntry.findFirst({ where: { teacherId: adminUser.id, classId: schoolClass.id, subject: "Mathematics", dayOfWeek: entry.dayOfWeek } });
    if (!existing) await prisma.teacherTimetableEntry.create({ data: { tenantId: tenant.id, teacherId: adminUser.id, classId: schoolClass.id, subject: "Mathematics", room: "A12", ...entry } });
  }
  const seededHomework = await prisma.teacherWorkItem.findFirst({ where: { tenantId: tenant.id, teacherId: adminUser.id, title: "Fractions revision" } });
  if (!seededHomework) {
    await prisma.teacherWorkItem.create({
      data: { tenantId: tenant.id, teacherId: adminUser.id, classId: schoolClass.id, type: "HOMEWORK", title: "Fractions revision", instructions: "Complete exercises 1–12 and show all calculations.", dueAt: new Date(Date.now() + 24 * 60 * 60 * 1000), status: "PUBLISHED", visibleToParents: true, attachments: [] }
    });
  }

  await prisma.setting.upsert({
    where: { key: "branding" },
    update: {},
    create: {
      key: "branding",
      value: {
        schoolName: "POPIN Demo School",
        email: "info@school.co.za",
        phone: "+27 11 000 0000",
        website: "https://school.co.za"
      }
    }
  });

  await prisma.setting.upsert({
    where: { key: "pwa" },
    update: {},
    create: {
      key: "pwa",
      value: {
        enabled: true,
        vapidPublicKey: process.env.VAPID_PUBLIC_KEY || ""
      }
    }
  });

  await prisma.moduleToggle.createMany({
    data: [
      "board",
      "requisition",
      "scm",
      "inventory",
      "uniform_store",
      "teacher_portal",
      "parent_portal",
      "hostel",
      "ticket",
      "admissions",
      "analytics",
      "branding",
      "email",
      "payments",
      "licensing",
      "automation",
      "integrations",
      "students",
      "applications"
    ].map((moduleKey) => ({ moduleKey, enabled: true })),
    skipDuplicates: true
  });

  await prisma.board.create({
    data: {
      name: "Tickets",
      module: "ticket",
      description: "Default ticket workflow",
      stages: {
        create: [
          { name: "New", order: 1 },
          { name: "Assigned", order: 2 },
          { name: "In Progress", order: 3 },
          { name: "Waiting on Parent", order: 4 },
          { name: "Resolved", order: 5 },
          { name: "Closed", order: 6 }
        ]
      }
    }
  });

  await prisma.board.create({
    data: {
      name: "Uniform Orders",
      module: "uniform_store",
      description: "Uniform store orders",
      stages: {
        create: [
          { name: "Pending Payment", order: 1 },
          { name: "Pending EFT Verification", order: 2 },
          { name: "Paid", order: 3 },
          { name: "Picking", order: 4 },
          { name: "Ready for Collection", order: 5 },
          { name: "Collected", order: 6 },
          { name: "Completed", order: 7 },
          { name: "Returned", order: 8 }
        ]
      }
    }
  });

  await prisma.board.create({
    data: {
      name: "Admissions",
      module: "admissions",
      description: "Admissions workflow",
      stages: {
        create: [
          { name: "Submitted", order: 1 },
          { name: "Document Check", order: 2 },
          { name: "Missing Documents", order: 3 },
          { name: "Under Review", order: 4 },
          { name: "Interview", order: 5 },
          { name: "Decision Pending", order: 6 },
          { name: "Accepted", order: 7 },
          { name: "Waitlisted", order: 8 },
          { name: "Rejected", order: 9 }
        ]
      }
    }
  });

  await prisma.license.create({
    data: {
      maxUsers: 200,
      maxTeachers: 80,
      maxParents: 500,
      maxApiIntegrations: 10
    }
  });

  const unitEach = await prisma.inventoryUnit.upsert({
    where: { name: "Each" },
    update: {},
    create: { name: "Each", abbreviation: "ea" }
  });
  const unitPack = await prisma.inventoryUnit.upsert({
    where: { name: "Pack" },
    update: {},
    create: { name: "Pack", abbreviation: "pk" }
  });
  const unitBox = await prisma.inventoryUnit.upsert({
    where: { name: "Box" },
    update: {},
    create: { name: "Box", abbreviation: "box" }
  });
  const unitLiter = await prisma.inventoryUnit.upsert({
    where: { name: "Liter" },
    update: {},
    create: { name: "Liter", abbreviation: "L" }
  });

  const categories = await Promise.all(
    [
      "Uniforms",
      "Stationery",
      "Cleaning",
      "IT",
      "Hostel",
      "Maintenance",
      "Kitchen",
      "Sports",
      "Lab"
    ].map((name) =>
      prisma.inventoryCategory.upsert({
        where: { code: name.replace(/\s+/g, "_").toUpperCase() },
        update: {},
        create: { name }
      })
    )
  );
  const categoryByName = Object.fromEntries(categories.map((c) => [c.name, c]));

  const locations = await Promise.all(
    [
      "Main Store",
      "Uniform Store",
      "Hostel Store",
      "Maintenance Store",
      "Kitchen Store",
      "Stationery Room",
      "Lab Store",
      "IT Storeroom",
      "Sports Equipment Room"
    ].map((name) =>
      prisma.inventoryLocation.upsert({
        where: { code: name.replace(/\s+/g, "_").toUpperCase() },
        update: { isActive: true },
        create: { name, code: name.replace(/\s+/g, "_").toUpperCase(), isActive: true }
      })
    )
  );
  const locationByName = Object.fromEntries(locations.map((l) => [l.name, l]));

  await prisma.inventoryLocationAccess.createMany({
    data: locations.map((loc) => ({
      userId: adminUser.id,
      locationId: loc.id,
      canIssue: true,
      canApprove: true
    })),
    skipDuplicates: true
  });

  const blazer = await prisma.inventoryItem.upsert({
    where: { sku: "UNI-BLAZER" },
    update: {},
    create: {
      name: "School Blazer",
      sku: "UNI-BLAZER",
      description: "Senior school blazer",
      categoryId: categoryByName["Uniforms"].id,
      unitId: unitEach.id,
      type: "UNIFORM",
      tracking: "NONE",
      reorderPoint: 10,
      minStock: 6
    }
  });

  const stationeryPack = await prisma.inventoryItem.upsert({
    where: { sku: "STAT-A4-PAPER" },
    update: {},
    create: {
      name: "A4 Printer Paper",
      sku: "STAT-A4-PAPER",
      description: "500 sheet ream",
      categoryId: categoryByName["Stationery"].id,
      unitId: unitPack.id,
      type: "CONSUMABLE",
      tracking: "NONE",
      reorderPoint: 20,
      minStock: 10
    }
  });

  const sanitizer = await prisma.inventoryItem.upsert({
    where: { sku: "CLN-SANITIZER" },
    update: {},
    create: {
      name: "Hand Sanitizer 5L",
      sku: "CLN-SANITIZER",
      description: "Bulk sanitizer for classrooms",
      categoryId: categoryByName["Cleaning"].id,
      unitId: unitLiter.id,
      type: "CONSUMABLE",
      tracking: "BATCH",
      reorderPoint: 15,
      minStock: 8
    }
  });

  const laptop = await prisma.inventoryItem.upsert({
    where: { sku: "IT-LAPTOP-EDU" },
    update: {},
    create: {
      name: "Education Laptop",
      sku: "IT-LAPTOP-EDU",
      description: "Student loaner device",
      categoryId: categoryByName["IT"].id,
      unitId: unitEach.id,
      type: "ASSET",
      tracking: "SERIAL",
      reorderPoint: 3,
      minStock: 2
    }
  });

  const blazerVariants = [
    { name: "Small", sku: "UNI-BLAZER-S", attributes: { size: "S", gender: "Unisex" } },
    { name: "Medium", sku: "UNI-BLAZER-M", attributes: { size: "M", gender: "Unisex" } },
    { name: "Large", sku: "UNI-BLAZER-L", attributes: { size: "L", gender: "Unisex" } }
  ];
  for (const variant of blazerVariants) {
    await prisma.inventoryItemVariant.upsert({
      where: { sku: variant.sku },
      update: {},
      create: {
        itemId: blazer.id,
        name: variant.name,
        sku: variant.sku,
        attributes: variant.attributes
      }
    });
  }

  const blazerVariant = await prisma.inventoryItemVariant.findFirst({
    where: { itemId: blazer.id, sku: "UNI-BLAZER-M" }
  });

  const mainStore = locationByName["Main Store"];
  const uniformStore = locationByName["Uniform Store"];

  const upsertBalance = async (input: {
    itemId: string;
    variantId?: string | null;
    locationId: string;
    quantityOnHand: number;
    quantityReserved: number;
    averageCost: number;
  }) => {
    const existing = await prisma.inventoryStockBalance.findFirst({
      where: {
        itemId: input.itemId,
        variantId: input.variantId ?? null,
        locationId: input.locationId,
        binId: null
      }
    });

    if (existing) {
      return prisma.inventoryStockBalance.update({
        where: { id: existing.id },
        data: {
          quantityOnHand: input.quantityOnHand,
          quantityReserved: input.quantityReserved,
          averageCost: input.averageCost
        }
      });
    }

    return prisma.inventoryStockBalance.create({
      data: {
        itemId: input.itemId,
        variantId: input.variantId ?? null,
        locationId: input.locationId,
        binId: null,
        quantityOnHand: input.quantityOnHand,
        quantityReserved: input.quantityReserved,
        averageCost: input.averageCost
      }
    });
  };

  await upsertBalance({
    itemId: blazer.id,
    variantId: blazerVariant?.id || null,
    locationId: uniformStore.id,
    quantityOnHand: 28,
    quantityReserved: 4,
    averageCost: 420
  });

  await upsertBalance({
    itemId: stationeryPack.id,
    variantId: null,
    locationId: mainStore.id,
    quantityOnHand: 140,
    quantityReserved: 12,
    averageCost: 58
  });

  await upsertBalance({
    itemId: sanitizer.id,
    variantId: null,
    locationId: mainStore.id,
    quantityOnHand: 52,
    quantityReserved: 6,
    averageCost: 180
  });

  await upsertBalance({
    itemId: laptop.id,
    variantId: null,
    locationId: locationByName["IT Storeroom"].id,
    quantityOnHand: 12,
    quantityReserved: 1,
    averageCost: 9800
  });

  await prisma.inventoryStockMovement.createMany({
    data: [
      {
        itemId: blazer.id,
        variantId: blazerVariant?.id || null,
        locationToId: uniformStore.id,
        quantity: 28,
        unitCost: 420,
        type: "RECEIVE",
        reference: "RCV-UNI-0001"
      },
      {
        itemId: stationeryPack.id,
        locationToId: mainStore.id,
        quantity: 140,
        unitCost: 58,
        type: "RECEIVE",
        reference: "RCV-STAT-0003"
      },
      {
        itemId: sanitizer.id,
        locationToId: mainStore.id,
        quantity: 52,
        unitCost: 180,
        type: "RECEIVE",
        reference: "RCV-CLN-0004"
      },
      {
        itemId: laptop.id,
        locationToId: locationByName["IT Storeroom"].id,
        quantity: 12,
        unitCost: 9800,
        type: "RECEIVE",
        reference: "RCV-IT-0002"
      }
    ]
  });

  const catalog = await prisma.storeCatalog.create({
    data: {
      tenantId: tenant.id,
      name: "School Store",
      slug: "school-store",
      status: "published",
      publishedAt: new Date()
    }
  });

  const uniformCategory = await prisma.storeCategory.create({
    data: {
      tenantId: tenant.id,
      catalogId: catalog.id,
      name: "Uniforms",
      slug: "uniforms",
      description: "Official school uniforms",
      sortOrder: 1,
      isActive: true
    }
  });

  const stationeryCategory = await prisma.storeCategory.create({
    data: {
      tenantId: tenant.id,
      catalogId: catalog.id,
      name: "Stationery",
      slug: "stationery",
      description: "Daily classroom essentials",
      sortOrder: 2,
      isActive: true
    }
  });

  const blazerProduct = await prisma.storeProduct.create({
    data: {
      tenantId: tenant.id,
      catalogId: catalog.id,
      categoryId: uniformCategory.id,
      productType: "uniform",
      sku: "UNI-BLAZER",
      name: "Senior Blazer",
      slug: "senior-blazer",
      shortDescription: "Premium blazer for senior grades",
      longDescription: "Tailored senior blazer with school crest.",
      basePrice: 650,
      currencyCode: "ZAR",
      stockQuantity: 48,
      lowStockThreshold: 12,
      trackInventory: true,
      isActive: true,
      isFeatured: true,
      visibility: "universal"
    }
  });

  await prisma.storeImage.create({
    data: {
      tenantId: tenant.id,
      productId: blazerProduct.id,
      url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800",
      altText: "School blazer",
      sortOrder: 1,
      isPrimary: true
    }
  });

  await prisma.storeVariant.createMany({
    data: [
      { tenantId: tenant.id, productId: blazerProduct.id, name: "Small", sku: "UNI-BLAZER-S", size: "S", color: "Navy", priceOverride: 650, stockQuantity: 16 },
      { tenantId: tenant.id, productId: blazerProduct.id, name: "Medium", sku: "UNI-BLAZER-M", size: "M", color: "Navy", priceOverride: 650, stockQuantity: 18 },
      { tenantId: tenant.id, productId: blazerProduct.id, name: "Large", sku: "UNI-BLAZER-L", size: "L", color: "Navy", priceOverride: 650, stockQuantity: 14 }
    ]
  });

  await prisma.storeProduct.create({
    data: {
      tenantId: tenant.id,
      catalogId: catalog.id,
      categoryId: stationeryCategory.id,
      productType: "stationery",
      sku: "STAT-A4",
      name: "A4 Exam Pad",
      slug: "a4-exam-pad",
      shortDescription: "A4 pad for exams and notes",
      longDescription: "200 page exam pad.",
      basePrice: 35,
      currencyCode: "ZAR",
      stockQuantity: 220,
      lowStockThreshold: 50,
      trackInventory: true,
      isActive: true,
      visibility: "universal"
    }
  });

  const applicationForm = await prisma.applicationForm.create({
    data: {
      tenantId: tenant.id,
      name: "Admissions Application",
      slug: "admissions",
      status: "published",
      admissionsOpenState: "open",
      openingMessage: "Admissions open for the next intake."
    }
  });

  const formVersion = await prisma.applicationFormVersion.create({
    data: {
      tenantId: tenant.id,
      formId: applicationForm.id,
      versionNumber: 1,
      isPublished: true,
      publishedAt: new Date(),
      schemaJson: {
        title: "Admissions Application",
        description: "Complete the form to apply for admission.",
        steps: [
          {
            title: "Learner Details",
            fields: [
              { key: "student_name", label: "Learner Full Name", type: "text", required: true },
              { key: "student_grade", label: "Grade Applying For", type: "text", required: true },
              { key: "student_birthdate", label: "Date of Birth", type: "date", required: true }
            ]
          },
          {
            title: "Guardian Details",
            fields: [
              { key: "guardian_name", label: "Guardian Name", type: "text", required: true },
              { key: "guardian_email", label: "Guardian Email", type: "email", required: true },
              { key: "guardian_phone", label: "Guardian Phone", type: "phone", required: true }
            ]
          }
        ]
      }
    }
  });

  await prisma.applicationForm.update({
    where: { id: applicationForm.id },
    data: { currentVersionId: formVersion.id }
  });

  const requisitionTicket = await prisma.ticket.create({
    data: {
      type: "REQUISITION",
      title: "Science Lab Consumables",
      description: "Replenish lab consumables for Term 2 practicals.",
      department: "Science",
      priority: "High",
      status: "PENDING_APPROVAL",
      createdById: adminUser.id,
      requisition: {
        create: {
          budgetCode: "SCI-TERM2-2026",
          requiredDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
          deliveryLocation: "Lab Store",
          vendorPreference: "EduLab Supplies",
          procurementStatus: "Awaiting approval",
          approvalLevel: 2,
          estimatedTotalCost: 12450
        }
      },
      items: {
        create: [
          {
            itemName: "Microscope Slides",
            category: "Lab",
            quantity: 20,
            estimatedUnitCost: 120,
            totalCost: 2400,
            itemType: "NEW_INVENTORY"
          },
          {
            itemName: "Latex Gloves (Box)",
            category: "Lab",
            quantity: 15,
            estimatedUnitCost: 180,
            totalCost: 2700,
            itemType: "EXISTING_INVENTORY",
            inventoryItemId: sanitizer.id
          },
          {
            itemName: "Beaker Set (Pack)",
            category: "Lab",
            quantity: 6,
            estimatedUnitCost: 450,
            totalCost: 2700,
            itemType: "NEW_INVENTORY"
          }
        ]
      }
    }
  });

  await prisma.ticket.update({
    where: { id: requisitionTicket.id },
    data: {
      reference: `REQ-${requisitionTicket.sequence.toString().padStart(5, "0")}`
    }
  });

  console.log("Seed complete", {
    tenant,
    adminRole,
    teacherRole,
    parentRole,
    operationalRole,
    adminUser: { email: adminEmail, password: adminPassword }
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
