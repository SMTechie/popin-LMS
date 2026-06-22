import React, { useEffect, useState } from 'react';
import { BedDouble, Building2, ClipboardList, CreditCard, Megaphone, Wrench } from 'lucide-react';
import { apiRequest } from '../lib/api';
import { notifyAction } from '../lib/notify';
import Modal from './Modal';

const input = 'w-full rounded-lg border border-gray-200 px-3 py-2 text-sm';

export default function ParentHostel({ learnerId, permissions }: { learnerId: string; permissions: any }) {
  const [data, setData] = useState<any>(null);
  const [mode, setMode] = useState('');
  const [form, setForm] = useState<any>({ academicYear: new Date().getFullYear() });

  const load = () =>
    apiRequest(`/parent/children/${learnerId}/hostel`)
      .then((value) => setData(value && typeof value === 'object' ? value : null))
      .catch((error) => notifyAction(error.message, 'error'));

  useEffect(() => {
    void load();
  }, [learnerId]);

  const submit = async (path: string) => {
    try {
      await apiRequest(path, { method: 'POST', body: JSON.stringify(form) });
      setMode('');
      setForm({ academicYear: new Date().getFullYear() });
      await load();
      notifyAction('Hostel request submitted', 'success');
    } catch (error: any) {
      notifyAction(error.message, 'error');
    }
  };

  if (!permissions?.viewHostel) {
    return (
      <Card>
        <p className="text-sm text-amber-700">
          Your guardian link does not include hostel access. Contact the school if you need it enabled.
        </p>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card>
        <p className="text-sm text-gray-500">Loading hostel details...</p>
      </Card>
    );
  }

  const charges = Array.isArray(data.charges) ? data.charges : [];
  const notices = Array.isArray(data.notices) ? data.notices : [];
  const movementHistory = Array.isArray(data.movementHistory) ? data.movementHistory : [];
  const place = data.allocation?.bed?.room?.block;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap justify-end gap-2">
        {permissions.applyHostel && (
          <button onClick={() => setMode('application')} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white">
            Apply for placement
          </button>
        )}
        {permissions.submitHostelConcerns && (
          <button onClick={() => setMode('concern')} className="rounded-lg border bg-white px-4 py-2 text-sm font-bold text-gray-700">
            <Wrench className="mr-2 inline h-4 w-4" />
            Submit concern
          </button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card icon={ClipboardList} title="Application">
          <b className="text-lg">{data.application?.status?.replaceAll('_', ' ') || 'No application'}</b>
          <p className="mt-1 text-xs text-gray-500">
            {data.application ? `Academic year ${data.application.academicYear}` : 'Apply when hostel placement opens.'}
          </p>
        </Card>
        <Card icon={BedDouble} title="Allocation">
          <b className="text-lg">{place ? `${place.building.name} - ${data.allocation.bed.room.roomNumber}` : 'Not allocated'}</b>
          <p className="mt-1 text-xs text-gray-500">
            {data.allocation ? `${data.allocation.bed.label} - ${data.allocation.status.replaceAll('_', ' ')}` : 'Room and bed details will appear after approval.'}
          </p>
        </Card>
        <Card icon={CreditCard} title="Hostel balance">
          <b className="text-lg">
            R {charges.reduce((total: number, charge: any) => total + charge.amount - charge.paidAmount, 0).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
          </b>
          <p className="mt-1 text-xs text-gray-500">
            {permissions.viewHostelBilling ? 'Child-scoped hostel charges' : 'Billing access is disabled.'}
          </p>
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card icon={Megaphone} title="Hostel notices">
          {notices.length ? (
            notices.map((notice: any) => (
              <div key={notice.id} className="border-t py-3 first:border-0">
                <b className="text-sm">{notice.title}</b>
                <p className="text-xs text-gray-500">{notice.message}</p>
              </div>
            ))
          ) : (
            <Empty text="No hostel notices." />
          )}
        </Card>
        <Card icon={Building2} title="Check-in / check-out history">
          {permissions.viewHostelMovement && movementHistory.length ? (
            movementHistory.map((movement: any) => (
              <div key={movement.id} className="flex justify-between border-t py-3 text-xs first:border-0">
                <span>{movement.status.replaceAll('_', ' ')}</span>
                <span className="text-gray-500">{new Date(movement.createdAt).toLocaleDateString()}</span>
              </div>
            ))
          ) : (
            <Empty text="No movement records available." />
          )}
        </Card>
      </div>

      <Modal
        title={mode === 'application' ? 'Apply for hostel placement' : 'Submit hostel maintenance / concern request'}
        isOpen={!!mode}
        onClose={() => setMode('')}
      >
        <div className="space-y-4">
          {mode === 'application' ? (
            <>
              <Field label="Academic year">
                <input type="number" className={input} value={form.academicYear || ''} onChange={(event) => setForm({ ...form, academicYear: Number(event.target.value) })} />
              </Field>
              <Field label="Term">
                <input className={input} value={form.term || ''} onChange={(event) => setForm({ ...form, term: event.target.value })} />
              </Field>
              <Field label="Reason">
                <textarea className={input} value={form.reason || ''} onChange={(event) => setForm({ ...form, reason: event.target.value })} />
              </Field>
              <Field label="Medical requirements">
                <textarea className={input} value={form.medicalRequirements || ''} onChange={(event) => setForm({ ...form, medicalRequirements: event.target.value })} />
              </Field>
              <Field label="Dietary requirements">
                <textarea className={input} value={form.dietaryRequirements || ''} onChange={(event) => setForm({ ...form, dietaryRequirements: event.target.value })} />
              </Field>
            </>
          ) : (
            <>
              <Field label="Title">
                <input className={input} value={form.title || ''} onChange={(event) => setForm({ ...form, title: event.target.value })} />
              </Field>
              <Field label="Category">
                <input className={input} value={form.category || ''} onChange={(event) => setForm({ ...form, category: event.target.value })} />
              </Field>
              <Field label="Description">
                <textarea className={input} value={form.description || ''} onChange={(event) => setForm({ ...form, description: event.target.value })} />
              </Field>
            </>
          )}
          <button
            onClick={() => void submit(mode === 'application' ? `/parent/children/${learnerId}/hostel/applications` : `/parent/children/${learnerId}/hostel/concerns`)}
            className="w-full rounded-lg bg-blue-600 py-3 text-sm font-bold text-white"
          >
            Submit to school
          </button>
        </div>
      </Modal>
    </div>
  );
}

function Card({ icon: Icon, title, children }: { icon?: any; title?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border bg-white p-5 shadow-sm">
      {title && (
        <div className="mb-4 flex items-center gap-2">
          {Icon && <Icon className="h-4 w-4 text-blue-600" />}
          <h3 className="font-bold">{title}</h3>
        </div>
      )}
      {children}
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-xs font-bold text-gray-600">
      {label}
      <div className="mt-1">{children}</div>
    </label>
  );
}

function Empty({ text }: { text: string }) {
  return <p className="py-6 text-center text-sm text-gray-500">{text}</p>;
}
