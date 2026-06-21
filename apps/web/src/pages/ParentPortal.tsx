import React, { useEffect, useState } from 'react';
import { BadgeCheck, BedDouble, BookOpen, CalendarDays, ClipboardCheck, FileText, GraduationCap, Home, LifeBuoy, LockKeyhole, MessageSquare, Receipt, ShoppingBag, UserRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../lib/api';
import { notifyAction } from '../lib/notify';
import { useBranding } from '../settings/BrandingContext';
import ParentHostel from '../components/ParentHostel';

const sections = [
  ['dashboard','Dashboard',Home], ['homework','Homework',BookOpen], ['attendance','Attendance',ClipboardCheck],
  ['assessments','Assessments',GraduationCap], ['announcements','Announcements',MessageSquare], ['fees','School Fees',BadgeCheck],
  ['applications','Applications',FileText], ['hostel','Hostel',BedDouble], ['appointments','Appointments',CalendarDays], ['orders','Orders',Receipt], ['store','School Store',ShoppingBag], ['tickets','Support',LifeBuoy]
] as const;

export default function ParentPortal() {
  const { branding } = useBranding(); const navigate = useNavigate();
  const [children, setChildren] = useState<any[]>([]); const [selectedId, setSelectedId] = useState('');
  const [active, setActive] = useState('dashboard'); const [context, setContext] = useState<any>(null); const [sectionData, setSectionData] = useState<any[]>([]); const [loading, setLoading] = useState(true);
  const selected = children.find((item) => item.learner.id === selectedId);

  useEffect(() => { apiRequest<any[]>('/parent/children').then((items) => { setChildren(items); setSelectedId(items[0]?.learner.id || ''); }).catch((e) => notifyAction(e.message, 'error')).finally(() => setLoading(false)); }, []);
  useEffect(() => {
    if (!selectedId) { setContext(null); return; }
    apiRequest(`/parent/children/${selectedId}/overview`).then(setContext).catch((e) => notifyAction(e.message, 'error'));
  }, [selectedId]);
  useEffect(() => {
    setSectionData([]); if (active === 'store') { navigate('/store'); return; }
    const endpoint = active === 'fees' ? `/parent/children/${selectedId}/fees` : active === 'applications' ? `/parent/children/${selectedId}/applications` : active === 'orders' ? '/parent/orders' : active === 'tickets' ? '/parent/tickets' : '';
    if (endpoint && (selectedId || ['orders','tickets'].includes(active))) apiRequest<any[]>(endpoint).then(setSectionData).catch((e) => notifyAction(e.message, 'error'));
  }, [active, selectedId]);

  return <div className="flex min-h-screen bg-gray-50">
    <aside className="hidden w-64 flex-col border-r bg-white lg:flex"><div className="border-b p-5"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white">{(branding?.schoolName || 'P')[0]}</div><p className="mt-3 font-bold">{branding?.schoolName || 'Your School'}</p><p className="text-xs text-gray-500">Parent Portal</p></div><nav className="flex-1 space-y-1 p-3">{sections.map(([key,label,Icon]) => <button key={key} onClick={() => setActive(key)} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold ${active === key ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}><Icon className="h-4 w-4"/>{label}</button>)}</nav></aside>
    <main className="min-w-0 flex-1 p-4 md:p-7"><div className="mx-auto max-w-6xl space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-blue-600">Family workspace</p><h1 className="text-2xl font-bold text-gray-900">{sections.find(([key]) => key === active)?.[1]}</h1></div>{children.length > 0 && <label className="min-w-72 rounded-xl border bg-white px-4 py-2 shadow-sm"><span className="block text-[10px] font-bold uppercase tracking-wide text-gray-500">Viewing child</span><select className="mt-1 w-full bg-transparent text-sm font-bold outline-none" value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>{children.map(({learner}:any) => <option key={learner.id} value={learner.id}>{learner.firstName} {learner.lastName} — {learner.studentNumber}</option>)}</select></label>}</header>
      {loading && <Panel><p className="text-sm text-gray-500">Loading your family profile…</p></Panel>}
      {!loading && !children.length && <div className="rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center"><LockKeyhole className="mx-auto h-10 w-10 text-amber-600"/><h2 className="mt-4 text-xl font-bold text-amber-900">Your account is ready, but no learner is linked</h2><p className="mx-auto mt-2 max-w-xl text-sm text-amber-800">For learner privacy, signup does not grant access automatically. Ask the school to link this account through an accepted admission, admin invitation, or verified guardian approval.</p></div>}
      {selected && <div className="rounded-2xl bg-gradient-to-r from-blue-700 to-indigo-700 p-5 text-white"><div className="flex items-center gap-4"><div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15"><UserRound/></div><div><h2 className="text-xl font-bold">{selected.learner.firstName} {selected.learner.lastName}</h2><p className="text-sm text-blue-100">{selected.learner.studentNumber} · {selected.permissions.relationshipType}</p></div></div></div>}
      {selected && context && active === 'dashboard' && <><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><Metric label="Homework" value={context.homework.length}/><Metric label="Attendance records" value={context.attendance.length}/><Metric label="Assessments" value={context.assessments.length}/><Metric label="Announcements" value={context.announcements.length}/></div><div className="grid gap-5 lg:grid-cols-2"><Panel title="Upcoming homework"><Items items={context.homework} empty="No published homework."/></Panel><Panel title="Recent announcements"><Items items={context.announcements} empty="No class announcements."/></Panel></div></>}
      {selected && context && ['homework','attendance','assessments','announcements','appointments'].includes(active) && <Panel title={sections.find(([key]) => key === active)?.[1] as string}><Items items={context[active] || []} empty={`No ${active} records are available for this child.`}/></Panel>}
      {selected && ['fees','applications'].includes(active) && <Panel title={sections.find(([key]) => key === active)?.[1] as string}><Items items={sectionData} empty={`No ${active} records are available for this child.`}/></Panel>}
      {selected && active === 'hostel' && <ParentHostel learnerId={selectedId} permissions={selected.permissions}/>} 
      {['orders','tickets'].includes(active) && <Panel title={sections.find(([key]) => key === active)?.[1] as string}><Items items={sectionData} empty={`You have no ${active}.`}/></Panel>}
    </div></main>
  </div>;
}

function Panel({title,children}:{title?:string;children:React.ReactNode}) { return <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">{title && <h3 className="mb-4 font-bold text-gray-900">{title}</h3>}{children}</section>; }
function Metric({label,value}:{label:string;value:number}) { return <div className="rounded-2xl border bg-white p-4 shadow-sm"><p className="text-2xl font-bold text-gray-900">{value}</p><p className="text-xs text-gray-500">{label}</p></div>; }
function Items({items,empty}:{items:any[];empty:string}) { if (!items?.length) return <p className="py-8 text-center text-sm text-gray-500">{empty}</p>; return <div className="divide-y">{items.map((item:any,index:number) => <div key={item.id || index} className="py-3"><div className="flex justify-between gap-3"><b className="text-sm">{item.title || item.subject || item.reference || item.term || item.status || 'Record'}</b><span className="text-xs text-gray-500">{item.dueAt ? new Date(item.dueAt).toLocaleDateString() : item.startsAt ? new Date(item.startsAt).toLocaleDateString() : item.status}</span></div><p className="mt-1 text-xs text-gray-500">{item.instructions || item.message || item.description || (item.amount !== undefined ? `R ${Number(item.amount).toFixed(2)}` : '')}</p></div>)}</div>; }
