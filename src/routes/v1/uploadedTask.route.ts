import express, { Router } from 'express';
import { upload } from '../../utils/multer';
import { validate } from '../../validations';
import { uploadedTaskValidation, uploadedTaskController } from '../../modules/uploadedTask';

const router: Router = express.Router();

router.post('/', validate(uploadedTaskValidation.create), upload.single('file'), uploadedTaskController.createTask);

export default router;
