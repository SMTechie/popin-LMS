import React, { useEffect, useMemo, useState } from 'react';
import {
  BookOpen, CalendarDays, CheckCircle2, ClipboardCheck, FileText, GraduationCap,
  Megaphone, MessageSquare, PackagePlus, Plus, RefreshCw, Users, ScanText
} from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import Modal from '../components/Modal';
import { apiRequest } from '../lib/api';
import TeacherAssistant from '../components/TeacherAssistant';

type Tab = 'workbench' | 'classes' | 'homework' | 'plans' | 'attendance' | 'assessments' | 'assistant' | 'communication' | 'requisitions' | 'profile';
const fieldClass = 'w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10';

export default function TeacherPortal() {
  const [tab, setTab] = useState<Tab>('workbench');
  const [dashboard, setDashboard] = useState<any>(null);
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showWork, setShowWork] = useState(false);
  const [work, setWork] = useState({ type: 'HOMEWORK', title: '', classId: '', instructions: '', dueAt: '', visibleToParents: true });
  const [attendanceClass, setAttendanceClass] = useState<any>(null);
  const [attendance, setAttendance] = useState<Record<string, { status: string; note: string; notifyParent: boolean }>>({});

  const load = async () => {
    setLoading(true); setError('');
    try {
      const [summary, classData] = await Promise.all([apiRequest('/teacher/dashboard'), apiRequest<any[]>('/teacher/classes')]);
      setDashboard(summary); setClasses(classData);
    } catch (err: any) { setError(err.message || 'Unable to load your teacher workspace.'); }
    finally { setLoading(false); }
  };
  useEffect(() => { void load(); }, []);

  const allWork = useMemo(() => classes.flatMap((item) => item.workItems || []), [classes]);
  const workByType = (type: string) => allWork.filter((item) => item.type === type);

  const createWork = async () => {
    try {
      await apiRequest('/teacher/work-items', { method: 'POST', body: JSON.stringify({ ...work, classId: work.classId || undefined, dueAt: work.dueAt || undefined, status: work.visibleToParents ? 'PUBLISHED' : 'DRAFT' }) });
      setShowWork(false); setWork({ type: 'HOMEWORK', title: '', classId: '', instructions: '', dueAt: '', visibleToParents: true }); await load();
    } catch (err: any) { setError(err.message); }
  };

  const openAttendance = (schoolClass: any) => {
    setAttendanceClass(schoolClass);
    setAttendance(Object.fromEntries((schoolClass.learners || []).map((learner: any) => [learner.id, { status: 'PRESENT', note: '', notifyParent: false }])));
  };
  const saveAttendance = async (submit: boolean) => {
    if (!attendanceClass) return;
    try {
      await apiRequest('/teacher/attendance', { method: 'POST', body: JSON.stringify({ classId: attendanceClass.id, registerDate: new Date().toISOString(), submit, entries: Object.entries(attendance).map(([learnerId, value]) => ({ learnerId, ...value })) }) });
      setAttendanceClass(null); await load();
    } catch (err: any) { setError(err.message); }
  };

  const tabs: Array<{ id: Tab; label: string; icon: any }> = [
    { id: 'workbench', label: 'Today', icon: CalendarDays }, { id: 'classes', label: 'My Classes', icon: Users },
    { id: 'homework', label: 'Homework', icon: BookOpen }, { id: 'plans', label: 'Lesson Plans', icon: FileText },
    { id: 'attendance', label: 'Attendance', icon: ClipboardCheck }, { id: 'assessments', label: 'Assessments', icon: GraduationCap },
    { id: 'assistant', label: 'Teacher Assistant', icon: ScanText },
    { id: 'communication', label: 'Parent Communication', icon: MessageSquare }, { id: 'requisitions', label: 'Requisitions', icon: PackagePlus },
    { id: 'profile', label: 'My Profile', icon: CheckCircle2 }
  ];

  return <DashboardLayout title="Teacher Portal">
    <div className="space-y-6">
      <div className="rounded-2xl bg-gradient-to-r from-indigo-950 via-blue-900 to-cyan-700 p-6 text-white shadow-lg">
        <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[.24em] text-cyan-200">Daily classroom workbench</p><h2 className="mt-1 text-2xl font-bold">Good day, Teacher</h2><p className="mt-1 text-sm text-blue-100">Your next class, learner work, parent replies, and school requests—in one place.</p></div><button onClick={() => void load()} className="rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/20"><RefreshCw className="mr-2 inline h-4 w-4" />Refresh</button></div>
      </div>
      {error && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
      <div className="flex gap-2 overflow-x-auto rounded-xl border border-gray-200 bg-white p-2">{tabs.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => setTab(id)} className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold ${tab === id ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}><Icon className="h-4 w-4" />{label}</button>)}</div>
      {loading && <div className="rounded-xl border border-gray-200 bg-white p-10 text-center text-sm text-gray-500">Preparing your classroom workspace…</div>}

      {!loading && tab === 'workbench' && <>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5"><Metric label="Today’s classes" value={dashboard?.today?.length || 0} tone="blue" /><Metric label="Homework due" value={dashboard?.homeworkDueToday?.length || 0} tone="amber" /><Metric label="Parent replies" value={dashboard?.parentQueries?.length || 0} tone="rose" /><Metric label="Attendance tasks" value={dashboard?.attendanceTasks?.length || 0} tone="emerald" /><button onClick={() => setTab('assistant')} className="text-left"><Metric label="Assistant review" value={(dashboard?.teacherAssistant?.readyForReview || 0) + (dashboard?.teacherAssistant?.needsAttention || 0)} tone="blue" /></button></div>
        <div className="grid gap-5 xl:grid-cols-3"><Panel title="Today’s timetable" className="xl:col-span-2">{dashboard?.today?.length ? dashboard.today.map((entry: any) => <div key={entry.id} className="flex items-center gap-4 border-b border-gray-100 py-3 last:border-0"><div className="rounded-lg bg-blue-50 px-3 py-2 text-center text-xs font-bold text-blue-700">{entry.startsAt}<br />{entry.endsAt}</div><div><p className="text-sm font-bold">{entry.subject} · {entry.class?.name}</p><p className="text-xs text-gray-500">{entry.room || entry.class?.room || 'Room not set'}</p></div></div>) : <Empty text="No classes scheduled today." />}</Panel><Panel title="Needs attention"><Attention label="Incomplete lesson plans" value={dashboard?.lessonPlansIncomplete?.length || 0} /><Attention label="Parent queries" value={dashboard?.parentQueries?.length || 0} /><Attention label="Requisitions waiting" value={dashboard?.requisitions?.filter((item: any) => !['DELIVERED', 'CLOSED'].includes(item.status)).length || 0} /><Attention label="Attendance registers" value={dashboard?.attendanceTasks?.length || 0} /></Panel></div>
        <div className="grid gap-5 lg:grid-cols-2"><Panel title="Class announcements">{dashboard?.announcements?.length ? dashboard.announcements.map((item: any) => <WorkRow key={item.id} item={item} />) : <Empty text="No announcements yet." />}</Panel><Panel title="Quick actions"><div className="grid grid-cols-2 gap-3"><Quick label="Create homework" icon={BookOpen} onClick={() => { setWork((v) => ({ ...v, type: 'HOMEWORK' })); setShowWork(true); }} /><Quick label="Plan a lesson" icon={FileText} onClick={() => { setWork((v) => ({ ...v, type: 'LESSON_PLAN' })); setShowWork(true); }} /><Quick label="Post announcement" icon={Megaphone} onClick={() => { setWork((v) => ({ ...v, type: 'ANNOUNCEMENT' })); setShowWork(true); }} /><Quick label="Request supplies" icon={PackagePlus} onClick={() => window.location.assign('/requisitions/new')} /></div></Panel></div>
      </>}

      {!loading && tab === 'classes' && <div className="grid gap-5 lg:grid-cols-2">{classes.map((schoolClass) => <div key={schoolClass.id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"><div className="flex justify-between"><div><p className="text-xs font-semibold uppercase text-blue-600">{schoolClass.grade?.name}</p><h3 className="text-xl font-bold">{schoolClass.name}</h3><p className="text-sm text-gray-500">{schoolClass.assignments.map((item: any) => item.subject).join(', ')} · Room {schoolClass.room}</p></div><span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">{schoolClass.learners.length} learners</span></div><div className="mt-4 grid grid-cols-2 gap-2 text-xs"><Info label="Timetable" value={`${schoolClass.timetable.length} periods`} /><Info label="Homework" value={`${schoolClass.workItems.filter((i: any) => i.type === 'HOMEWORK').length} tasks`} /><Info label="Assessments" value={`${schoolClass.workItems.filter((i: any) => i.type === 'ASSESSMENT').length} items`} /><Info label="Documents" value={`${schoolClass.workItems.filter((i: any) => i.attachments?.length).length} linked`} /></div><div className="mt-4 flex gap-2"><button onClick={() => openAttendance(schoolClass)} className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white">Mark attendance</button><button onClick={() => { setWork((v) => ({ ...v, classId: schoolClass.id })); setShowWork(true); }} className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold">Create class item</button></div></div>)}</div>}

      {!loading && ['homework', 'plans', 'assessments'].includes(tab) && <WorkList title={tab === 'homework' ? 'Homework & Assignments' : tab === 'plans' ? 'Lesson Plans' : 'Assessments'} items={workByType(tab === 'homework' ? 'HOMEWORK' : tab === 'plans' ? 'LESSON_PLAN' : 'ASSESSMENT')} onCreate={() => { setWork((v) => ({ ...v, type: tab === 'homework' ? 'HOMEWORK' : tab === 'plans' ? 'LESSON_PLAN' : 'ASSESSMENT' })); setShowWork(true); }} />}

      {!loading && tab === 'assistant' && <TeacherAssistant classes={classes} />}

      {!loading && tab === 'attendance' && <Panel title="Class registers"><div className="grid gap-3 md:grid-cols-2">{classes.map((schoolClass) => <button key={schoolClass.id} onClick={() => openAttendance(schoolClass)} className="rounded-xl border border-gray-200 p-4 text-left hover:border-blue-300"><p className="font-bold">{schoolClass.name}</p><p className="text-xs text-gray-500">{schoolClass.learners.length} learners · Mark today’s register</p></button>)}</div></Panel>}

      {!loading && tab === 'communication' && <Panel title="Parent questions"><p className="mb-4 text-xs text-gray-500">Only conversations linked to learners in your assigned classes appear here.</p>{dashboard?.parentQueries?.length ? dashboard.parentQueries.map((query: any) => <div key={query.id} className="rounded-xl border border-gray-100 p-4"><div className="flex justify-between"><b className="text-sm">{query.subject}</b><span className="text-xs text-amber-600">{query.status}</span></div><p className="mt-2 text-sm text-gray-600">{query.message}</p></div>) : <Empty text="No parent questions are waiting." />}</Panel>}

      {!loading && tab === 'requisitions' && <Panel title="My requisitions"><div className="mb-4 flex justify-end"><button onClick={() => window.location.assign('/requisitions/new')} className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white"><Plus className="mr-1 inline h-4 w-4" />New requisition</button></div>{dashboard?.requisitions?.length ? dashboard.requisitions.map((item: any) => <div key={item.id} className="flex justify-between border-b border-gray-100 py-3"><div><p className="text-sm font-bold">{item.title}</p><p className="text-xs text-gray-500">{item.reference}</p></div><span className="text-xs font-semibold text-blue-600">{item.status}</span></div>) : <Empty text="You have not submitted any requisitions." />}</Panel>}

      {!loading && tab === 'profile' && <Panel title="Teacher profile"><div className="grid gap-4 md:grid-cols-3"><Info label="Assigned classes" value={String(classes.length)} /><Info label="Subjects taught" value={String(new Set(classes.flatMap((c) => c.assignments.map((a: any) => a.subject))).size)} /><Info label="Weekly periods" value={String(classes.reduce((sum, c) => sum + c.timetable.length, 0))} /></div><p className="mt-5 text-sm text-gray-500">Contact details, qualifications, documents, and notification preferences are managed through Administration Centre → Users.</p></Panel>}
    </div>

    <Modal title={`Create ${work.type.toLowerCase().replace('_', ' ')}`} isOpen={showWork} onClose={() => setShowWork(false)}><div className="space-y-4"><Field label="Type"><select className={fieldClass} value={work.type} onChange={(e) => setWork({ ...work, type: e.target.value })}>{['HOMEWORK', 'LESSON_PLAN', 'ANNOUNCEMENT', 'ASSESSMENT'].map((type) => <option key={type}>{type}</option>)}</select></Field><Field label="Class"><select className={fieldClass} value={work.classId} onChange={(e) => setWork({ ...work, classId: e.target.value })}><option value="">All my classes</option>{classes.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></Field><Field label="Title"><input className={fieldClass} value={work.title} onChange={(e) => setWork({ ...work, title: e.target.value })} /></Field><Field label="Instructions / content"><textarea rows={5} className={fieldClass} value={work.instructions} onChange={(e) => setWork({ ...work, instructions: e.target.value })} /></Field><Field label="Due date"><input type="datetime-local" className={fieldClass} value={work.dueAt} onChange={(e) => setWork({ ...work, dueAt: e.target.value })} /></Field><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={work.visibleToParents} onChange={(e) => setWork({ ...work, visibleToParents: e.target.checked })} />Visible to parents</label><button onClick={() => void createWork()} className="w-full rounded-lg bg-blue-600 py-3 text-sm font-bold text-white">Create item</button></div></Modal>

    <Modal title={`Attendance · ${attendanceClass?.name || ''}`} isOpen={!!attendanceClass} onClose={() => setAttendanceClass(null)}><div className="max-h-[68vh] space-y-3 overflow-y-auto">{attendanceClass?.learners.map((learner: any) => <div key={learner.id} className="rounded-lg border border-gray-100 p-3"><p className="mb-2 text-sm font-bold">{learner.firstName} {learner.lastName}</p><div className="grid grid-cols-2 gap-2"><select className={fieldClass} value={attendance[learner.id]?.status} onChange={(e) => setAttendance({ ...attendance, [learner.id]: { ...attendance[learner.id], status: e.target.value } })}>{['PRESENT', 'ABSENT', 'LATE', 'EXCUSED'].map((status) => <option key={status}>{status}</option>)}</select><input className={fieldClass} placeholder="Note" value={attendance[learner.id]?.note || ''} onChange={(e) => setAttendance({ ...attendance, [learner.id]: { ...attendance[learner.id], note: e.target.value } })} /></div></div>)}<div className="flex gap-2"><button onClick={() => void saveAttendance(false)} className="flex-1 rounded-lg border border-gray-200 py-2 text-sm font-bold">Save draft</button><button onClick={() => void saveAttendance(true)} className="flex-1 rounded-lg bg-blue-600 py-2 text-sm font-bold text-white">Submit register</button></div></div></Modal>
  </DashboardLayout>;
}

function Metric({ label, value, tone }: { label: string; value: number; tone: string }) { const tones: any = { blue: 'bg-blue-50 text-blue-700', amber: 'bg-amber-50 text-amber-700', rose: 'bg-rose-50 text-rose-700', emerald: 'bg-emerald-50 text-emerald-700' }; return <div className="rounded-xl border border-gray-200 bg-white p-4"><p className="text-xs font-semibold text-gray-500">{label}</p><p className={`mt-3 inline-flex rounded-lg px-3 py-1 text-2xl font-bold ${tones[tone]}`}>{value}</p></div>; }
function Panel({ title, children, className = '' }: { title: string; children: React.ReactNode; className?: string }) { return <section className={`rounded-2xl border border-gray-200 bg-white p-5 shadow-sm ${className}`}><h3 className="mb-4 text-sm font-bold text-gray-900">{title}</h3>{children}</section>; }
function Attention({ label, value }: { label: string; value: number }) { return <div className="flex justify-between border-b border-gray-100 py-3 text-sm last:border-0"><span className="text-gray-600">{label}</span><b>{value}</b></div>; }
function Empty({ text }: { text: string }) { return <p className="py-8 text-center text-sm text-gray-400">{text}</p>; }
function WorkRow({ item }: { item: any }) { return <div className="border-b border-gray-100 py-3 last:border-0"><p className="text-sm font-bold">{item.title}</p><p className="text-xs text-gray-500">{item.status}{item.dueAt ? ` · Due ${new Date(item.dueAt).toLocaleString()}` : ''}</p></div>; }
function Quick({ label, icon: Icon, onClick }: { label: string; icon: any; onClick: () => void }) { return <button onClick={onClick} className="rounded-xl border border-gray-200 p-4 text-left text-sm font-semibold hover:border-blue-300 hover:bg-blue-50"><Icon className="mb-3 h-5 w-5 text-blue-600" />{label}</button>; }
function Info({ label, value }: { label: string; value: string }) { return <div className="rounded-lg bg-gray-50 p-3"><p className="text-[11px] font-semibold uppercase text-gray-400">{label}</p><p className="mt-1 text-sm font-bold text-gray-800">{value}</p></div>; }
function WorkList({ title, items, onCreate }: { title: string; items: any[]; onCreate: () => void }) { return <Panel title={title}><div className="mb-3 flex justify-end"><button onClick={onCreate} className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white"><Plus className="mr-1 inline h-4 w-4" />New</button></div>{items.length ? items.map((item) => <WorkRow key={item.id} item={item} />) : <Empty text={`No ${title.toLowerCase()} yet.`} />}</Panel>; }
function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="block text-xs font-semibold text-gray-600"><span className="mb-1.5 block">{label}</span>{children}</label>; }
