import { Routes } from '@angular/router';
import { AddScores } from './pages/add-scores/add-scores';
import { AddStudent } from './pages/add-student/add-student';
import { EditStudent } from './pages/edit-student/edit-student';
import { Home } from './pages/home/home';
import { UpdateScores } from './pages/update-scores/update-scores';
import { ViewScores } from './pages/view-scores/view-scores';
import { ViewStudents } from './pages/view-students/view-students';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'add-student', component: AddStudent },
  { path: 'edit-student', component: EditStudent },
  { path: 'students', component: ViewStudents },
  { path: 'add-scores', component: AddScores },
  { path: 'update-scores', component: UpdateScores },
  { path: 'view-scores', component: ViewScores },
  { path: '**', redirectTo: '' },
];
