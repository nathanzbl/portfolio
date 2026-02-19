import pool from '../db/pool';

export async function getAllExperience() {
  const { rows } = await pool.query(
    'SELECT * FROM experience ORDER BY sort_order ASC, start_date DESC'
  );
  return rows;
}

export async function createExperience(data: {
  company: string;
  role: string;
  description?: string;
  startDate: string;
  endDate?: string;
  isCurrent?: boolean;
  sortOrder?: number;
}) {
  const { rows } = await pool.query(
    `INSERT INTO experience (company, role, description, start_date, end_date, is_current, sort_order)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [
      data.company,
      data.role,
      data.description ?? null,
      data.startDate,
      data.endDate ?? null,
      data.isCurrent ?? false,
      data.sortOrder ?? 0,
    ]
  );
  return rows[0];
}

export async function updateExperience(id: number, data: {
  company?: string;
  role?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
  sortOrder?: number;
}) {
  const { rows } = await pool.query(
    `UPDATE experience SET
      company = COALESCE($1, company),
      role = COALESCE($2, role),
      description = COALESCE($3, description),
      start_date = COALESCE($4, start_date),
      end_date = COALESCE($5, end_date),
      is_current = COALESCE($6, is_current),
      sort_order = COALESCE($7, sort_order),
      updated_at = NOW()
     WHERE id = $8
     RETURNING *`,
    [
      data.company ?? null,
      data.role ?? null,
      data.description ?? null,
      data.startDate ?? null,
      data.endDate ?? null,
      data.isCurrent ?? null,
      data.sortOrder ?? null,
      id,
    ]
  );
  return rows[0] ?? null;
}

export async function deleteExperience(id: number) {
  const { rowCount } = await pool.query('DELETE FROM experience WHERE id = $1', [id]);
  return (rowCount ?? 0) > 0;
}
