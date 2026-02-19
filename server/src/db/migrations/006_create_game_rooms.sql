DO $$ BEGIN
  CREATE TYPE game_room_status AS ENUM ('lobby', 'active', 'closed');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS game_rooms (
  id SERIAL PRIMARY KEY,
  room_code VARCHAR(10) UNIQUE NOT NULL,
  game_type VARCHAR(100) NOT NULL DEFAULT 'general',
  status game_room_status NOT NULL DEFAULT 'lobby',
  created_by INT REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
