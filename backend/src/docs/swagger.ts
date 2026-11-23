// OpenAPI 3.0 specification for the Student Management API.
// Served as an interactive page at /api-docs and as raw JSON at /api-docs.json (see app.ts).
// Keep this in sync with the routes in src/routes and the validation in the controllers.

const errorResponse = (description: string, example: string) => ({
  description,
  content: {
    'application/json': {
      schema: { $ref: '#/components/schemas/ErrorResponse' },
      example: { success: false, message: example },
    },
  },
});

// Builds a success response whose "data" field uses the given schema.
const successResponse = (description: string, message: string, data: object) => ({
  description,
  content: {
    'application/json': {
      schema: {
        type: 'object',
        required: ['success', 'message', 'data'],
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: message },
          data,
        },
      },
    },
  },
});

const idPathParam = (description: string) => ({
  name: 'id',
  in: 'path',
  required: true,
  description,
  schema: { type: 'integer', minimum: 1, maximum: 2147483647, example: 1 },
});

const serverError = { $ref: '#/components/responses/ServerError' };
const badRequest = { $ref: '#/components/responses/BadRequest' };

const studentRef = { $ref: '#/components/schemas/Student' };
const marksRef = { $ref: '#/components/schemas/Marks' };

export const swaggerSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Student Management API',
    version: '1.0.0',
    description:
      'REST API for managing students and their marks (maths, english, science).\n\n' +
      'Every response uses the same envelope: `{ success, message, data? }`. ' +
      'On errors, `success` is `false` and `message` explains what went wrong.',
  },
  servers: [{ url: '/', description: 'This server' }],
  tags: [
    { name: 'Students', description: 'Create, read, update and delete students' },
    { name: 'Marks', description: 'Manage the marks record of a student (one record per student)' },
  ],
  paths: {
    // ---------- Students ----------
    '/api/service/student/getAll': {
      get: {
        tags: ['Students'],
        summary: 'Get all students',
        description: 'Returns every student, ordered by studentId.',
        operationId: 'getAllStudents',
        responses: {
          200: successResponse('List of students', 'Students retrieved', { type: 'array', items: studentRef }),
          500: serverError,
        },
      },
    },
    '/api/service/student/getStudentByID/{id}': {
      get: {
        tags: ['Students'],
        summary: 'Get a student by ID',
        operationId: 'getStudentByID',
        parameters: [idPathParam('The studentId')],
        responses: {
          200: successResponse('The student', 'Student retrieved', studentRef),
          400: errorResponse('Invalid id', 'id must be a positive whole number'),
          404: errorResponse('Student not found', 'Student with id 1 not found'),
          500: serverError,
        },
      },
    },
    '/api/service/student/save': {
      post: {
        tags: ['Students'],
        summary: 'Create a student',
        operationId: 'saveStudent',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateStudentRequest' } } },
        },
        responses: {
          201: successResponse('Student created', 'Student created', studentRef),
          400: badRequest,
          500: serverError,
        },
      },
    },
    '/api/service/student/update': {
      patch: {
        tags: ['Students'],
        summary: 'Update a student (partial)',
        description: 'Only the fields you send are changed. At least one of studentName, homeTown or isActive is required.',
        operationId: 'updateStudent',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateStudentRequest' } } },
        },
        responses: {
          200: successResponse('Student updated', 'Student updated', studentRef),
          400: badRequest,
          404: errorResponse('Student not found', 'Student with id 1 not found'),
          500: serverError,
        },
      },
    },
    '/api/service/student/delete/{id}': {
      delete: {
        tags: ['Students'],
        summary: 'Delete a student',
        description: "Deletes the student and returns the deleted record. The student's marks are deleted too (ON DELETE CASCADE).",
        operationId: 'deleteStudent',
        parameters: [idPathParam('The studentId')],
        responses: {
          200: successResponse('Student deleted', 'Student deleted', studentRef),
          400: errorResponse('Invalid id', 'id must be a positive whole number'),
          404: errorResponse('Student not found', 'Student with id 1 not found'),
          500: serverError,
        },
      },
    },

    // ---------- Marks ----------
    '/api/service/marks/getMarksByStudentId/{id}': {
      get: {
        tags: ['Marks'],
        summary: "Get a student's marks",
        operationId: 'getMarksByStudentId',
        parameters: [idPathParam('The studentId')],
        responses: {
          200: successResponse('The marks record', 'Marks retrieved', marksRef),
          400: errorResponse('Invalid id', 'id must be a positive whole number'),
          404: errorResponse('No marks for this student', 'No marks found for student id 1'),
          500: serverError,
        },
      },
    },
    '/api/service/marks/save': {
      post: {
        tags: ['Marks'],
        summary: 'Create marks for a student',
        description: 'The student must exist and must not already have marks (use update instead).',
        operationId: 'saveMarks',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateMarksRequest' } } },
        },
        responses: {
          201: successResponse('Marks created', 'Marks created', marksRef),
          400: badRequest,
          404: errorResponse('Student not found', 'Student with id 1 not found'),
          409: errorResponse('Marks already exist', 'Marks already exist for student id 1. Use update instead'),
          500: serverError,
        },
      },
    },
    '/api/service/marks/update': {
      patch: {
        tags: ['Marks'],
        summary: 'Update marks (partial)',
        description: 'Only the scores you send are changed. At least one score is required.',
        operationId: 'updateMarks',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateMarksRequest' } } },
        },
        responses: {
          200: successResponse('Marks updated', 'Marks updated', marksRef),
          400: badRequest,
          404: errorResponse('No marks for this student', 'No marks found for student id 1'),
          500: serverError,
        },
      },
    },
    '/api/service/marks/getSubjectScore': {
      post: {
        tags: ['Marks'],
        summary: 'Get the score of one subject',
        description: 'Inputs are read from the **query string**, not the body. No request body is needed.',
        operationId: 'getSubjectScore',
        parameters: [
          {
            name: 'studentId',
            in: 'query',
            required: true,
            schema: { type: 'integer', minimum: 1, maximum: 2147483647, example: 1 },
          },
          {
            name: 'subjectName',
            in: 'query',
            required: true,
            description: 'Case-insensitive',
            schema: { $ref: '#/components/schemas/SubjectName' },
          },
        ],
        responses: {
          200: successResponse('The subject score', 'Subject score retrieved', {
            $ref: '#/components/schemas/SubjectScore',
          }),
          400: errorResponse('Invalid studentId or subjectName', 'subjectName must be one of: maths, english, science'),
          404: errorResponse('No marks for this student', 'No marks found for student id 1'),
          500: serverError,
        },
      },
    },
    '/api/service/marks/delete/{id}': {
      delete: {
        tags: ['Marks'],
        summary: "Delete a student's marks",
        operationId: 'deleteMarks',
        parameters: [idPathParam('The studentId whose marks are deleted')],
        responses: {
          200: {
            description: 'Marks deleted (no data returned)',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/MessageResponse' },
                example: { success: true, message: 'Marks deleted' },
              },
            },
          },
          400: errorResponse('Invalid id', 'id must be a positive whole number'),
          404: errorResponse('No marks for this student', 'No marks found for student id 1'),
          500: serverError,
        },
      },
    },
  },

  components: {
    schemas: {
      Student: {
        type: 'object',
        properties: {
          studentId: { type: 'integer', example: 1 },
          studentName: { type: 'string', example: 'Nimal Perera' },
          homeTown: { type: 'string', example: 'Kandy' },
          createdOn: { type: 'string', format: 'date-time', example: '2026-11-18T08:30:00.000Z' },
          isActive: { type: 'boolean', example: true },
        },
      },
      CreateStudentRequest: {
        type: 'object',
        required: ['studentName', 'homeTown'],
        properties: {
          studentName: { type: 'string', minLength: 1, maxLength: 100, example: 'Nimal Perera' },
          homeTown: { type: 'string', minLength: 1, maxLength: 100, example: 'Kandy' },
          isActive: { type: 'boolean', default: true, description: 'Defaults to true when omitted' },
        },
      },
      UpdateStudentRequest: {
        type: 'object',
        required: ['studentId'],
        properties: {
          studentId: { type: 'integer', minimum: 1, example: 1 },
          studentName: { type: 'string', minLength: 1, maxLength: 100, example: 'Nimal Perera' },
          homeTown: { type: 'string', minLength: 1, maxLength: 100, example: 'Galle' },
          isActive: { type: 'boolean', example: false },
        },
      },
      Marks: {
        type: 'object',
        properties: {
          studentId: { type: 'integer', example: 1 },
          mathsScore: { type: 'number', example: 85 },
          englishScore: { type: 'number', example: 72.5 },
          scienceScore: { type: 'number', example: 90 },
          total: { type: 'number', description: 'Sum of the three scores', example: 247.5 },
          average: { type: 'number', description: 'Average, rounded to 2 decimals', example: 82.5 },
        },
      },
      CreateMarksRequest: {
        type: 'object',
        required: ['studentId', 'mathsScore', 'englishScore', 'scienceScore'],
        properties: {
          studentId: { type: 'integer', minimum: 1, example: 1 },
          mathsScore: { type: 'number', minimum: 0, maximum: 100, example: 85 },
          englishScore: { type: 'number', minimum: 0, maximum: 100, example: 72.5 },
          scienceScore: { type: 'number', minimum: 0, maximum: 100, example: 90 },
        },
      },
      UpdateMarksRequest: {
        type: 'object',
        required: ['studentId'],
        properties: {
          studentId: { type: 'integer', minimum: 1, example: 1 },
          mathsScore: { type: 'number', minimum: 0, maximum: 100, example: 88 },
          englishScore: { type: 'number', minimum: 0, maximum: 100 },
          scienceScore: { type: 'number', minimum: 0, maximum: 100 },
        },
      },
      SubjectName: { type: 'string', enum: ['maths', 'english', 'science'], example: 'maths' },
      SubjectScore: {
        type: 'object',
        properties: {
          studentId: { type: 'integer', example: 1 },
          subjectName: { $ref: '#/components/schemas/SubjectName' },
          score: { type: 'number', example: 85 },
        },
      },
      MessageResponse: {
        type: 'object',
        required: ['success', 'message'],
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string' },
        },
      },
      ErrorResponse: {
        type: 'object',
        required: ['success', 'message'],
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string' },
        },
      },
    },
    responses: {
      BadRequest: errorResponse('Validation failed or the JSON body is malformed', 'studentName is required and must be a non-empty string'),
      ServerError: errorResponse('Unexpected server or database failure', 'Internal server error (database or server failure)'),
    },
  },
};
