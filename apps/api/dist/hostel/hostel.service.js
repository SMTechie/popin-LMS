"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HostelService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma.service");
const tenants_service_1 = require("../tenants/tenants.service");
const audit_service_1 = require("../audit/audit.service");
const activeAllocation = ["RESERVED", "CHECKED_IN"];
let HostelService = class HostelService {
    prisma;
    tenants;
    audit;
    constructor(prisma, tenants, audit) {
        this.prisma = prisma;
        this.tenants = tenants;
        this.audit = audit;
    }
    async tenantId() { return (await this.tenants.getDefaultTenant()).id; }
    required(value, label) { if (value === undefined || value === null || value === "")
        throw new common_1.BadRequestException(`${label} is required`); }
    async dashboard() {
        const tenantId = await this.tenantId();
        const week = new Date();
        week.setDate(week.getDate() - 7);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const [capacity, occupied, pending, waiting, checkIns, checkOuts, incidents, maintenance, meals, charges] = await Promise.all([
            this.prisma.hostelBed.count({ where: { tenantId } }),
            this.prisma.hostelAllocation.count({ where: { tenantId, status: "CHECKED_IN" } }),
            this.prisma.hostelApplication.count({ where: { tenantId, status: { in: ["SUBMITTED", "UNDER_REVIEW"] } } }),
            this.prisma.hostelApplication.count({ where: { tenantId, status: "WAITLISTED" } }),
            this.prisma.hostelAllocation.count({ where: { tenantId, checkedInAt: { gte: today } } }),
            this.prisma.hostelAllocation.count({ where: { tenantId, checkedOutAt: { gte: today } } }),
            this.prisma.hostelIncident.count({ where: { tenantId, occurredAt: { gte: week } } }),
            this.prisma.hostelMaintenanceRequest.count({ where: { tenantId, status: { in: ["OPEN", "ASSIGNED", "IN_PROGRESS"] } } }),
            this.prisma.hostelMealRegister.aggregate({ where: { tenantId, mealDate: { gte: today } }, _sum: { servedCount: true } }),
            this.prisma.hostelCharge.aggregate({ where: { tenantId, status: { in: ["DUE", "PARTIAL", "OVERDUE"] } }, _sum: { amount: true, paidAmount: true } })
        ]);
        return { capacity, occupied, available: Math.max(0, capacity - occupied), pendingApplications: pending, waitingList: waiting, checkIns, checkOuts, incidentsThisWeek: incidents, openMaintenance: maintenance, mealAttendance: meals._sum.servedCount || 0, outstandingFees: (charges._sum.amount || 0) - (charges._sum.paidAmount || 0) };
    }
    async overview() {
        const tenantId = await this.tenantId();
        const [buildings, applications, allocations, learners, rollCalls, meals, incidents, maintenance, visitors, charges, notices] = await Promise.all([
            this.prisma.hostelBuilding.findMany({ where: { tenantId }, include: { blocks: { include: { rooms: { include: { beds: true } } } } }, orderBy: { name: "asc" } }),
            this.prisma.hostelApplication.findMany({ where: { tenantId }, include: { learner: true, preferredBuilding: true }, orderBy: { submittedAt: "desc" }, take: 100 }),
            this.prisma.hostelAllocation.findMany({ where: { tenantId }, include: { learner: true, bed: { include: { room: { include: { block: { include: { building: true } } } } } } }, orderBy: { createdAt: "desc" }, take: 150 }),
            this.prisma.learnerProfile.findMany({ where: { tenantId, status: "ACTIVE" }, orderBy: [{ lastName: "asc" }, { firstName: "asc" }] }),
            this.prisma.hostelRollCall.findMany({ where: { tenantId }, include: { entries: true }, orderBy: { rollDate: "desc" }, take: 30 }),
            this.prisma.hostelMealRegister.findMany({ where: { tenantId }, include: { entries: true }, orderBy: { mealDate: "desc" }, take: 30 }),
            this.prisma.hostelIncident.findMany({ where: { tenantId }, orderBy: { occurredAt: "desc" }, take: 100 }),
            this.prisma.hostelMaintenanceRequest.findMany({ where: { tenantId }, orderBy: { createdAt: "desc" }, take: 100 }),
            this.prisma.hostelVisitorLog.findMany({ where: { tenantId }, orderBy: { checkedInAt: "desc" }, take: 100 }),
            this.prisma.hostelCharge.findMany({ where: { tenantId }, include: { learner: true }, orderBy: { dueDate: "desc" }, take: 100 }),
            this.prisma.hostelNotice.findMany({ where: { tenantId }, orderBy: { publishedAt: "desc" }, take: 50 })
        ]);
        return { buildings, applications, allocations, learners, rollCalls, meals, incidents, maintenance, visitors, charges, notices };
    }
    async createBuilding(body, actorId) {
        this.required(body.name, "Name");
        this.required(body.code, "Code");
        const tenantId = await this.tenantId();
        const item = await this.prisma.hostelBuilding.create({ data: { tenantId, name: body.name, code: String(body.code).toUpperCase(), genderPolicy: body.genderPolicy || "MIXED", address: body.address || null, wardenId: body.wardenId || null } });
        await this.audit.log({ actorId, action: "hostel.building.create", entity: "HostelBuilding", entityId: item.id });
        return item;
    }
    async createBlock(body, actorId) {
        this.required(body.buildingId, "Building");
        this.required(body.name, "Name");
        const tenantId = await this.tenantId();
        const item = await this.prisma.hostelBlock.create({ data: { tenantId, buildingId: body.buildingId, name: body.name, code: String(body.code || body.name).toUpperCase(), houseParentId: body.houseParentId || null } });
        await this.audit.log({ actorId, action: "hostel.block.create", entity: "HostelBlock", entityId: item.id });
        return item;
    }
    async createRoom(body, actorId) {
        this.required(body.blockId, "Block");
        this.required(body.roomNumber, "Room number");
        const tenantId = await this.tenantId();
        const capacity = Number(body.capacity || 1);
        if (capacity < 1 || capacity > 50)
            throw new common_1.BadRequestException("Capacity must be between 1 and 50");
        const item = await this.prisma.hostelRoom.create({ data: { tenantId, blockId: body.blockId, roomNumber: String(body.roomNumber), name: body.name || null, floor: body.floor || null, roomType: body.roomType || "STANDARD", genderPolicy: body.genderPolicy || "MIXED", gradeGroup: body.gradeGroup || null, capacity, monthlyFee: Number(body.monthlyFee || 0), notes: body.notes || null, beds: { create: Array.from({ length: capacity }, (_, index) => ({ tenantId, label: body.bedLabels?.[index] || `Bed ${index + 1}` })) } }, include: { beds: true } });
        await this.audit.log({ actorId, action: "hostel.room.create", entity: "HostelRoom", entityId: item.id, data: { capacity } });
        return item;
    }
    async decideApplication(id, body, actorId) {
        const status = String(body.status || "");
        if (!["UNDER_REVIEW", "APPROVED", "WAITLISTED", "REJECTED", "WITHDRAWN"].includes(status))
            throw new common_1.BadRequestException("Invalid application status");
        const item = await this.prisma.hostelApplication.update({ where: { id }, data: { status, priority: Number(body.priority || 0), decisionNotes: body.decisionNotes || null, decidedById: actorId, decidedAt: ["APPROVED", "WAITLISTED", "REJECTED"].includes(status) ? new Date() : null } });
        await this.audit.log({ actorId, action: `hostel.application.${status.toLowerCase()}`, entity: "HostelApplication", entityId: id });
        return item;
    }
    async allocate(body, actorId) {
        this.required(body.learnerId, "Learner");
        this.required(body.bedId, "Bed");
        const tenantId = await this.tenantId();
        return this.prisma.$transaction(async (tx) => {
            const [bed, existing] = await Promise.all([tx.hostelBed.findFirst({ where: { id: body.bedId, tenantId } }), tx.hostelAllocation.findFirst({ where: { tenantId, learnerId: body.learnerId, status: { in: activeAllocation } } })]);
            if (!bed || bed.status !== "AVAILABLE")
                throw new common_1.BadRequestException("Selected bed is not available");
            if (existing)
                throw new common_1.BadRequestException("Learner already has an active hostel allocation");
            const item = await tx.hostelAllocation.create({ data: { tenantId, learnerId: body.learnerId, bedId: body.bedId, applicationId: body.applicationId || null, startDate: body.startDate ? new Date(body.startDate) : new Date(), expectedEndDate: body.expectedEndDate ? new Date(body.expectedEndDate) : null, createdById: actorId } });
            await tx.hostelBed.update({ where: { id: body.bedId }, data: { status: "RESERVED" } });
            if (body.applicationId)
                await tx.hostelApplication.update({ where: { id: body.applicationId }, data: { status: "ALLOCATED" } });
            return item;
        }).then(async (item) => { await this.audit.log({ actorId, action: "hostel.allocation.create", entity: "HostelAllocation", entityId: item.id }); return item; });
    }
    async checkIn(id, actorId) { return this.changeAllocation(id, "CHECKED_IN", actorId); }
    async changeAllocation(id, status, actorId, reason) {
        const current = await this.prisma.hostelAllocation.findUnique({ where: { id } });
        if (!current)
            throw new common_1.NotFoundException("Allocation not found");
        const result = await this.prisma.$transaction([this.prisma.hostelAllocation.update({ where: { id }, data: status === "CHECKED_IN" ? { status, checkedInAt: new Date(), checkedInById: actorId } : { status, checkedOutAt: new Date(), checkedOutById: actorId, checkoutReason: reason || null } }), this.prisma.hostelBed.update({ where: { id: current.bedId }, data: { status: status === "CHECKED_IN" ? "OCCUPIED" : "AVAILABLE" } })]);
        await this.audit.log({ actorId, action: `hostel.allocation.${status.toLowerCase()}`, entity: "HostelAllocation", entityId: id });
        return result[0];
    }
    async checkOut(id, body, actorId) { return this.changeAllocation(id, "CHECKED_OUT", actorId, body.reason); }
    async transfer(id, body, actorId) {
        this.required(body.bedId, "New bed");
        const current = await this.prisma.hostelAllocation.findUnique({ where: { id } });
        if (!current || !activeAllocation.includes(current.status))
            throw new common_1.BadRequestException("Only active allocations can be transferred");
        const tenantId = await this.tenantId();
        const bed = await this.prisma.hostelBed.findFirst({ where: { id: body.bedId, tenantId, status: "AVAILABLE" } });
        if (!bed)
            throw new common_1.BadRequestException("New bed is not available");
        const item = await this.prisma.$transaction(async (tx) => { await tx.hostelAllocation.update({ where: { id }, data: { status: "TRANSFERRED", checkedOutAt: new Date(), checkedOutById: actorId, checkoutReason: body.reason || "Room transfer" } }); await tx.hostelBed.update({ where: { id: current.bedId }, data: { status: "AVAILABLE" } }); await tx.hostelBed.update({ where: { id: body.bedId }, data: { status: current.status === "CHECKED_IN" ? "OCCUPIED" : "RESERVED" } }); return tx.hostelAllocation.create({ data: { tenantId, learnerId: current.learnerId, bedId: body.bedId, applicationId: current.applicationId, status: current.status, startDate: new Date(), expectedEndDate: current.expectedEndDate, checkedInAt: current.status === "CHECKED_IN" ? new Date() : null, checkedInById: current.status === "CHECKED_IN" ? actorId : null, createdById: actorId } }); });
        await this.audit.log({ actorId, action: "hostel.allocation.transfer", entity: "HostelAllocation", entityId: item.id, data: { fromAllocationId: id, fromBedId: current.bedId, toBedId: body.bedId, reason: body.reason } });
        return item;
    }
    async saveRollCall(body, actorId) { const tenantId = await this.tenantId(); const rollDate = new Date(body.rollDate || new Date()); rollDate.setHours(0, 0, 0, 0); return this.prisma.hostelRollCall.create({ data: { tenantId, buildingId: body.buildingId || null, rollDate, session: body.session || "EVENING", status: body.status || "SUBMITTED", createdById: actorId, submittedAt: new Date(), entries: { create: (body.entries || []).map((e) => ({ learnerId: e.learnerId, status: e.status || "PRESENT", note: e.note || null, notifyParent: !!e.notifyParent })) } }, include: { entries: true } }); }
    async saveMeal(body, actorId) { const tenantId = await this.tenantId(); const entries = body.entries || []; return this.prisma.hostelMealRegister.create({ data: { tenantId, buildingId: body.buildingId || null, mealDate: new Date(body.mealDate || new Date()), mealType: body.mealType || "DINNER", plannedCount: Number(body.plannedCount || entries.length), servedCount: entries.filter((e) => e.attended !== false).length || Number(body.servedCount || 0), notes: body.notes || null, createdById: actorId, entries: { create: entries.map((e) => ({ learnerId: e.learnerId, attended: e.attended !== false, dietaryNote: e.dietaryNote || null })) } }, include: { entries: true } }); }
    async createIncident(body, actorId) { this.required(body.title, "Title"); const tenantId = await this.tenantId(); const item = await this.prisma.hostelIncident.create({ data: { tenantId, learnerId: body.learnerId || null, buildingId: body.buildingId || null, roomId: body.roomId || null, category: body.category || "GENERAL", severity: body.severity || "MEDIUM", title: body.title, description: body.description || "", occurredAt: new Date(body.occurredAt || new Date()), reportedById: actorId } }); await this.audit.log({ actorId, action: "hostel.incident.create", entity: "HostelIncident", entityId: item.id }); return item; }
    async updateIncident(id, body, actorId) { const item = await this.prisma.hostelIncident.update({ where: { id }, data: { status: body.status, actionTaken: body.actionTaken, resolvedAt: body.status === "RESOLVED" ? new Date() : undefined, resolvedById: body.status === "RESOLVED" ? actorId : undefined, guardianNotifiedAt: body.guardianNotified ? new Date() : undefined } }); await this.audit.log({ actorId, action: "hostel.incident.update", entity: "HostelIncident", entityId: id }); return item; }
    async createMaintenance(body, actorId, source = "STAFF", learnerId) { this.required(body.title, "Title"); const tenantId = await this.tenantId(); const item = await this.prisma.hostelMaintenanceRequest.create({ data: { tenantId, buildingId: body.buildingId || null, blockId: body.blockId || null, roomId: body.roomId || null, bedId: body.bedId || null, learnerId: learnerId || body.learnerId || null, submittedById: actorId, source, category: body.category || "GENERAL", priority: body.priority || "MEDIUM", title: body.title, description: body.description || "", attachments: body.attachments || undefined } }); await this.audit.log({ actorId, action: "hostel.maintenance.create", entity: "HostelMaintenanceRequest", entityId: item.id }); return item; }
    async updateMaintenance(id, body, actorId) { const item = await this.prisma.hostelMaintenanceRequest.update({ where: { id }, data: { status: body.status, assignedToId: body.assignedToId, resolution: body.resolution, cost: body.cost === undefined ? undefined : Number(body.cost), resolvedAt: ["RESOLVED", "CLOSED"].includes(body.status) ? new Date() : undefined } }); await this.audit.log({ actorId, action: "hostel.maintenance.update", entity: "HostelMaintenanceRequest", entityId: id }); return item; }
    async checkVisitorIn(body, actorId) { this.required(body.learnerId, "Learner"); this.required(body.visitorName, "Visitor name"); const tenantId = await this.tenantId(); return this.prisma.hostelVisitorLog.create({ data: { tenantId, learnerId: body.learnerId, visitorName: body.visitorName, identityNumber: body.identityNumber || null, phone: body.phone || null, relationship: body.relationship || null, purpose: body.purpose || "Visit", vehicleRegistration: body.vehicleRegistration || null, expectedCheckoutAt: body.expectedCheckoutAt ? new Date(body.expectedCheckoutAt) : null, checkedInById: actorId } }); }
    async checkVisitorOut(id, actorId) { return this.prisma.hostelVisitorLog.update({ where: { id }, data: { status: "CHECKED_OUT", checkedOutAt: new Date(), checkedOutById: actorId } }); }
    async createCharge(body, actorId) { this.required(body.learnerId, "Learner"); this.required(body.amount, "Amount"); const tenantId = await this.tenantId(); const item = await this.prisma.hostelCharge.create({ data: { tenantId, learnerId: body.learnerId, allocationId: body.allocationId || null, description: body.description || "Hostel fee", billingPeriod: body.billingPeriod || null, amount: Number(body.amount), dueDate: new Date(body.dueDate || new Date()), createdById: actorId } }); await this.audit.log({ actorId, action: "hostel.charge.create", entity: "HostelCharge", entityId: item.id }); return item; }
    async updateCharge(id, body, actorId) { const paidAmount = Number(body.paidAmount || 0); const current = await this.prisma.hostelCharge.findUnique({ where: { id } }); if (!current)
        throw new common_1.NotFoundException("Charge not found"); const status = body.status || (paidAmount >= current.amount ? "PAID" : paidAmount > 0 ? "PARTIAL" : current.status); const item = await this.prisma.hostelCharge.update({ where: { id }, data: { paidAmount, status } }); await this.audit.log({ actorId, action: "hostel.charge.update", entity: "HostelCharge", entityId: id }); return item; }
    async createNotice(body, actorId) { this.required(body.title, "Title"); this.required(body.message, "Message"); const tenantId = await this.tenantId(); const item = await this.prisma.hostelNotice.create({ data: { tenantId, buildingId: body.buildingId || null, learnerId: body.learnerId || null, title: body.title, message: body.message, channels: body.channels || ["IN_APP"], visibleToParents: body.visibleToParents !== false, createdById: actorId } }); await this.audit.log({ actorId, action: "hostel.notice.publish", entity: "HostelNotice", entityId: item.id, data: { channels: body.channels || ["IN_APP"] } }); return item; }
    async reports() { const tenantId = await this.tenantId(); const [dashboard, buildings, incidents, charges, meals] = await Promise.all([this.dashboard(), this.prisma.hostelBuilding.findMany({ where: { tenantId }, include: { blocks: { include: { rooms: { include: { beds: { include: { allocations: { where: { status: { in: activeAllocation } } } } } } } } } } }), this.prisma.hostelIncident.groupBy({ by: ["severity", "status"], where: { tenantId }, _count: true }), this.prisma.hostelCharge.groupBy({ by: ["status"], where: { tenantId }, _sum: { amount: true, paidAmount: true }, _count: true }), this.prisma.hostelMealRegister.aggregate({ where: { tenantId }, _sum: { plannedCount: true, servedCount: true } })]); return { dashboard, occupancyByBuilding: buildings.map(b => ({ id: b.id, name: b.name, capacity: b.blocks.reduce((n, x) => n + x.rooms.reduce((r, room) => r + room.beds.length, 0), 0), occupied: b.blocks.reduce((n, x) => n + x.rooms.reduce((r, room) => r + room.beds.filter(bed => bed.allocations.length).length, 0), 0) })), incidents, billing: charges, meals: meals._sum }; }
    async parentView(parentUserId, learnerId, permissions) {
        const tenantId = await this.tenantId();
        const allocation = await this.prisma.hostelAllocation.findFirst({ where: { tenantId, learnerId, status: { in: activeAllocation } }, include: { bed: { include: { room: { include: { block: { include: { building: true } } } } } } } });
        const [application, history, charges, notices] = await Promise.all([
            this.prisma.hostelApplication.findFirst({ where: { tenantId, learnerId }, include: { preferredBuilding: true }, orderBy: { submittedAt: "desc" } }),
            permissions.viewHostelMovement ? this.prisma.hostelAllocation.findMany({ where: { tenantId, learnerId }, orderBy: { createdAt: "desc" } }) : [],
            permissions.viewHostelBilling ? this.prisma.hostelCharge.findMany({ where: { tenantId, learnerId }, orderBy: { dueDate: "desc" } }) : [],
            this.prisma.hostelNotice.findMany({ where: { tenantId, visibleToParents: true, OR: [{ learnerId }, { learnerId: null }, ...(allocation ? [{ buildingId: allocation.bed.room.block.buildingId }] : [])] }, orderBy: { publishedAt: "desc" }, take: 30 })
        ]);
        return { application, allocation, movementHistory: history, charges, notices };
    }
    async parentApply(parentUserId, learnerId, body) { const tenantId = await this.tenantId(); const year = Number(body.academicYear || new Date().getFullYear()); const existing = await this.prisma.hostelApplication.findFirst({ where: { tenantId, learnerId, academicYear: year, status: { in: ["SUBMITTED", "UNDER_REVIEW", "APPROVED", "WAITLISTED", "ALLOCATED"] } } }); if (existing)
        throw new common_1.BadRequestException("An active hostel application already exists for this learner and year"); const item = await this.prisma.hostelApplication.create({ data: { tenantId, learnerId, parentUserId, academicYear: year, term: body.term || null, preferredBuildingId: body.preferredBuildingId || null, reason: body.reason || null, medicalRequirements: body.medicalRequirements || null, dietaryRequirements: body.dietaryRequirements || null } }); await this.audit.log({ actorId: parentUserId, action: "hostel.application.submit", entity: "HostelApplication", entityId: item.id, data: { learnerId } }); return item; }
};
exports.HostelService = HostelService;
exports.HostelService = HostelService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, tenants_service_1.TenantsService, audit_service_1.AuditService])
], HostelService);
//# sourceMappingURL=hostel.service.js.map