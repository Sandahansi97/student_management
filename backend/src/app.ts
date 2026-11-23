// Builds the Express application: middleware first, then routes, then error handlers.
import cors from 'cors';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './docs/swagger';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import marksRoutes from './routes/marksRoutes';
import studentRoutes from './routes/studentRoutes';

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:4200' })); // allow the Angular app
app.use(express.json()); // parse JSON request bodies into req.body

app.use('/api/service/student', studentRoutes);
app.use('/api/service/marks', marksRoutes);

// API documentation: interactive Swagger UI + the raw OpenAPI JSON
app.get('/api-docs.json', (_req, res) => { res.json(swaggerSpec); });
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(notFoundHandler); // unknown URL -> 404
app.use(errorHandler);    // must be registered last

export default app;
