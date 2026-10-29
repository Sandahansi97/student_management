import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse, Marks, SubjectName, SubjectScore } from '../models/student.model';

@Injectable({ providedIn: 'root' })
export class MarksService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/marks`;

  getByStudentId(id: number): Observable<ApiResponse<Marks>> {
    return this.http.get<ApiResponse<Marks>>(`${this.baseUrl}/getMarksByStudentId/${id}`);
  }

  save(marks: Marks): Observable<ApiResponse<Marks>> {
    return this.http.post<ApiResponse<Marks>>(`${this.baseUrl}/save`, marks);
  }

  update(marks: Marks): Observable<ApiResponse<Marks>> {
    return this.http.patch<ApiResponse<Marks>>(`${this.baseUrl}/update`, marks);
  }

  // studentId and subjectName are sent as query parameters (POST with no body).
  getSubjectScore(studentId: number, subjectName: SubjectName): Observable<ApiResponse<SubjectScore>> {
    return this.http.post<ApiResponse<SubjectScore>>(
      `${this.baseUrl}/getSubjectScore`,
      null,
      { params: { studentId, subjectName } }
    );
  }

  delete(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.baseUrl}/delete/${id}`);
  }
}
