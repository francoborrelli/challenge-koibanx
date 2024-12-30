import express, { Router } from 'express';

import { Permissions } from '../../config/roles';

// Middlewares
import { auth } from '../../modules/auth';
import { upload } from '../../utils/multer';
import { validate } from '../../validations';

import { uploadedTaskValidation, uploadedTaskController } from '../../modules/uploadedTask';

const router: Router = express.Router();

router.get('/formatters', auth(), uploadedTaskController.getFormatters);
router.post(
  '/',
  auth(Permissions.uploadTask),
  upload.single('file'),
  validate(uploadedTaskValidation.createValidation),
  uploadedTaskController.createTask
);

router.get(
  '/:taskId/status',
  auth(Permissions.getTask),
  validate(uploadedTaskValidation.statusValidation),
  uploadedTaskController.getTaskStatus
);

router.get(
  '/:taskId/data',
  auth(Permissions.getTasksData),
  validate(uploadedTaskValidation.dataErrorsValidation),
  uploadedTaskController.getTaskData
);

router.get(
  '/:taskId/errors',
  auth(Permissions.getTaskErrors),
  validate(uploadedTaskValidation.dataErrorsValidation),
  uploadedTaskController.getTaskErrors
);

export default router;

/**
 * @swagger
 * tags:
 *   name: UploadedTask
 *   description: API for managing uploaded tasks
 */

/**
 * @swagger
 * /v1/uploadedTask:
 *   post:
 *     summary: Create a new uploaded task
 *     tags: [UploadedTask]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: The uploaded task was successfully created
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /v1/uploadedTask/{taskId}/status:
 *   get:
 *     summary: Get the status of an uploaded task
 *     tags: [UploadedTask]
 *     parameters:
 *       - in: path
 *         name: taskId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the uploaded task
 *     responses:
 *       200:
 *         description: The status of the uploaded task
 *       400:
 *         description: Bad request
 *       404:
 *         description: Task not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /v1/uploadedTask/{taskId}/data:
 *   get:
 *     summary: Get the data of an uploaded task
 *     tags: [UploadedTask]
 *     parameters:
 *       - in: path
 *         name: taskId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the uploaded task
 *     responses:
 *       200:
 *         description: The data of the uploaded task
 *       400:
 *         description: Bad request
 *       404:
 *         description: Task not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /v1/uploadedTask/{taskId}/errors:
 *   get:
 *     summary: Get the errors of an uploaded task
 *     tags: [UploadedTask]
 *     parameters:
 *       - in: path
 *         name: taskId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the uploaded task
 *     responses:
 *       200:
 *         description: The errors of the uploaded task
 *       400:
 *         description: Bad request
 *       404:
 *         description: Task not found
 *       500:
 *         description: Internal server error
 */
