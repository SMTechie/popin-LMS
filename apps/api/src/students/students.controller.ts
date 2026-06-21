import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { PermissionGuard } from "../common/guards/permission.guard";
import { Permissions } from "../common/decorators/permissions.decorator";
import { AssignSubjectDto, BulkImportStudentsDto, CreateClassDto, CreateGradeDto, CreateStudentDto, CreateSubjectDto, CreateTeacherDto, LinkGuardianDto, MoveStudentDto, UpdateGuardianLinkDto, UpdateStudentDto } from "./dto";
import { StudentsService } from "./students.service";

@Controller("students")
@UseGuards(JwtAuthGuard, PermissionGuard)
export class StudentsController {
  constructor(private students: StudentsService) {}
  @Get() @Permissions({ module: "students", action: "student.view" })
  list(@Query("search") search?: string, @Query("status") status?: string, @Query("gradeId") gradeId?: string, @Query("classId") classId?: string) { return this.students.list(search, status, gradeId, classId); }
  @Get(":id") @Permissions({ module: "students", action: "student.view" }) get(@Param("id") id: string) { return this.students.get(id); }
  @Post() @Permissions({ module: "students", action: "student.manage" }) create(@Body() dto: CreateStudentDto, @Req() req: any) { return this.students.create(dto, req.user.id); }
  @Post("import") @Permissions({ module: "students", action: "student.import" }) bulk(@Body() dto: BulkImportStudentsDto, @Req() req: any) { return this.students.bulkImport(dto, req.user.id); }
  @Post("teachers") @Permissions({ module: "students", action: "teacher.manage" }) teacher(@Body() dto: CreateTeacherDto, @Req() req: any) { return this.students.createTeacher(dto, req.user.id); }
  @Post("grades") @Permissions({ module: "students", action: "student.manage" }) grade(@Body() dto: CreateGradeDto, @Req() req: any) { return this.students.createGrade(dto, req.user.id); }
  @Post("classes") @Permissions({ module: "students", action: "student.manage" }) schoolClass(@Body() dto: CreateClassDto, @Req() req: any) { return this.students.createClass(dto, req.user.id); }
  @Post("subjects") @Permissions({ module: "students", action: "student.manage" }) subject(@Body() dto: CreateSubjectDto, @Req() req: any) { return this.students.createSubject(dto, req.user.id); }
  @Post("classes/:id/subjects") @Permissions({ module: "students", action: "student.manage" }) assignSubject(@Param("id") id: string, @Body() dto: AssignSubjectDto, @Req() req: any) { return this.students.assignSubject(id, dto, req.user.id); }
  @Patch(":id") @Permissions({ module: "students", action: "student.manage" }) update(@Param("id") id: string, @Body() dto: UpdateStudentDto, @Req() req: any) { return this.students.update(id, dto, req.user.id); }
  @Patch(":id/archive") @Permissions({ module: "students", action: "student.manage" }) archive(@Param("id") id: string, @Req() req: any) { return this.students.archive(id, req.user.id); }
  @Post(":id/move") @Permissions({ module: "students", action: "student.manage" }) move(@Param("id") id: string, @Body() dto: MoveStudentDto, @Req() req: any) { return this.students.move(id, dto, req.user.id); }
  @Post(":id/guardians") @Permissions({ module: "students", action: "guardian.manage" }) link(@Param("id") id: string, @Body() dto: LinkGuardianDto, @Req() req: any) { return this.students.linkGuardian(id, dto, req.user.id); }
  @Patch("guardian-links/:id") @Permissions({ module: "students", action: "guardian.manage" }) permissions(@Param("id") id: string, @Body() dto: UpdateGuardianLinkDto, @Req() req: any) { return this.students.updateGuardian(id, dto, req.user.id); }
  @Delete("guardian-links/:id") @Permissions({ module: "students", action: "guardian.manage" }) unlink(@Param("id") id: string, @Req() req: any) { return this.students.unlinkGuardian(id, req.user.id); }
}
