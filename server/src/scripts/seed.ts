import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

import * as bcrypt from 'bcryptjs';
import * as readline from 'readline';
import pool from '../db/pool';

async function seed() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const ask = (q: string) =>
    new Promise<string>((resolve) => rl.question(q, resolve));

  const username = (await ask('Admin username [admin]: ')).trim() || 'admin';
  const password = await ask('Admin password: ');
  rl.close();

  if (!password) {
    console.error('Password cannot be empty');
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await pool.query(
    `INSERT INTO users (username, password_hash)
     VALUES ($1, $2)
     ON CONFLICT (username) DO UPDATE SET password_hash = EXCLUDED.password_hash`,
    [username, passwordHash]
  );

  console.log(`✓ Admin user "${username}" created/updated.`);
  await pool.end();
}

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
