import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  // An array of objects drives the six navigation cards (rendered with @for in the template).
  cards = [
    { title: 'Add New Student', icon: '➕', link: '/add-student' },
    { title: 'Edit Student Data', icon: '✏️', link: '/edit-student' },
    { title: 'View All Students', icon: '📋', link: '/students' },
    { title: 'Add Student Scores', icon: '📝', link: '/add-scores' },
    { title: 'Update Student Scores', icon: '🔄', link: '/update-scores' },
    { title: 'View Student Scores', icon: '📊', link: '/view-scores' },
  ];
}
