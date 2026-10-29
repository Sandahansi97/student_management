import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { StudentService } from '../../services/student.service';
import { Alert } from '../../shared/alert';
import { errorMessage } from '../../shared/error-message';

@Component({
  selector: 'app-add-student',
  imports: [FormsModule, RouterLink, Alert],
  templateUrl: './add-student.html',
})
export class AddStudent {
  private studentService = inject(StudentService);

  studentName = '';
  homeTown = '';
  isActive = true;
  // Signals: Angular re-renders the page automatically when a signal changes (needed for async results).
  message = signal('');
  isError = signal(false);
  saving = signal(false);

  submit(form: NgForm) {
    if (form.invalid) return;
    this.saving.set(true);
    this.studentService
      .save({ studentName: this.studentName, homeTown: this.homeTown, isActive: this.isActive })
      .subscribe({
        next: (res) => {
          this.saving.set(false);
          this.isError.set(false);
          this.message.set(`Student saved with ID ${res.data.studentId}`);
          form.resetForm({ isActive: true });
        },
        error: (err: HttpErrorResponse) => {
          this.saving.set(false);
          this.isError.set(true);
          this.message.set(errorMessage(err));
        },
      });
  }
}
