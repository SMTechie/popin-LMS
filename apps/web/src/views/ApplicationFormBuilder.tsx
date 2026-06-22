import React, { useEffect, useMemo, useState } from 'react';
import { Reorder } from 'framer-motion';
import {
  Plus,
  Save,
  Trash2,
  Eye,
  Copy,
  GripVertical,
  CheckCircle,
  XCircle
} from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { apiRequest } from '../lib/api';
import { notifyAction } from '../lib/notify';

const FIELD_LIBRARY = [
  { type: 'text', label: 'Short Text' },
  { type: 'textarea', label: 'Long Text' },
  { type: 'email', label: 'Email' },
  { type: 'phone', label: 'Phone' },
  { type: 'number', label: 'Number' },
  { type: 'date', label: 'Date' },
  { type: 'select', label: 'Dropdown' },
  { type: 'radio', label: 'Radio Group' },
  { type: 'checkbox_group', label: 'Checkbox Group' },
  { type: 'checkbox', label: 'Checkbox' },
  { type: 'file', label: 'File Upload' },
  { type: 'section', label: 'Section Header' },
  { type: 'paragraph', label: 'Paragraph Text' },
  { type: 'divider', label: 'Divider' },
  { type: 'page_break', label: 'Page Break' },
  { type: 'block_learner', label: 'Learner Info Block' },
  { type: 'block_guardian', label: 'Guardian Info Block' },
  { type: 'block_emergency', label: 'Emergency Contact Block' },
  { type: 'block_address', label: 'Address Block' }
];

type FormField = {
  id: string;
  type: string;
  key: string;
  label?: string;
  required?: boolean;
  placeholder?: string;
  helpText?: string;
  options?: string[];
  fileTypes?: string;
  maxSizeMb?: number;
};

type FormStep = {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
};

type FormSchema = {
  title: string;
  description?: string;
  steps: FormStep[];
};

const defaultSchema = (): FormSchema => ({
  title: 'Admissions Application',
  description: 'Complete the form to apply for admission.',
  steps: [{ id: crypto.randomUUID(), title: 'Step 1', fields: [] }]
});

const normalizeSchema = (raw: any): FormSchema => {
  const base = raw || {};
  const steps = Array.isArray(base.steps) && base.steps.length ? base.steps : defaultSchema().steps;
  return {
    title: base.title || 'Admissions Application',
    description: base.description || '',
    steps: steps.map((step: any, index: number) => ({
      id: step.id || crypto.randomUUID(),
      title: step.title || `Step ${index + 1}`,
      description: step.description || '',
      fields: (step.fields || []).map((field: any, fieldIndex: number) => ({
        id: field.id || crypto.randomUUID(),
        type: field.type || 'text',
        key: field.key || `field_${index}_${fieldIndex}`,
        label: field.label || 'Field',
        required: !!field.required,
        placeholder: field.placeholder || '',
        helpText: field.helpText || '',
        options: field.options || undefined,
        fileTypes: field.fileTypes || undefined,
        maxSizeMb: field.maxSizeMb || undefined
      }))
    }))
  };
};

