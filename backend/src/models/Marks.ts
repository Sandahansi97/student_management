// MODEL: marks for one student (one record holding three subjects).

// The only subjects the API accepts. A "union type" limits a value to these exact strings.
export type SubjectName = 'maths' | 'english' | 'science';

export const SUBJECTS: SubjectName[] = ['maths', 'english', 'science'];

// Maps a subject name to its database column. Only these fixed column names are ever put in SQL,
// so user input can never be injected into the query text.
export const SUBJECT_COLUMNS: Record<SubjectName, string> = {
  maths: 'maths_score',
  english: 'english_score',
  science: 'science_score',
};

// PostgreSQL returns NUMERIC values as strings, so we type them as string here and convert with Number().
export interface MarksRow {
  student_id: number;
  maths_score: string;
  english_score: string;
  science_score: string;
}

// ABSTRACTION + ENCAPSULATION: the total/average logic lives inside the class.
export class Marks {
  constructor(
    public studentId: number,
    public mathsScore: number,
    public englishScore: number,
    public scienceScore: number
  ) {}

  static fromRow(row: MarksRow): Marks {
    return new Marks(
      row.student_id,
      Number(row.maths_score),
      Number(row.english_score),
      Number(row.science_score)
    );
  }

  get total(): number {
    return this.mathsScore + this.englishScore + this.scienceScore;
  }

  get average(): number {
    return Math.round((this.total / 3) * 100) / 100;
  }

  // Included in the JSON sent to the client (getters are not serialised by default).
  toJSON() {
    return {
      studentId: this.studentId,
      mathsScore: this.mathsScore,
      englishScore: this.englishScore,
      scienceScore: this.scienceScore,
      total: this.total,
      average: this.average,
    };
  }
}
