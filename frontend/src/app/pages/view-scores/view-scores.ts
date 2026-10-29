import { HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Marks, Student, SubjectName } from '../../models/student.model';
import { MarksService } from '../../services/marks.service';
import { StudentService } from '../../services/student.service';
import { Alert } from '../../shared/alert';
import { errorMessage } from '../../shared/error-message';

@Component({
  selector: 'app-view-scores',
  imports: [FormsModule, RouterLink, DatePipe, Alert],
  templateUrl: './view-scores.html',
})
export class ViewScores {
  private studentService = inject(StudentService);
  private marksService = inject(MarksService);

  searchId: number | null = null;
  student = signal<Student | null>(null);
  marks = signal<Marks | null>(null);
  subject: SubjectName = 'maths';
  subjectResult = signal('');
  // Signals: Angular re-renders the page automatically when a signal changes (needed for async results).
  message = signal('');
  isError = signal(false);

  private show(text: string, error: boolean) {
    this.message.set(text);
    this.isError.set(error);
  }

  search() {
    this.student.set(null);
    this.marks.set(null);
    this.subjectResult.set('');
    if (!this.searchId || this.searchId < 1) return this.show('Enter a valid student ID', true);
    // Fetch student details and marks at the same time.
    forkJoin([
      this.studentService.getById(this.searchId),
      this.marksService.getByStudentId(this.searchId),
    ]).subscribe({
      next: ([s, m]) => { this.student.set(s.data); this.marks.set(m.data); this.show('', false); },
      error: (err: HttpErrorResponse) => this.show(errorMessage(err), true),
    });
  }

  getSubjectScore() {
    const student = this.student();
    if (!student) return;
    this.marksService.getSubjectScore(student.studentId, this.subject).subscribe({
      next: (res) => { this.subjectResult.set(`${this.subject}: ${res.data.score}`); this.show('', false); },
      error: (err: HttpErrorResponse) => this.show(errorMessage(err), true),
    });
  }

  deleteMarks() {
    const student = this.student();
    if (!student) return;
    if (!confirm(`Delete the marks of student ${student.studentId}? This cannot be undone.`)) return;
    this.marksService.delete(student.studentId).subscribe({
      next: () => { this.marks.set(null); this.subjectResult.set(''); this.show('Marks deleted successfully', false); },
      error: (err: HttpErrorResponse) => this.show(errorMessage(err), true),
    });
  }
}