const createField = (type: string): FormField[] => {
  const base = {
    id: crypto.randomUUID(),
    type,
    key: `${type}_${Date.now()}`,
    label: 'New field',
    required: false
  };

  if (type === 'section') {
    return [{ ...base, label: 'Section Title', key: `section_${Date.now()}` }];
  }
  if (type === 'paragraph') {
    return [{ ...base, label: 'Supporting text', key: `paragraph_${Date.now()}` }];
  }
  if (type === 'divider') {
    return [{ ...base, label: 'Divider', key: `divider_${Date.now()}` }];
  }
  if (type === 'page_break') {
    return [{ ...base, label: 'Page Break', key: `page_${Date.now()}` }];
  }
  if (type === 'select' || type === 'radio' || type === 'checkbox_group') {
    return [{ ...base, options: ['Option 1', 'Option 2'] }];
  }
  if (type === 'file') {
    return [{ ...base, label: 'Upload document', key: `file_${Date.now()}`, fileTypes: '.pdf,.png,.jpg', maxSizeMb: 5 }];
  }
  if (type === 'block_learner') {
    return [
      { ...base, type: 'text', key: 'student_name', label: 'Learner Full Name', required: true },
      { ...base, id: crypto.randomUUID(), type: 'date', key: 'student_birthdate', label: 'Date of Birth', required: true },
      { ...base, id: crypto.randomUUID(), type: 'text', key: 'student_grade', label: 'Grade Applying For', required: true }
    ];
  }
  if (type === 'block_guardian') {
    return [
      { ...base, type: 'text', key: 'guardian_name', label: 'Guardian Name', required: true },
      { ...base, id: crypto.randomUUID(), type: 'email', key: 'guardian_email', label: 'Guardian Email', required: true },
      { ...base, id: crypto.randomUUID(), type: 'phone', key: 'guardian_phone', label: 'Guardian Phone', required: true }
    ];
  }
  if (type === 'block_emergency') {
    return [
      { ...base, type: 'text', key: 'emergency_name', label: 'Emergency Contact Name', required: true },
      { ...base, id: crypto.randomUUID(), type: 'phone', key: 'emergency_phone', label: 'Emergency Contact Phone', required: true }
    ];
  }
  if (type === 'block_address') {
    return [
      { ...base, type: 'text', key: 'address_line1', label: 'Address Line 1', required: true },
      { ...base, id: crypto.randomUUID(), type: 'text', key: 'address_line2', label: 'Address Line 2' },
      { ...base, id: crypto.randomUUID(), type: 'text', key: 'address_city', label: 'City', required: true },
      { ...base, id: crypto.randomUUID(), type: 'text', key: 'address_postal', label: 'Postal Code', required: true }
    ];
  }

  return [{ ...base }];
};

