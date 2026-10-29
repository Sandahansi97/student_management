// SERVICE: application logic + SQL for marks.
import { pool } from '../database/db';
import { ConflictError, NotFoundError, BadRequestError } from '../models/AppError';
import { Marks, MarksRow, SubjectName, SUBJECT_COLUMNS } from '../models/Marks';

export interface Scores {
  mathsScore?: number;
  englishScore?: number;
  scienceScore?: number;
}

export class MarksService {
  async getByStudentId(studentId: number): Promise<Marks> {
    const result = await pool.query<MarksRow>('SELECT * FROM marks WHERE student_id = $1', [studentId]);
    if (result.rows.length === 0) throw new NotFoundError(`No marks found for student id ${studentId}`);
    return Marks.fromRow(result.rows[0]);
  }

  private async assertStudentExists(studentId: number): Promise<void> {
    const result = await pool.query('SELECT 1 FROM student WHERE student_id = $1', [studentId]);
    if (result.rows.length === 0) throw new NotFoundError(`Student with id ${studentId} not found`);
  }

  async create(studentId: number, scores: Required<Scores>): Promise<Marks> {
    await this.assertStudentExists(studentId);
    const existing = await pool.query('SELECT 1 FROM marks WHERE student_id = $1', [studentId]);
    if (existing.rows.length > 0) {
      throw new ConflictError(`Marks already exist for student id ${studentId}. Use update instead`);
    }
    const result = await pool.query<MarksRow>(
      `INSERT INTO marks (student_id, maths_score, english_score, science_score)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [studentId, scores.mathsScore, scores.englishScore, scores.scienceScore]
    );
    return Marks.fromRow(result.rows[0]);
  }

  // Partial update. COALESCE keeps the old value when the new one is NULL (not supplied).
  async update(studentId: number, scores: Scores): Promise<Marks> {
    if (scores.mathsScore === undefined && scores.englishScore === undefined && scores.scienceScore === undefined) {
      throw new BadRequestError('Provide at least one score to update');
    }
    const result = await pool.query<MarksRow>(
      `UPDATE marks SET
         maths_score   = COALESCE($1, maths_score),
         english_score = COALESCE($2, english_score),
         science_score = COALESCE($3, science_score)
       WHERE student_id = $4 RETURNING *`,
      [scores.mathsScore ?? null, scores.englishScore ?? null, scores.scienceScore ?? null, studentId]
    );
    if (result.rows.length === 0) throw new NotFoundError(`No marks found for student id ${studentId}`);
    return Marks.fromRow(result.rows[0]);
  }

  async getSubjectScore(studentId: number, subject: SubjectName): Promise<number> {
    const column = SUBJECT_COLUMNS[subject]; // safe: comes from our fixed whitelist
    const result = await pool.query(`SELECT ${column} AS score FROM marks WHERE student_id = $1`, [studentId]);
    if (result.rows.length === 0) throw new NotFoundError(`No marks found for student id ${studentId}`);
    return Number(result.rows[0].score);
  }

  async delete(studentId: number): Promise<void> {
    const result = await pool.query('DELETE FROM marks WHERE student_id = $1', [studentId]);
    if (result.rowCount === 0) throw new NotFoundError(`No marks found for student id ${studentId}`);
  }
}

export const marksService = new MarksService();
