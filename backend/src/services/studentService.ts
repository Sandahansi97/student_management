// SERVICE: application logic + SQL for students. No Express code here (no req/res).
// All SQL uses parameters ($1, $2...) so user input is never pasted into the query text.
import { pool } from '../database/db';
import { NotFoundError, BadRequestError } from '../models/AppError';
import { Student, StudentRow } from '../models/Student';

export class StudentService {
  async getAll(): Promise<Student[]> {
    const result = await pool.query<StudentRow>('SELECT * FROM student ORDER BY student_id');
    return result.rows.map(Student.fromRow);
  }

  async getById(id: number): Promise<Student> {
    const result = await pool.query<StudentRow>('SELECT * FROM student WHERE student_id = $1', [id]);
    if (result.rows.length === 0) throw new NotFoundError(`Student with id ${id} not found`);
    return Student.fromRow(result.rows[0]);
  }

  async create(name: string, homeTown: string, isActive: boolean): Promise<Student> {
    const result = await pool.query<StudentRow>(
      'INSERT INTO student (student_name, home_town, is_active) VALUES ($1, $2, $3) RETURNING *',
      [name, homeTown, isActive]
    );
    return Student.fromRow(result.rows[0]);
  }

  // Partial update: only the fields present in "changes" are updated.
  async update(
    id: number,
    changes: { studentName?: string; homeTown?: string; isActive?: boolean }
  ): Promise<Student> {
    const columns: Record<string, unknown> = {
      student_name: changes.studentName,
      home_town: changes.homeTown,
      is_active: changes.isActive,
    };
    const setParts: string[] = [];
    const values: unknown[] = [];
    for (const [column, value] of Object.entries(columns)) {
      if (value !== undefined) {
        values.push(value);
        setParts.push(`${column} = $${values.length}`); // column names are fixed above, values are parameters
      }
    }
    if (setParts.length === 0) throw new BadRequestError('Provide at least one field to update');

    values.push(id);
    const result = await pool.query<StudentRow>(
      `UPDATE student SET ${setParts.join(', ')} WHERE student_id = $${values.length} RETURNING *`,
      values
    );
    if (result.rows.length === 0) throw new NotFoundError(`Student with id ${id} not found`);
    return Student.fromRow(result.rows[0]);
  }
}

export const studentService = new StudentService(); // one shared object (instance)
