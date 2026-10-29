import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse, Student } from '../models/student.model';

// An Angular service: one class that talks to the student endpoints using HttpClient.
@Injectable({ providedIn: 'root' })
export class StudentService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/student`;

  getAll(): Observable<ApiResponse<Student[]>> {
    return this.http.get<ApiResponse<Student[]>>(`${this.baseUrl}/getAll`);
  }

  getById(id: number): Observable<ApiResponse<Student>> {
    return this.http.get<ApiResponse<Student>>(`${this.baseUrl}/getStudentByID/${id}`);
  }

  save(student: { studentName: string; homeTown: string; isActive: boolean }): Observable<ApiResponse<Student>> {
    return this.http.post<ApiResponse<Student>>(`${this.baseUrl}/save`, student);
  }

  update(student: Partial<Student> & { studentId: number }): Observable<ApiResponse<Student>> {
    return this.http.patch<ApiResponse<Student>>(`${this.baseUrl}/update`, student);
  }
}
