import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Student } from '../../models/student.model';
import { StudentService } from '../../services/student.service';
import { Alert } from '../../shared/alert';
import { errorMessage } from '../../shared/error-message';

@Component({
  selector: 'app-view-students',
  imports: [RouterLink, DatePipe, Alert],
  templateUrl: './view-students.html',
})
export class ViewStudents implements OnInit {
  private studentService = inject(StudentService);

  students = signal<Student[]>([]);
  loading = signal(true);
  error = signal('');

  // ngOnInit runs once when the page opens: load the data.
  ngOnInit() {
    this.studentService.getAll().subscribe({
      next: (res) => { this.students.set(res.data); this.loading.set(false); },
      error: (err: HttpErrorResponse) => { this.error.set(errorMessage(err)); this.loading.set(false); },
    });
  }
}