export default function ApplicationFormBuilder() {
  const [forms, setForms] = useState<any[]>([]);
  const [formDetail, setFormDetail] = useState<any | null>(null);
  const [selectedFormId, setSelectedFormId] = useState<string>('');
  const [schema, setSchema] = useState<FormSchema>(defaultSchema());
  const [activeStepId, setActiveStepId] = useState<string>('');
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [statusForm, setStatusForm] = useState<any>({
    admissionsOpenState: 'open',
    opensAt: '',
    closesAt: '',
    closedMessage: '',
    openingMessage: ''
  });
  const [newFormName, setNewFormName] = useState('Admissions Application');
  const [newFormSlug, setNewFormSlug] = useState('admissions');

  const activeStep = useMemo(() => {
    return schema.steps.find((step) => step.id === activeStepId) || schema.steps[0];
  }, [schema, activeStepId]);

  useEffect(() => {
    apiRequest<any>('/applications/forms')
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        setForms(list);
        if (list.length) {
          setSelectedFormId(list[0].id);
        }
      })
      .catch((err) => notifyAction(err.message || 'Failed to load forms', 'error'));
  }, []);

  useEffect(() => {
    if (!selectedFormId) return;
    apiRequest<any>(`/applications/forms/${selectedFormId}`)
      .then((data) => {
        setFormDetail(data);
        const latest = data.versions?.[0];
        const loadedSchema = normalizeSchema(latest?.schemaJson);
        setSchema(loadedSchema);
        setActiveStepId(loadedSchema.steps[0].id);
        setStatusForm({
          admissionsOpenState: data.admissionsOpenState || 'open',
          opensAt: data.opensAt || '',
          closesAt: data.closesAt || '',
          closedMessage: data.closedMessage || '',
          openingMessage: data.openingMessage || ''
        });
      })
      .catch((err) => notifyAction(err.message || 'Failed to load form details', 'error'));
  }, [selectedFormId]);

  const addFieldToStep = (type: string) => {
    if (!activeStep) return;
    const newFields = createField(type);
    setSchema((prev) => ({
      ...prev,
      steps: prev.steps.map((step) =>
        step.id === activeStep.id ? { ...step, fields: [...step.fields, ...newFields] } : step
      )
    }));
    setSelectedFieldId(newFields[0].id);
  };

  const updateField = (fieldId: string, updater: (field: FormField) => FormField) => {
    setSchema((prev) => ({
      ...prev,
      steps: prev.steps.map((step) => ({
        ...step,
        fields: step.fields.map((field) => (field.id === fieldId ? updater(field) : field))
      }))
    }));
  };

  const removeField = (fieldId: string) => {
    setSchema((prev) => ({
      ...prev,
      steps: prev.steps.map((step) => ({
        ...step,
        fields: step.fields.filter((field) => field.id !== fieldId)
      }))
    }));
    if (selectedFieldId === fieldId) setSelectedFieldId(null);
  };

  const addStep = () => {
    const step: FormStep = {
      id: crypto.randomUUID(),
      title: `Step ${schema.steps.length + 1}`,
      fields: []
    };
    setSchema((prev) => ({ ...prev, steps: [...prev.steps, step] }));
    setActiveStepId(step.id);
  };

  const saveVersion = async () => {
    if (!selectedFormId) return;
    try {
      setSaving(true);
      const res = await apiRequest(`/applications/forms/${selectedFormId}/versions`, {
        method: 'POST',
        body: JSON.stringify({ schema })
      });
      notifyAction('Draft version saved.', 'success');
      setFormDetail((prev: any) => ({
        ...prev,
        versions: [res, ...(prev?.versions || [])]
      }));
    } catch (err: any) {
      notifyAction(err?.message || 'Failed to save draft.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const publishVersion = async () => {
    if (!selectedFormId || !formDetail?.versions?.length) return;
    const versionId = formDetail.versions[0].id;
    try {
      setPublishing(true);
      await apiRequest(`/applications/forms/${selectedFormId}/publish`, {
        method: 'POST',
        body: JSON.stringify({ versionId })
      });
      notifyAction('Form published.', 'success');
    } catch (err: any) {
      notifyAction(err?.message || 'Failed to publish form.', 'error');
    } finally {
      setPublishing(false);
    }
  };

  const saveStatus = async () => {
    if (!selectedFormId) return;
    try {
      await apiRequest(`/applications/forms/${selectedFormId}/status`, {
        method: 'PATCH',
        body: JSON.stringify(statusForm)
      });
      notifyAction('Admissions status updated.', 'success');
    } catch (err: any) {
      notifyAction(err?.message || 'Failed to update status.', 'error');
    }
  };

  const createForm = async () => {
    try {
      const res = await apiRequest('/applications/forms', {
        method: 'POST',
        body: JSON.stringify({ name: newFormName, slug: newFormSlug })
      });
      setForms((prev) => [res, ...prev]);
      setSelectedFormId(res.id);
      notifyAction('Form created.', 'success');
    } catch (err: any) {
      notifyAction(err?.message || 'Failed to create form.', 'error');
    }
  };

  const selectedField = schema.steps
    .flatMap((step) => step.fields)
    .find((field) => field.id === selectedFieldId);

  return (
    <DashboardLayout title="Application Form Builder">
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Admissions Form Builder</h2>
            <p className="text-sm text-gray-500">Design the admissions application experience for your school.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={saveVersion}
              disabled={saving}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Draft'}
            </button>
            <button
              onClick={publishVersion}
              disabled={publishing}
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 text-sm font-medium rounded-lg hover:bg-gray-50"
            >
              <CheckCircle className="w-4 h-4" />
              {publishing ? 'Publishing...' : 'Publish'}
            </button>
            <a
              href="/applications/new"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 text-sm font-medium rounded-lg hover:bg-gray-50"
            >
              <Eye className="w-4 h-4" />
              Preview
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
              <h3 className="text-sm font-semibold text-gray-800">Form Selection</h3>
              {forms.length ? (
                <select
                  value={selectedFormId}
                  onChange={(e) => setSelectedFormId(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
                >
                  {forms.map((form) => (
                    <option key={form.id} value={form.id}>{form.name}</option>
                  ))}
                </select>
              ) : (
                <div className="space-y-2">
                  <input
                    value={newFormName}
                    onChange={(e) => setNewFormName(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
                    placeholder="Form name"
                  />
                  <input
                    value={newFormSlug}
                    onChange={(e) => setNewFormSlug(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
                    placeholder="Slug"
                  />
                  <button
                    onClick={createForm}
                    className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white text-xs font-medium rounded-lg"
                  >
                    <Plus className="w-4 h-4" />
                    Create form
                  </button>
                </div>
              )}
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
              <h3 className="text-sm font-semibold text-gray-800">Field Library</h3>
              <div className="grid grid-cols-1 gap-2">
                {FIELD_LIBRARY.map((field) => (
                  <button
                    key={field.type}
                    onClick={() => addFieldToStep(field.type)}
                    className="flex items-center justify-between px-3 py-2 text-xs border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <span>{field.label}</span>
                    <Plus className="w-3.5 h-3.5 text-gray-400" />
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
              <h3 className="text-sm font-semibold text-gray-800">Admissions Status</h3>
              <select
                value={statusForm.admissionsOpenState}
                onChange={(e) => setStatusForm((prev: any) => ({ ...prev, admissionsOpenState: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
              >
                <option value="open">Open</option>
                <option value="closed">Closed</option>
                <option value="scheduled">Scheduled</option>
              </select>
              <input
                type="datetime-local"
                value={statusForm.opensAt || ''}
                onChange={(e) => setStatusForm((prev: any) => ({ ...prev, opensAt: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
              />
              <input
                type="datetime-local"
                value={statusForm.closesAt || ''}
                onChange={(e) => setStatusForm((prev: any) => ({ ...prev, closesAt: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
              />
              <textarea
                value={statusForm.closedMessage || ''}
                onChange={(e) => setStatusForm((prev: any) => ({ ...prev, closedMessage: e.target.value }))}
                placeholder="Closed message"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
                rows={3}
              />
              <textarea
                value={statusForm.openingMessage || ''}
                onChange={(e) => setStatusForm((prev: any) => ({ ...prev, openingMessage: e.target.value }))}
                placeholder="Opening soon message"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
                rows={3}
              />
              <button
                onClick={saveStatus}
                className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white text-xs font-medium rounded-lg"
              >
                <Save className="w-3.5 h-3.5" />
                Save Status
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-4">
            <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <input
                    value={schema.title}
                    onChange={(e) => setSchema((prev) => ({ ...prev, title: e.target.value }))}
                    className="text-lg font-semibold text-gray-900 w-full focus:outline-none"
                  />
                  <textarea
                    value={schema.description}
                    onChange={(e) => setSchema((prev) => ({ ...prev, description: e.target.value }))}
                    className="w-full text-sm text-gray-500 focus:outline-none"
                    rows={2}
                  />
                </div>
                <button
                  onClick={addStep}
                  className="inline-flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-xs hover:bg-gray-50"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Step
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {schema.steps.map((step) => (
                  <button
                    key={step.id}
                    onClick={() => setActiveStepId(step.id)}
                    className={`px-3 py-1.5 rounded-full text-xs border ${
                      activeStep?.id === step.id
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {step.title}
                  </button>
                ))}
              </div>

              {activeStep && (
                <div className="grid grid-cols-1 gap-2">
                  <label className="text-xs font-semibold text-gray-500">Step title</label>
                  <input
                    value={activeStep.title}
                    onChange={(e) =>
                      setSchema((prev) => ({
                        ...prev,
                        steps: prev.steps.map((step) =>
                          step.id === activeStep.id ? { ...step, title: e.target.value } : step
                        )
                      }))
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
                  />
                </div>
              )}

              <div className="border border-dashed border-gray-200 rounded-xl p-4 min-h-[240px]">
                <Reorder.Group
                  axis="y"
                  values={activeStep?.fields || []}
                  onReorder={(newOrder) => {
                    if (!activeStep) return;
                    setSchema((prev) => ({
                      ...prev,
                      steps: prev.steps.map((step) =>
                        step.id === activeStep.id ? { ...step, fields: newOrder as FormField[] } : step
                      )
                    }));
                  }}
                  className="space-y-2"
                >
                  {activeStep?.fields?.map((field) => (
                    <Reorder.Item
                      key={field.id}
                      value={field}
                      className={`border rounded-lg p-3 bg-white flex items-center justify-between gap-3 cursor-pointer ${
                        selectedFieldId === field.id ? 'border-blue-500' : 'border-gray-200'
                      }`}
                      onClick={() => setSelectedFieldId(field.id)}
                    >
                      <div className="flex items-center gap-2">
                        <GripVertical className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-800">{field.label || 'Untitled field'}</p>
                          <p className="text-xs text-gray-500">{field.type}</p>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeField(field.id);
                        }}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </Reorder.Item>
                  ))}
                </Reorder.Group>
                {!activeStep?.fields?.length && (
                  <div className="text-sm text-gray-400 text-center py-10">Add fields from the library to start building.</div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-4">
            <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
              <h3 className="text-sm font-semibold text-gray-800">Field Properties</h3>
              {selectedField ? (
                <>
                  <input
                    value={selectedField.label || ''}
                    onChange={(e) => updateField(selectedField.id, (field) => ({ ...field, label: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
                    placeholder="Label"
                  />
                  <input
                    value={selectedField.key}
                    onChange={(e) => updateField(selectedField.id, (field) => ({ ...field, key: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
                    placeholder="Field key"
                  />
                  <input
                    value={selectedField.placeholder || ''}
                    onChange={(e) => updateField(selectedField.id, (field) => ({ ...field, placeholder: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
                    placeholder="Placeholder"
                  />
                  <textarea
                    value={selectedField.helpText || ''}
                    onChange={(e) => updateField(selectedField.id, (field) => ({ ...field, helpText: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
                    placeholder="Helper text"
                    rows={3}
                  />
                  {(selectedField.type === 'select' || selectedField.type === 'radio' || selectedField.type === 'checkbox_group') && (
                    <textarea
                      value={(selectedField.options || []).join(', ')}
                      onChange={(e) => updateField(selectedField.id, (field) => ({
                        ...field,
                        options: e.target.value.split(',').map((opt) => opt.trim()).filter(Boolean)
                      }))}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
                      placeholder="Options (comma separated)"
                      rows={3}
                    />
                  )}
                  {selectedField.type === 'file' && (
                    <>
                      <input
                        value={selectedField.fileTypes || ''}
                        onChange={(e) => updateField(selectedField.id, (field) => ({ ...field, fileTypes: e.target.value }))}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
                        placeholder="Allowed types (.pdf,.jpg)"
                      />
                      <input
                        type="number"
                        value={selectedField.maxSizeMb || 5}
                        onChange={(e) => updateField(selectedField.id, (field) => ({ ...field, maxSizeMb: Number(e.target.value) }))}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
                        placeholder="Max size MB"
                      />
                    </>
                  )}
                  <label className="flex items-center gap-2 text-xs text-gray-600">
                    <input
                      type="checkbox"
                      checked={!!selectedField.required}
                      onChange={(e) => updateField(selectedField.id, (field) => ({ ...field, required: e.target.checked }))}
                    />
                    Required field
                  </label>
                </>
              ) : (
                <p className="text-xs text-gray-500">Select a field to edit its properties.</p>
              )}
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-2 text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <Copy className="w-3.5 h-3.5" />
                Draft versions are stored for audit and rollback.
              </div>
              <div className="flex items-center gap-2">
                <XCircle className="w-3.5 h-3.5" />
                Publish to make this version live for applicants.
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
