// CONTROLLER: reads the request, validates input, calls the service, sends the response.
import { NextFunction, Request, Response } from 'express';
import { studentService } from '../services/studentService';
import { parseId, requireBody, requireBoolean, requireText } from '../middleware/validation';

export async function getAll(_req: Request, res: Response, next: NextFunction) {
  try {
    const students = await studentService.getAll();
    res.status(200).json({ success: true, message: 'Students retrieved', data: students });
  } catch (err) { next(err); } // next(err) hands the error to the error-handling middleware
}

export async function getStudentByID(req: Request, res: Response, next: NextFunction) {
  try {
    const student = await studentService.getById(parseId(req.params.id));
    res.status(200).json({ success: true, message: 'Student retrieved', data: student });
  } catch (err) { next(err); }
}

export async function saveStudent(req: Request, res: Response, next: NextFunction) {
  try {
    const body = requireBody(req.body);
    const name = requireText(body.studentName, 'studentName');
    const homeTown = requireText(body.homeTown, 'homeTown');
    const isActive = body.isActive === undefined ? true : requireBoolean(body.isActive, 'isActive');
    const student = await studentService.create(name, homeTown, isActive);
    res.status(201).json({ success: true, message: 'Student created', data: student });
  } catch (err) { next(err); }
}

export async function updateStudent(req: Request, res: Response, next: NextFunction) {
  try {
    const body = requireBody(req.body);
    const id = parseId(body.studentId, 'studentId');
    const changes = {
      studentName: body.studentName === undefined ? undefined : requireText(body.studentName, 'studentName'),
      homeTown: body.homeTown === undefined ? undefined : requireText(body.homeTown, 'homeTown'),
      isActive: body.isActive === undefined ? undefined : requireBoolean(body.isActive, 'isActive'),
    };
    const student = await studentService.update(id, changes);
    res.status(200).json({ success: true, message: 'Student updated', data: student });
  } catch (err) { next(err); }
}
