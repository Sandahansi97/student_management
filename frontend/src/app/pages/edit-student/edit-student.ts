import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Student } from '../../models/student.model';
import { StudentService } from '../../services/student.service';
import { Alert } from '../../shared/alert';
import { errorMessage } from '../../shared/error-message';

@Component({
  selector: 'app-edit-student',
  imports: [FormsModule, RouterLink, Alert],
  templateUrl: './edit-student.html',
})
export class EditStudent {
  private studentService = inject(StudentService);

  searchId: number | null = null;
  student = signal<Student | null>(null); // null until a student is found
  // Signals: Angular re-renders the page automatically when a signal changes (needed for async results).
  message = signal('');
  isError = signal(false);

  private show(text: string, error: boolean) {
    this.message.set(text);
    this.isError.set(error);
  }

  search() {
    this.student.set(null);
    if (!this.searchId || this.searchId < 1) return this.show('Enter a valid student ID', true);
    this.studentService.getById(this.searchId).subscribe({
      next: (res) => { this.student.set({ ...res.data }); this.show('Student found', false); },
      error: (err: HttpErrorResponse) => this.show(errorMessage(err), true),
    });
  }

  save(form: NgForm) {
    const student = this.student();
    if (form.invalid || !student) return;
    this.studentService.update({
      studentId: student.studentId,
      studentName: student.studentName,
      homeTown: student.homeTown,
      isActive: student.isActive,
    }).subscribe({
      next: () => this.show('Student updated successfully', false),
      error: (err: HttpErrorResponse) => this.show(errorMessage(err), true),
    });
  }
}
