// MODEL: describes what a student looks like.
// A CLASS is a blueprint; each "new Student(...)" creates an OBJECT (one student).

// Interface: the shape of a row as it comes out of PostgreSQL (snake_case column names).
export interface StudentRow {
  student_id: number;
  student_name: string;
  home_town: string;
  created_on: Date;
  is_active: boolean;
}

export class Student {
  // Constructor with "parameter properties": declares and assigns the fields in one go.
  constructor(
    public studentId: number,
    public studentName: string,
    public homeTown: string,
    public createdOn: Date,
    public isActive: boolean
  ) {}

  // A static factory method: builds a Student object from a database row.
  static fromRow(row: StudentRow): Student {
    return new Student(row.student_id, row.student_name, row.home_town, row.created_on, row.is_active);
  }
}
