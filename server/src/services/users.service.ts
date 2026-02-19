import bcrypt from 'bcryptjs';
import pool from '../db/pool';

export async function getAllUsers() {
  const { rows } = await pool.query(
    'SELECT id, username, created_at FROM users ORDER BY id ASC'
  );
  return rows;
}

export async function createUser(username: string, password: string) {
  const passwordHash = await bcrypt.hash(password, 12);
  const { rows } = await pool.query(
    `INSERT INTO users (username, password_hash)
     VALUES ($1, $2)
     RETURNING id, username, created_at`,
    [username, passwordHash]
  );
  return rows[0];
}

export async function updateUser(
  id: number,
  data: { username?: string; password?: string }
) {
  let passwordHash: string | undefined;
  if (data.password) {
    passwordHash = await bcrypt.hash(data.password, 12);
  }

  const { rows } = await pool.query(
    `UPDATE users SET
      username     = COALESCE($1, username),
      password_hash = COALESCE($2, password_hash)
     WHERE id = $3
     RETURNING id, username, created_at`,
    [data.username ?? null, passwordHash ?? null, id]
  );
  return rows[0] ?? null;
}

export async function deleteUser(id: number) {
  const { rowCount } = await pool.query('DELETE FROM users WHERE id = $1', [id]);
  return (rowCount ?? 0) > 0;
}
