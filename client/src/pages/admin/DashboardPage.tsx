import { useAuth } from '../../context/AuthContext';

export function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h1>
      <p className="text-gray-500 mb-8">
        Welcome back, <strong>{user?.username}</strong>.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Projects', href: '/admin/projects', emoji: '📁' },
          { label: 'Experience', href: '/admin/experience', emoji: '💼' },
          { label: 'Skills', href: '/admin/skills', emoji: '🛠️' },
          { label: 'Games', href: '/admin/games', emoji: '🎮' },
        ].map(card => (
          <a
            key={card.label}
            href={card.href}
            className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all group"
          >
            <div className="text-3xl mb-3">{card.emoji}</div>
            <p className="font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">
              {card.label}
            </p>
          </a>
        ))}
      </div>
    </div>
  );
}
