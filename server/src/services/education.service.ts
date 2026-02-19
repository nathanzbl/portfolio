import pool from '../db/pool';

export async function getAllEducation() {
  const { rows } = await pool.query(
    'SELECT * FROM education ORDER BY start_date DESC'
  );
  return rows;
}

export async function createEducation(data: {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
}) {
  const { rows } = await pool.query(
    `INSERT INTO education (institution, degree, field, start_date, end_date)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [data.institution, data.degree, data.field, data.startDate, data.endDate ?? null]
  );
  return rows[0];
}

export async function updateEducation(id: number, data: {
  institution?: string;
  degree?: string;
  field?: string;
  startDate?: string;
  endDate?: string;
}) {
  const { rows } = await pool.query(
    `UPDATE education SET
      institution = COALESCE($1, institution),
      degree = COALESCE($2, degree),
      field = COALESCE($3, field),
      start_date = COALESCE($4, start_date),
      end_date = COALESCE($5, end_date),
      updated_at = NOW()
     WHERE id = $6
     RETURNING *`,
    [
      data.institution ?? null,
      data.degree ?? null,
      data.field ?? null,
      data.startDate ?? null,
      data.endDate ?? null,
      id,
    ]
  );
  return rows[0] ?? null;
}

export async function deleteEducation(id: number) {
  const { rowCount } = await pool.query('DELETE FROM education WHERE id = $1', [id]);
  return (rowCount ?? 0) > 0;
}
