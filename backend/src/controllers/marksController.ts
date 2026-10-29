// CONTROLLER for marks.
import { NextFunction, Request, Response } from 'express';
import { marksService } from '../services/marksService';
import { parseId, parseSubject, requireBody, requireScore } from '../middleware/validation';

export async function getMarksByStudentId(req: Request, res: Response, next: NextFunction) {
  try {
    const marks = await marksService.getByStudentId(parseId(req.params.id));
    res.status(200).json({ success: true, message: 'Marks retrieved', data: marks });
  } catch (err) { next(err); }
}

export async function saveMarks(req: Request, res: Response, next: NextFunction) {
  try {
    const body = requireBody(req.body);
    const studentId = parseId(body.studentId, 'studentId');
    const marks = await marksService.create(studentId, {
      mathsScore: requireScore(body.mathsScore, 'mathsScore'),
      englishScore: requireScore(body.englishScore, 'englishScore'),
      scienceScore: requireScore(body.scienceScore, 'scienceScore'),
    });
    res.status(201).json({ success: true, message: 'Marks created', data: marks });
  } catch (err) { next(err); }
}

export async function updateMarks(req: Request, res: Response, next: NextFunction) {
  try {
    const body = requireBody(req.body);
    const studentId = parseId(body.studentId, 'studentId');
    const marks = await marksService.update(studentId, {
      mathsScore: body.mathsScore === undefined ? undefined : requireScore(body.mathsScore, 'mathsScore'),
      englishScore: body.englishScore === undefined ? undefined : requireScore(body.englishScore, 'englishScore'),
      scienceScore: body.scienceScore === undefined ? undefined : requireScore(body.scienceScore, 'scienceScore'),
    });
    res.status(200).json({ success: true, message: 'Marks updated', data: marks });
  } catch (err) { next(err); }
}

// POST /api/service/marks/getSubjectScore?studentId=1&subjectName=maths
export async function getSubjectScore(req: Request, res: Response, next: NextFunction) {
  try {
    const studentId = parseId(req.query.studentId, 'studentId'); // read from the req object's query string
    const subject = parseSubject(req.query.subjectName);
    const score = await marksService.getSubjectScore(studentId, subject);
    res.status(200).json({
      success: true,
      message: 'Subject score retrieved',
      data: { studentId, subjectName: subject, score },
    });
  } catch (err) { next(err); }
}

export async function deleteMarks(req: Request, res: Response, next: NextFunction) {
  try {
    await marksService.delete(parseId(req.params.id));
    res.status(200).json({ success: true, message: 'Marks deleted' });
  } catch (err) { next(err); }
}
