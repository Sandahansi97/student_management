// ROUTES: map "HTTP method + URL" to a controller function.
import { Router } from 'express';
import * as controller from '../controllers/studentController';

const router = Router();
router.get('/getAll', controller.getAll);
router.get('/getStudentByID/:id', controller.getStudentByID);
router.post('/save', controller.saveStudent);
router.patch('/update', controller.updateStudent);

export default router;
