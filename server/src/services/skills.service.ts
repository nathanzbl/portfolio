import pool from '../db/pool';

export async function getAllSkills() {
  const { rows } = await pool.query(
    'SELECT * FROM skills ORDER BY category ASC, sort_order ASC, name ASC'
  );
  return rows;
}

export async function createSkill(data: {
  name: string;
  category: string;
  proficiencyLevel?: number;
  sortOrder?: number;
}) {
  const { rows } = await pool.query(
    `INSERT INTO skills (name, category, proficiency_level, sort_order)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [data.name, data.category, data.proficiencyLevel ?? 3, data.sortOrder ?? 0]
  );
  return rows[0];
}

export async function updateSkill(id: number, data: {
  name?: string;
  category?: string;
  proficiencyLevel?: number;
  sortOrder?: number;
}) {
  const { rows } = await pool.query(
    `UPDATE skills SET
      name = COALESCE($1, name),
      category = COALESCE($2, category),
      proficiency_level = COALESCE($3, proficiency_level),
      sort_order = COALESCE($4, sort_order),
      updated_at = NOW()
     WHERE id = $5
     RETURNING *`,
    [
      data.name ?? null,
      data.category ?? null,
      data.proficiencyLevel ?? null,
      data.sortOrder ?? null,
      id,
    ]
  );
  return rows[0] ?? null;
}

export async function deleteSkill(id: number) {
  const { rowCount } = await pool.query('DELETE FROM skills WHERE id = $1', [id]);
  return (rowCount ?? 0) > 0;
}
