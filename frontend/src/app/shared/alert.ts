import { Component, input } from '@angular/core';

// Reusable success/error message box.
@Component({
  selector: 'app-alert',
  template: `@if (text()) { <div class="alert" [class.error]="isError()" role="alert">{{ text() }}</div> }`,
  styles: [`
    .alert { padding: 10px 14px; border-radius: 6px; margin: 12px 0; background: #e6f4ea; color: #1e6b34; border: 1px solid #b7dfc2; }
    .alert.error { background: #fdecea; color: #a12622; border-color: #f5c2bf; }
  `],
})
export class Alert {
  text = input<string>('');
  isError = input<boolean>(false);
}
