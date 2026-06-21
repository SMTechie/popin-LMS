export declare class CreateTeacherWorkItemDto {
    type: string;
    title: string;
    classId?: string;
    instructions?: string;
    dueAt?: string;
    visibleToParents?: boolean;
    attachments?: unknown[];
    curriculumOutcomes?: unknown[];
    linkedWorkItemId?: string;
}
export declare class UpdateTeacherWorkItemDto extends CreateTeacherWorkItemDto {
    status?: string;
}
export declare class AttendanceEntryDto {
    learnerId: string;
    status: string;
    note?: string;
    notifyParent?: boolean;
}
export declare class SubmitAttendanceDto {
    classId: string;
    registerDate: string;
    submit?: boolean;
    entries: AttendanceEntryDto[];
}
export declare class ReplyParentQueryDto {
    response: string;
    resolve?: boolean;
    escalate?: boolean;
}
export declare class CreateTimetableEntryDto {
    classId: string;
    subject: string;
    dayOfWeek: number;
    startsAt: string;
    endsAt: string;
    room?: string;
}
