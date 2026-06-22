import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { defaultOperationsData } from "../src/server/operations";
import { defaultPortalData } from "../src/server/portalData";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@school.co.za";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "Admin123!";
  const passwordHash = await bcrypt.hash(adminPassword, 10);
  const seededAt = new Date().toISOString();

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      name: "Sarah Khumalo",
      role: "ADMIN",
      passwordHash
    },
    create: {
      email: adminEmail,
      name: "Sarah Khumalo",
      role: "ADMIN",
      passwordHash
    }
  });

  await prisma.setting.upsert({
    where: { key: "branding" },
    update: {
      value: {
        schoolName: "POPIN Demo School",
        schoolMotto: "Connected school operations",
        primaryColor: "#0f172a",
        accentColor: "#2563eb",
        fontFamily: "Inter",
        email: adminEmail,
        phone: "+27 11 000 0000",
        website: "https://school.co.za",
        lastUpdatedAt: seededAt
      }
    },
    create: {
      key: "branding",
      value: {
        schoolName: "POPIN Demo School",
        schoolMotto: "Connected school operations",
        primaryColor: "#0f172a",
        accentColor: "#2563eb",
        fontFamily: "Inter",
        email: adminEmail,
        phone: "+27 11 000 0000",
        website: "https://school.co.za",
        lastUpdatedAt: seededAt
      }
    }
  });

  const systemSettings = [
    ["school-profile", { schoolName: "POPIN Demo School", emisNumber: "700400123", timezone: "Africa/Johannesburg", academicYear: 2026 }],
    ["users", { defaultRole: "Teacher", passwordExpiryDays: 90, archiveAlumni: true }],
    ["roles-permissions", { inheritPermissions: true, temporaryAccessHours: 8, requireApproval: true }],
    ["authentication", { mfaRequired: false, sessionTimeoutMinutes: 60, allowedDomains: "school.co.za,popin.school", ssoProvider: "None" }],
    ["email-services", { provider: "SMTP", fromAddress: adminEmail, rateLimitPerMinute: 60, retryFailures: true }],
    ["incoming-mail", { enabled: true, pollIntervalMinutes: 5, spamFiltering: true, attachmentProcessing: true }],
    ["admissions", { waitlists: true, interviews: true, documentVerification: true, placementTesting: false }],
    ["academic-settings", { termCount: 4, promotionMark: 50, curriculum: "CAPS" }],
    ["parent-portal", { homeworkVisible: true, feeVisibility: true, teacherMessaging: true, calendarSync: true }],
    ["student-portal", { assignmentSubmission: true, resultsVisibility: true, resourceDownloads: true }],
    ["timetable", { schoolDayStarts: "07:30", schoolDayEnds: "15:00", preventConflicts: true, allowSubstitutions: true }],
    ["attendance", { lateAfterMinutes: 10, notifyParents: true, gpsVerification: false, qrAttendance: true }],
    ["assessments", { gradingSystem: "Percentage", passMark: 50, moderationRequired: true, parentPublish: true }],
    ["communication", { defaultChannel: "Email", quietHoursStart: "20:00", approvalRequired: true }],
    ["uniform-store", { onlineOrdering: true, defaultCollection: "Uniform Room", returnWindowDays: 14, autoProcurement: true }],
    ["inventory", { lowStockAlerts: true, adjustmentApproval: true, barcodeFormat: "Code 128", valuationMethod: "Weighted average" }],
    ["supply-chain", { rfqThreshold: 10000, principalApprovalThreshold: 50000, minimumQuotes: 3, preferredSuppliers: true }],
    ["finance", { currency: "ZAR", vatRate: 15, budgetWarnings: true, restrictReportsForDebt: false }],
    ["licensing", { plan: "Enterprise", seatLimit: 250, storageGb: 100, expiryDate: "2027-06-30" }],
    ["integrations", { microsoft365: false, googleWorkspace: false, accountingProvider: "None", storageProvider: "Local" }],
    ["automation", { enabled: true, dailyTeacherDigest: true, monthlyInvoices: false, archiveAuditDays: 2555 }],
    ["workflow-rules", { admissionOnboarding: true, lowStockProcurement: true, feeEscalation: true }],
    ["notifications", { email: true, sms: false, push: true, whatsapp: false }],
    ["security", { securityScoreTarget: 80, trustedDevices: true, ipRestrictions: "", apiKeyRotationDays: 90 }],
    ["audit-logs", { retentionDays: 2555, captureDevice: true, exportEnabled: true }],
    ["backup-recovery", { schedule: "Daily", retentionCount: 30, provider: "Azure", encryption: true }],
    ["developer-api", { enabled: true, rateLimit: 120, webhookRetries: 5, requestLogging: true }]
  ] as const;

  for (const [key, value] of systemSettings) {
    await prisma.setting.upsert({
      where: { key },
      update: { value: { ...value, lastUpdatedAt: seededAt } },
      create: { key, value: { ...value, lastUpdatedAt: seededAt } }
    });
  }

  await prisma.setting.upsert({
    where: { key: "site" },
    update: {
      value: {
        heroTitle: "POPIN Demo School",
        heroSubtitle: "A connected operations layer for admissions, store, inventory and communication.",
        contactEmail: adminEmail,
        contactPhone: "+27 11 000 0000",
        campusCity: "Johannesburg",
        stats: [
          { label: "Applications", value: 156 },
          { label: "Open tickets", value: 23 },
          { label: "Low stock items", value: 5 }
        ]
      }
    },
    create: {
      key: "site",
      value: {
        heroTitle: "POPIN Demo School",
        heroSubtitle: "A connected operations layer for admissions, store, inventory and communication.",
        contactEmail: adminEmail,
        contactPhone: "+27 11 000 0000",
        campusCity: "Johannesburg",
        stats: [
          { label: "Applications", value: 156 },
          { label: "Open tickets", value: 23 },
          { label: "Low stock items", value: 5 }
        ]
      }
    }
  });

  await prisma.setting.upsert({
    where: { key: "marketing-integration" },
    update: {
      value: {
        websiteBaseUrl: "https://www.popin.school",
        webhookTargetUrl: "https://www.popin.school/api/popin/webhooks",
        publicApplyBaseUrl: "https://www.popin.school/apply",
        catalogEndpoint: "/api/public/site",
        callbackEndpoint: "/api/public/branding",
        syncMode: "api_pull",
        defaultCatalogVisibility: "universal",
        environment: "development",
        requestSigningMode: "hmac",
        requestTimeoutSeconds: 15,
        customHeaders: {
          "X-Source": "popin-lms"
        },
        retryPolicy: {
          attempts: 5,
          delays: [60, 300, 900]
        },
        shopApiEnabled: true,
        webhookEnabled: true,
        applicationFormApiEnabled: true,
        lastCatalogSyncAt: new Date().toISOString()
      }
    },
    create: {
      key: "marketing-integration",
      value: {
        websiteBaseUrl: "https://www.popin.school",
        webhookTargetUrl: "https://www.popin.school/api/popin/webhooks",
        publicApplyBaseUrl: "https://www.popin.school/apply",
        catalogEndpoint: "/api/public/site",
        callbackEndpoint: "/api/public/branding",
        syncMode: "api_pull",
        defaultCatalogVisibility: "universal",
        environment: "development",
        requestSigningMode: "hmac",
        requestTimeoutSeconds: 15,
        customHeaders: {
          "X-Source": "popin-lms"
        },
        retryPolicy: {
          attempts: 5,
          delays: [60, 300, 900]
        },
        shopApiEnabled: true,
        webhookEnabled: true,
        applicationFormApiEnabled: true,
        lastCatalogSyncAt: new Date().toISOString()
      }
    }
  });

  await prisma.setting.upsert({
    where: { key: "operations" },
    update: {
      value: defaultOperationsData()
    },
    create: {
      key: "operations",
      value: defaultOperationsData()
    }
  });

  await prisma.setting.upsert({
    where: { key: "portal-data" },
    update: {
      value: defaultPortalData()
    },
    create: {
      key: "portal-data",
      value: defaultPortalData()
    }
  });

  await prisma.auditLog.create({
    data: {
      action: "SEED",
      entity: "System",
      entityId: "bootstrap",
      actorId: adminEmail,
      metadata: {
        message: "Initial Neon seed completed"
      }
    }
  });

  console.log("Seed complete", {
    adminUser: {
      email: adminEmail,
      password: adminPassword
    }
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
