import { useState, useEffect, FormEvent } from 'react';
import type { Experience } from '../../types/portfolio';
import { getExperience, createExperience, updateExperience, deleteExperience } from '../../api/portfolio';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { Spinner } from '../../components/ui/Spinner';

const empty = {
  company: '', role: '', description: '',
  start_date: '', end_date: '', is_current: false, sort_order: 0,
};

function toInputDate(d: string | null): string {
  if (!d) return '';
  return d.slice(0, 10);
}

export function ExperiencePage() {
  const [items, setItems] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Experience | null>(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  const load = () => getExperience().then(setItems).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(null); setForm(empty); setModalOpen(true); };
  const openEdit = (item: Experience) => {
    setEditing(item);
    setForm({
      company: item.company, role: item.role, description: item.description ?? '',
      start_date: toInputDate(item.start_date), end_date: toInputDate(item.end_date),
      is_current: item.is_current, sort_order: item.sort_order,
    });
    setModalOpen(true);
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const data = {
      company: form.company, role: form.role, description: form.description,
      startDate: form.start_date, endDate: form.is_current ? undefined : form.end_date || undefined,
      isCurrent: form.is_current, sortOrder: form.sort_order,
    };
    try {
      if (editing) await updateExperience(editing.id, data as never);
      else await createExperience(data as never);
      setModalOpen(false); load();
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this entry?')) return;
    await deleteExperience(id); load();
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Experience</h1>
        <Button onClick={openNew}>+ Add Entry</Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Spinner /></div>
      ) : items.length === 0 ? (
        <p className="text-gray-400 text-center py-16">No experience yet.</p>
      ) : (
        <div className="grid gap-4">
          {items.map(item => (
            <div key={item.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex gap-4">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{item.role}</h3>
                <p className="text-sm text-gray-500">{item.company}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {toInputDate(item.start_date)} → {item.is_current ? 'Present' : toInputDate(item.end_date)}
                </p>
              </div>
              <div className="flex gap-2 shrink-0 items-start">
                <Button variant="secondary" onClick={() => openEdit(item)}>Edit</Button>
                <Button variant="danger" onClick={() => handleDelete(item.id)}>Delete</Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Experience' : 'New Experience'}>
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <Input label="Company" value={form.company} onChange={e => setForm(f => ({...f, company: e.target.value}))} required />
          <Input label="Role" value={form.role} onChange={e => setForm(f => ({...f, role: e.target.value}))} required />
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} rows={3}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <Input label="Start Date" type="date" value={form.start_date} onChange={e => setForm(f => ({...f, start_date: e.target.value}))} required />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.is_current} onChange={e => setForm(f => ({...f, is_current: e.target.checked}))} className="rounded" />
            Currently working here
          </label>
          {!form.is_current && (
            <Input label="End Date" type="date" value={form.end_date} onChange={e => setForm(f => ({...f, end_date: e.target.value}))} />
          )}
          <Input label="Sort Order" type="number" value={String(form.sort_order)} onChange={e => setForm(f => ({...f, sort_order: Number(e.target.value)}))} />
          <div className="flex gap-3 justify-end pt-2">
            <Button variant="secondary" type="button" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" loading={saving}>Save</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
