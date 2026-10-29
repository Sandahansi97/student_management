// MIDDLEWARE/validation helpers: small functions that check input and throw BadRequestError.
import { BadRequestError } from '../models/AppError';
import { SUBJECTS, SubjectName } from '../models/Marks';

// Accepts a positive whole number (from a string or number); returns it as a number.
export function parseId(value: unknown, fieldName = 'id'): number {
  const text = String(value ?? '').trim();
  if (!/^[1-9]\d*$/.test(text)) {
    throw new BadRequestError(`${fieldName} must be a positive whole number`);
  }
  const id = Number(text);
  if (!Number.isSafeInteger(id) || id > 2147483647) {
    throw new BadRequestError(`${fieldName} is too large`);
  }
  return id;
}

export function requireText(value: unknown, fieldName: string): string {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new BadRequestError(`${fieldName} is required and must be a non-empty string`);
  }
  if (value.trim().length > 100) {
    throw new BadRequestError(`${fieldName} must be at most 100 characters`);
  }
  return value.trim();
}

export function requireBoolean(value: unknown, fieldName: string): boolean {
  if (typeof value !== 'boolean') {
    throw new BadRequestError(`${fieldName} must be true or false`);
  }
  return value;
}

// A score must be a real number between 0 and 100.
export function requireScore(value: unknown, fieldName: string): number {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > 100) {
    throw new BadRequestError(`${fieldName} must be a number between 0 and 100`);
  }
  return value;
}

export function parseSubject(value: unknown): SubjectName {
  const name = String(value ?? '').trim().toLowerCase();
  if (!(SUBJECTS as string[]).includes(name)) {
    throw new BadRequestError(`subjectName must be one of: ${SUBJECTS.join(', ')}`);
  }
  return name as SubjectName;
}

// Makes sure the request body is a JSON object.
export function requireBody(body: unknown): Record<string, unknown> {
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    throw new BadRequestError('Request body must be a JSON object');
  }
  return body as Record<string, unknown>;
}
