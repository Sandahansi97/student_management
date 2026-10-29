import { HttpErrorResponse } from '@angular/common/http';

// Turns an HTTP error into a friendly message (uses the backend's message when there is one).
export function errorMessage(err: HttpErrorResponse): string {
  if (err.status === 0) return 'Cannot reach the server. Is the backend running?';
  return err.error?.message ?? 'Something went wrong';
}
