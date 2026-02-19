export interface Project {
  id: number;
  title: string;
  description: string | null;
  tech_stack: string[];
  github_url: string | null;
  live_url: string | null;
  image_url: string | null;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Experience {
  id: number;
  company: string;
  role: string;
  description: string | null;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Education {
  id: number;
  institution: string;
  degree: string;
  field: string;
  start_date: string;
  end_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface Skill {
  id: number;
  name: string;
  category: string;
  proficiency_level: number;
  sort_order: number;
  created_at: string;
  updated_at: string;
}
