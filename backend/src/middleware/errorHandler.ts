// MIDDLEWARE: centralised error handling. Any error thrown (or passed to next()) ends up here.
import { NextFunction, Request, Response } from 'express';
import { AppError } from '../models/AppError';

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });
}

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction): void {
  // Expected errors (validation, missing record, duplicate)
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ success: false, message: err.message });
    return;
  }
  // Malformed JSON body
  if (err?.type === 'entity.parse.failed') {
    res.status(400).json({ success: false, message: 'Invalid JSON in request body' });
    return;
  }
  // Anything else is unexpected (e.g. database down): log details, hide them from the client.
  console.error('Unexpected error:', err);
  res.status(500).json({ success: false, message: 'Internal server error (database or server failure)' });
}
