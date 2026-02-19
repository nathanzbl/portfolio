import { useEffect, useState } from 'react';
import type { Project } from '../../../types/portfolio';
import { getProjects } from '../../../api/projects';
import { Badge } from '../../../components/ui/Badge';
import { Card } from '../../../components/ui/Card';

export function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProjects()
      .then(setProjects)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="projects" className="py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Projects</h2>
        <div className="w-16 h-1 bg-indigo-600 rounded mb-10" />

        {loading && (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!loading && projects.length === 0 && (
          <p className="text-gray-400 text-center py-12">No projects yet.</p>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <Card key={project.id} className="flex flex-col p-6 hover:shadow-md transition-shadow">
              {project.image_url && (
                <img
                  src={project.image_url}
                  alt={project.title}
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
              )}
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900">{project.title}</h3>
                {project.is_featured && (
                  <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded font-medium">
                    Featured
                  </span>
                )}
              </div>
              {project.description && (
                <p className="text-sm text-gray-500 mb-4 flex-1">{project.description}</p>
              )}
              <div className="flex flex-wrap gap-1 mb-4">
                {project.tech_stack.map(t => (
                  <Badge key={t}>{t}</Badge>
                ))}
              </div>
              <div className="flex gap-3 mt-auto">
                {project.github_url && (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-indigo-600 hover:underline"
                  >
                    GitHub
                  </a>
                )}
                {project.live_url && (
                  <a
                    href={project.live_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-indigo-600 hover:underline"
                  >
                    Live Demo
                  </a>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
