import { useEffect, useState } from 'react';
import type { Skill } from '../../../types/portfolio';
import { getSkills } from '../../../api/portfolio';
import { Badge } from '../../../components/ui/Badge';

export function About() {
  const [skills, setSkills] = useState<Skill[]>([]);

  useEffect(() => {
    getSkills().then(setSkills).catch(() => {});
  }, []);

  const grouped = skills.reduce<Record<string, Skill[]>>((acc, s) => {
    (acc[s.category] ??= []).push(s);
    return acc;
  }, {});

  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">About Me</h2>
        <div className="w-16 h-1 bg-indigo-600 rounded mb-10" />
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <p className="text-gray-600 leading-relaxed mb-4">
              I'm a passionate developer focused on building scalable, maintainable applications.
              I love solving hard problems and shipping things that people actually use.
            </p>
            <p className="text-gray-600 leading-relaxed">
              When I'm not coding, you can find me exploring board games, hiking, or tinkering with
              side projects.
            </p>
          </div>
          <div>
            {Object.entries(grouped).map(([category, catSkills]) => (
              <div key={category} className="mb-6">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  {category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {catSkills.map(s => (
                    <Badge key={s.id}>{s.name}</Badge>
                  ))}
                </div>
              </div>
            ))}
            {skills.length === 0 && (
              <p className="text-gray-400 text-sm">Skills will appear here once added.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
