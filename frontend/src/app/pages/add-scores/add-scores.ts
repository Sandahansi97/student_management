import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MarksService } from '../../services/marks.service';
import { Alert } from '../../shared/alert';
import { errorMessage } from '../../shared/error-message';

@Component({
  selector: 'app-add-scores',
  imports: [FormsModule, RouterLink, Alert],
  templateUrl: './add-scores.html',
})
export class AddScores {
  private marksService = inject(MarksService);

  studentId: number | null = null;
  mathsScore: number | null = null;
  englishScore: number | null = null;
  scienceScore: number | null = null;
  // Signals: Angular re-renders the page automatically when a signal changes (needed for async results).
  message = signal('');
  isError = signal(false);

  submit(form: NgForm) {
    if (form.invalid) return;
    this.marksService.save({
      studentId: this.studentId!,
      mathsScore: this.mathsScore!,
      englishScore: this.englishScore!,
      scienceScore: this.scienceScore!,
    }).subscribe({
      next: () => { this.isError.set(false); this.message.set('Scores saved successfully'); form.resetForm(); },
      error: (err: HttpErrorResponse) => { this.isError.set(true); this.message.set(errorMessage(err)); },
    });
  }
}
