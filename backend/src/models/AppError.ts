// INHERITANCE: AppError "extends" the built-in Error class, adding an HTTP status code.
// Services throw AppError; the error-handling middleware turns it into an HTTP response.
export class AppError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = 'AppError';
  }
}

// POLYMORPHISM: each subclass is an AppError, but has its own fixed status code.
export class BadRequestError extends AppError {
  constructor(message: string) { super(400, message); }
}
export class NotFoundError extends AppError {
  constructor(message: string) { super(404, message); }
}
export class ConflictError extends AppError {
  constructor(message: string) { super(409, message); }
}
