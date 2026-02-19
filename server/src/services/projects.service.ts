import pool from '../db/pool';

export async function getAllProjects() {
  const { rows } = await pool.query(
    'SELECT * FROM projects ORDER BY sort_order ASC, id DESC'
  );
  return rows;
}

export async function createProject(data: {
  title: string;
  description?: string;
  techStack?: string[];
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
  isFeatured?: boolean;
  sortOrder?: number;
}) {
  const { rows } = await pool.query(
    `INSERT INTO projects (title, description, tech_stack, github_url, live_url, image_url, is_featured, sort_order)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [
      data.title,
      data.description ?? null,
      data.techStack ?? [],
      data.githubUrl ?? null,
      data.liveUrl ?? null,
      data.imageUrl ?? null,
      data.isFeatured ?? false,
      data.sortOrder ?? 0,
    ]
  );
  return rows[0];
}

export async function updateProject(id: number, data: {
  title?: string;
  description?: string;
  techStack?: string[];
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
  isFeatured?: boolean;
  sortOrder?: number;
}) {
  const { rows } = await pool.query(
    `UPDATE projects SET
      title = COALESCE($1, title),
      description = COALESCE($2, description),
      tech_stack = COALESCE($3, tech_stack),
      github_url = COALESCE($4, github_url),
      live_url = COALESCE($5, live_url),
      image_url = COALESCE($6, image_url),
      is_featured = COALESCE($7, is_featured),
      sort_order = COALESCE($8, sort_order),
      updated_at = NOW()
     WHERE id = $9
     RETURNING *`,
    [
      data.title ?? null,
      data.description ?? null,
      data.techStack ?? null,
      data.githubUrl ?? null,
      data.liveUrl ?? null,
      data.imageUrl ?? null,
      data.isFeatured ?? null,
      data.sortOrder ?? null,
      id,
    ]
  );
  return rows[0] ?? null;
}

export async function deleteProject(id: number) {
  const { rowCount } = await pool.query('DELETE FROM projects WHERE id = $1', [id]);
  return (rowCount ?? 0) > 0;
}
