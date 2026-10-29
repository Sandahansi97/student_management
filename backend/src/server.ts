// Entry point: check the database, then start listening.
import 'dotenv/config';
import app from './app';
import { verifyConnection } from './database/db';

const port = Number(process.env.PORT || 3000);

verifyConnection()
  .then(() => app.listen(port, () => console.log(`API running at http://localhost:${port}/api`)))
  .catch((err) => {
    console.error('Could not connect to PostgreSQL. Check your .env settings:', err.message);
    process.exit(1);
  });
