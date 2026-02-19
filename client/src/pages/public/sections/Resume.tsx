import { useEffect, useState } from 'react';
import type { Experience, Education } from '../../../types/portfolio';
import { getExperience, getEducation } from '../../../api/portfolio';

function formatDate(dateStr: string | null, isCurrent = false) {
  if (isCurrent) return 'Present';
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export function Resume() {
  const [experience, setExperience] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);

  useEffect(() => {
    getExperience().then(setExperience).catch(() => {});
    getEducation().then(setEducation).catch(() => {});
  }, []);

  return (
    <section id="resume" className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Resume</h2>
        <div className="w-16 h-1 bg-indigo-600 rounded mb-12" />

        {/* Experience */}
        <div className="mb-12">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Experience</h3>
          {experience.length === 0 ? (
            <p className="text-gray-400 text-sm">Experience will appear here once added.</p>
          ) : (
            <div className="space-y-6">
              {experience.map(exp => (
                <div key={exp.id} className="flex gap-6">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-indigo-600 mt-1.5 shrink-0" />
                    <div className="w-px flex-1 bg-gray-200 mt-2" />
                  </div>
                  <div className="pb-6">
                    <div className="flex flex-wrap items-baseline gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900">{exp.role}</h4>
                      <span className="text-gray-500">@ {exp.company}</span>
                    </div>
                    <p className="text-xs text-gray-400 mb-2">
                      {formatDate(exp.start_date)} – {formatDate(exp.end_date, exp.is_current)}
                    </p>
                    {exp.description && (
                      <p className="text-sm text-gray-600 leading-relaxed">{exp.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Education */}
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Education</h3>
          {education.length === 0 ? (
            <p className="text-gray-400 text-sm">Education will appear here once added.</p>
          ) : (
            <div className="space-y-4">
              {education.map(edu => (
                <div key={edu.id} className="p-4 rounded-lg border border-gray-100 bg-gray-50">
                  <h4 className="font-semibold text-gray-900">{edu.institution}</h4>
                  <p className="text-sm text-gray-600">
                    {edu.degree} in {edu.field}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {formatDate(edu.start_date)} – {edu.end_date ? formatDate(edu.end_date) : 'Present'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
