import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import * as http from 'http';
import { createApp } from './app';
import { initSocket } from './socket';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;

const app = createApp();
const httpServer = http.createServer(app);

initSocket(httpServer);

httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
