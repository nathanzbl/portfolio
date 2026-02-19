import { useState, useEffect, FormEvent } from 'react';
import type { Project } from '../../types/portfolio';
import { getProjects, createProject, updateProject, deleteProject } from '../../api/projects';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { Badge } from '../../components/ui/Badge';
import { Spinner } from '../../components/ui/Spinner';

const empty = {
  title: '', description: '', tech_stack: [] as string[], github_url: '',
  live_url: '', image_url: '', is_featured: false, sort_order: 0,
};

export function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState(empty);
  const [techInput, setTechInput] = useState('');
  const [saving, setSaving] = useState(false);

  const load = () => getProjects().then(setProjects).finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const openNew = () => {
    setEditing(null);
    setForm(empty);
    setTechInput('');
    setModalOpen(true);
  };

  const openEdit = (p: Project) => {
    setEditing(p);
    setForm({
      title: p.title, description: p.description ?? '', tech_stack: p.tech_stack,
      github_url: p.github_url ?? '', live_url: p.live_url ?? '',
      image_url: p.image_url ?? '', is_featured: p.is_featured, sort_order: p.sort_order,
    });
    setTechInput(p.tech_stack.join(', '));
    setModalOpen(true);
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const data = {
      ...form,
      tech_stack: techInput.split(',').map(t => t.trim()).filter(Boolean),
    };
    try {
      if (editing) {
        await updateProject(editing.id, data);
      } else {
        await createProject(data);
      }
      setModalOpen(false);
      load();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this project?')) return;
    await deleteProject(id);
    load();
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
        <Button onClick={openNew}>+ Add Project</Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Spinner /></div>
      ) : projects.length === 0 ? (
        <p className="text-gray-400 text-center py-16">No projects yet. Add your first one!</p>
      ) : (
        <div className="grid gap-4">
          {projects.map(p => (
            <div key={p.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900">{p.title}</h3>
                  {p.is_featured && <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">Featured</span>}
                </div>
                {p.description && <p className="text-sm text-gray-500 mb-2 line-clamp-2">{p.description}</p>}
                <div className="flex flex-wrap gap-1">
                  {p.tech_stack.map(t => <Badge key={t}>{t}</Badge>)}
                </div>
              </div>
              <div className="flex gap-2 shrink-0 items-start">
                <Button variant="secondary" onClick={() => openEdit(p)}>Edit</Button>
                <Button variant="danger" onClick={() => handleDelete(p.id)}>Delete</Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Project' : 'New Project'}>
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <Input label="Title" value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))} required />
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={form.description}
              onChange={e => setForm(f => ({...f, description: e.target.value}))}
              rows={3}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <Input label="Tech Stack (comma separated)" value={techInput} onChange={e => setTechInput(e.target.value)} placeholder="React, TypeScript, Node.js" />
          <Input label="GitHub URL" value={form.github_url} onChange={e => setForm(f => ({...f, github_url: e.target.value}))} type="url" />
          <Input label="Live URL" value={form.live_url} onChange={e => setForm(f => ({...f, live_url: e.target.value}))} type="url" />
          <Input label="Image URL" value={form.image_url} onChange={e => setForm(f => ({...f, image_url: e.target.value}))} type="url" />
          <Input label="Sort Order" value={String(form.sort_order)} onChange={e => setForm(f => ({...f, sort_order: Number(e.target.value)}))} type="number" />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.is_featured} onChange={e => setForm(f => ({...f, is_featured: e.target.checked}))} className="rounded" />
            Featured project
          </label>
          <div className="flex gap-3 justify-end pt-2">
            <Button variant="secondary" type="button" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" loading={saving}>Save</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
