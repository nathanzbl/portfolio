import { useState, useEffect, FormEvent } from 'react';
import type { AuthUser } from '../../types/auth';
import { getUsers, createUser, updateUser, deleteUser } from '../../api/users';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { Spinner } from '../../components/ui/Spinner';

interface UserForm {
  username: string;
  password: string;
}

const emptyForm: UserForm = { username: '', password: '' };

export function UsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<AuthUser | null>(null);
  const [form, setForm] = useState<UserForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const load = () =>
    getUsers()
      .then(setUsers)
      .catch(() => setError('Failed to load users'))
      .finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const openNew = () => {
    setEditing(null);
    setForm(emptyForm);
    setSaveError('');
    setModalOpen(true);
  };

  const openEdit = (u: AuthUser) => {
    setEditing(u);
    setForm({ username: u.username, password: '' });
    setSaveError('');
    setModalOpen(true);
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaveError('');
    setSaving(true);
    try {
      if (editing) {
        const data: { username?: string; password?: string } = {};
        if (form.username !== editing.username) data.username = form.username;
        if (form.password) data.password = form.password;
        await updateUser(editing.id, data);
      } else {
        await createUser(form.username, form.password);
      }
      setModalOpen(false);
      load();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })
        ?.response?.data?.error ?? 'Something went wrong';
      setSaveError(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (u: AuthUser) => {
    if (!confirm(`Delete user "${u.username}"? This cannot be undone.`)) return;
    try {
      await deleteUser(u.id);
      load();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })
        ?.response?.data?.error ?? 'Delete failed';
      alert(msg);
    }
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        <Button onClick={openNew}>+ Add User</Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Spinner /></div>
      ) : error ? (
        <p className="text-red-600 text-center py-16">{error}</p>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-left">
                <th className="px-5 py-3 font-medium text-gray-500">ID</th>
                <th className="px-5 py-3 font-medium text-gray-500">Username</th>
                <th className="px-5 py-3 font-medium text-gray-500">Created</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-b border-gray-50 last:border-0">
                  <td className="px-5 py-3 text-gray-400">{u.id}</td>
                  <td className="px-5 py-3 font-medium text-gray-900">
                    {u.username}
                    {u.id === currentUser?.id && (
                      <span className="ml-2 text-xs bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded">you</span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-gray-500">{formatDate(u.created_at)}</td>
                  <td className="px-5 py-3 flex gap-2 justify-end">
                    <Button variant="secondary" onClick={() => openEdit(u)}>Edit</Button>
                    <Button
                      variant="danger"
                      onClick={() => handleDelete(u)}
                      disabled={u.id === currentUser?.id}
                      title={u.id === currentUser?.id ? "Can't delete your own account" : undefined}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? `Edit "${editing.username}"` : 'New User'}
      >
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <Input
            label="Username"
            value={form.username}
            onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
            required
            autoComplete="off"
          />
          <Input
            label={editing ? 'New Password (leave blank to keep current)' : 'Password'}
            type="password"
            value={form.password}
            onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
            required={!editing}
            autoComplete="new-password"
          />
          {saveError && <p className="text-sm text-red-600">{saveError}</p>}
          <div className="flex gap-3 justify-end pt-2">
            <Button variant="secondary" type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={saving}>Save</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
