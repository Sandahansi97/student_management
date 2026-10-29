import { Router } from 'express';
import * as controller from '../controllers/marksController';

const router = Router();
router.get('/getMarksByStudentId/:id', controller.getMarksByStudentId);
router.post('/save', controller.saveMarks);
router.patch('/update', controller.updateMarks);
router.post('/getSubjectScore', controller.getSubjectScore);
router.delete('/delete/:id', controller.deleteMarks);

export default router;
