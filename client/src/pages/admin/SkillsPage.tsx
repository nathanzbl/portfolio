import { useState, useEffect, FormEvent } from 'react';
import type { Skill } from '../../types/portfolio';
import { getSkills, createSkill, updateSkill, deleteSkill } from '../../api/portfolio';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { Spinner } from '../../components/ui/Spinner';

const empty = { name: '', category: '', proficiency_level: 3, sort_order: 0 };

export function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Skill | null>(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  const load = () => getSkills().then(setSkills).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(null); setForm(empty); setModalOpen(true); };
  const openEdit = (s: Skill) => {
    setEditing(s);
    setForm({ name: s.name, category: s.category, proficiency_level: s.proficiency_level, sort_order: s.sort_order });
    setModalOpen(true);
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const data = { name: form.name, category: form.category, proficiencyLevel: form.proficiency_level, sortOrder: form.sort_order };
    try {
      if (editing) await updateSkill(editing.id, data as never);
      else await createSkill(data as never);
      setModalOpen(false); load();
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this skill?')) return;
    await deleteSkill(id); load();
  };

  const grouped = skills.reduce<Record<string, Skill[]>>((acc, s) => {
    (acc[s.category] ??= []).push(s); return acc;
  }, {});

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Skills</h1>
        <Button onClick={openNew}>+ Add Skill</Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Spinner /></div>
      ) : skills.length === 0 ? (
        <p className="text-gray-400 text-center py-16">No skills yet.</p>
      ) : (
        <div className="grid gap-6">
          {Object.entries(grouped).map(([cat, catSkills]) => (
            <div key={cat}>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">{cat}</h3>
              <div className="grid gap-2">
                {catSkills.map(s => (
                  <div key={s.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
                    <div className="flex-1">
                      <span className="font-medium text-gray-900">{s.name}</span>
                      <div className="flex gap-1 mt-1">
                        {Array.from({length: 5}).map((_, i) => (
                          <div key={i} className={`w-2 h-2 rounded-full ${i < s.proficiency_level ? 'bg-indigo-600' : 'bg-gray-200'}`} />
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="secondary" onClick={() => openEdit(s)}>Edit</Button>
                      <Button variant="danger" onClick={() => handleDelete(s.id)}>Delete</Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Skill' : 'New Skill'}>
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <Input label="Name" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} required />
          <Input label="Category" value={form.category} onChange={e => setForm(f => ({...f, category: e.target.value}))} required placeholder="e.g. Frontend, Backend, DevOps" />
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Proficiency (1–5): {form.proficiency_level}</label>
            <input type="range" min={1} max={5} value={form.proficiency_level}
              onChange={e => setForm(f => ({...f, proficiency_level: Number(e.target.value)}))} className="w-full" />
          </div>
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
