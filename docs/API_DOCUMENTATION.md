# API Documentation

Base URL: `http://localhost:3000/api/service`. All responses are JSON:
`{ "success": true|false, "message": "...", "data": ... }` (`data` absent on errors).

Status codes: **200** OK · **201** created · **400** invalid input · **404** record not found · **409** duplicate marks record · **500** database/server failure (`Internal server error ...`). Unknown URL → 404.

Student JSON: `{ "studentId":1, "studentName":"Nimal Perera", "homeTown":"Colombo", "createdOn":"2026-10-27T10:00:00.000Z", "isActive":true }`
Marks JSON: `{ "studentId":1, "mathsScore":85.5, "englishScore":78, "scienceScore":90.25, "total":253.75, "average":84.58 }`

## Student

### GET `/student/getAll` — all students
200: `{ "success":true, "message":"Students retrieved", "data":[ {student}, ... ] }` (empty array if none). 500 on DB failure.

### GET `/student/getStudentByID/:id`
Example: `/student/getStudentByID/1` → 200 with `data` = student.
400 `id must be a positive whole number` · 404 `Student with id 99999 not found`.

### POST `/student/save`
Body: `{ "studentName":"Test Student", "homeTown":"Matara", "isActive":true }` (`isActive` optional, default true).
201: `{ "success":true, "message":"Student created", "data":{student} }`.
400: missing/empty/over-100-char name or town, non-boolean `isActive`, malformed JSON.

### PATCH `/student/update`
Body (partial): `{ "studentId":1, "homeTown":"Jaffna" }` — any of studentName, homeTown, isActive.
200: `"Student updated"` + updated student. 400: bad/missing `studentId`, invalid field, or no field given. 404: unknown student.

## Marks

### GET `/marks/getMarksByStudentId/:id`
200 `data` = marks. 400 invalid id · 404 `No marks found for student id 99999`.

### POST `/marks/save`
Body: `{ "studentId":3, "mathsScore":70, "englishScore":65.5, "scienceScore":80 }`
201 `"Marks created"`. 400 score missing / not a number / outside 0–100 / bad id · 404 student doesn't exist · 409 marks already exist for the student.

### PATCH `/marks/update`
Body (partial): `{ "studentId":1, "mathsScore":99.5 }`. 200 `"Marks updated"`. 400 out-of-range score or no score given · 404 no marks record.

### POST `/marks/getSubjectScore?studentId=1&subjectName=maths`
Parameters are **query parameters** read from `req.query`; no body. `subjectName` ∈ `maths | english | science` (case-insensitive).
200: `{ "success":true, "message":"Subject score retrieved", "data":{ "studentId":1, "subjectName":"maths", "score":85.5 } }`. 400 invalid/missing params · 404 no marks.

### DELETE `/marks/delete/:id` — delete marks by student ID
200 `{ "success":true, "message":"Marks deleted" }` · 400 invalid id · 404 no marks.

## Manual test cases (positive / negative / edge)
Assumes sample data (students 1–3; marks for 1 and 2). The Postman collection automates these, in this order.

| # | Request | Expected |
|---|---|---|
| 1 | GET student/getAll | 200, array |
| 2 | GET student/getStudentByID/1 | 200 |
| 3 | GET student/getStudentByID/99999 | 404 |
| 4 | GET student/getStudentByID/abc | 400 |
| 5 | POST student/save valid | 201 |
| 6 | POST student/save missing studentName | 400 |
| 7 | POST student/save `isActive:"yes"` | 400 |
| 8 | POST student/save malformed JSON | 400 |
| 9 | PATCH student/update `{studentId:1,homeTown:"Jaffna"}` | 200 |
| 10 | PATCH student/update unknown id / no fields / missing id | 404 / 400 / 400 |
| 11 | POST marks/save student 3 valid | 201 |
| 12 | POST marks/save again for same student | 409 |
| 13 | POST marks/save score 101, -1, "50" (string) | 400 each (edge: 0 and 100 are valid) |
| 14 | POST marks/save unknown student | 404 |
| 15 | GET marks/getMarksByStudentId/1, /99999, /0 | 200, 404, 400 |
| 16 | PATCH marks/update partial; score 150; unknown id | 200, 400, 404 |
| 17 | POST marks/getSubjectScore maths; history; no studentId; `maths;DROP TABLE marks` | 200, 400, 400, 400 |
| 18 | DELETE marks/delete/3, again, /-5 | 200, 404, 400 |
| 19 | Stop PostgreSQL, call any endpoint | 500 |
