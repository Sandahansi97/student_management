import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Marks } from '../../models/student.model';
import { MarksService } from '../../services/marks.service';
import { Alert } from '../../shared/alert';
import { errorMessage } from '../../shared/error-message';

@Component({
  selector: 'app-update-scores',
  imports: [FormsModule, RouterLink, Alert],
  templateUrl: './update-scores.html',
})
export class UpdateScores {
  private marksService = inject(MarksService);

  searchId: number | null = null;
  marks = signal<Marks | null>(null);
  // Signals: Angular re-renders the page automatically when a signal changes (needed for async results).
  message = signal('');
  isError = signal(false);

  private show(text: string, error: boolean) {
    this.message.set(text);
    this.isError.set(error);
  }

  search() {
    this.marks.set(null);
    if (!this.searchId || this.searchId < 1) return this.show('Enter a valid student ID', true);
    this.marksService.getByStudentId(this.searchId).subscribe({
      next: (res) => { this.marks.set({ ...res.data }); this.show('Marks found', false); },
      error: (err: HttpErrorResponse) => this.show(errorMessage(err), true),
    });
  }

  save(form: NgForm) {
    const marks = this.marks();
    if (form.invalid || !marks) return;
    this.marksService.update(marks).subscribe({
      next: () => this.show('Scores updated successfully', false),
      error: (err: HttpErrorResponse) => this.show(errorMessage(err), true),
    });
  }
}
