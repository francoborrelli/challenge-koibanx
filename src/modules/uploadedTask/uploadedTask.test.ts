// import app from '../../app';

// // Model
// import UploadTask from './uploadedTask.model';

// // Tests related
// import request from 'supertest';
// import { beforeEach, describe, expect, it } from '@jest/globals';

// describe('UploadedTask Routes', () => {
//   beforeEach(() => {
//     UploadTask.create({
//       _id: '609c72ef6b64fdb1a6c81302',
//       filename: 'testfile.xlsx',
//       filepath: 'uploads/testfile.xlsx',
//       formatter: '0',
//       status: 'processing',
//     });
//   });

//   describe('POST /tasks', () => {
//     it('should create a task and return an ID when a file is uploaded', async () => {
//       const file = Buffer.from('fake file content'); // Puedes usar un archivo real en lugar de Buffer

//       const response = await request(app)
//         .post('/tasks')
//         .attach('file', file, 'testfile.xlsx') // Asegúrate de tener un archivo de prueba
//         .field('formatter', 'excel') // Enviar el formato como parte del body
//         .expect(201); // Código de éxito para creación

//       expect(response.body).toHaveProperty('_id');
//       expect(response.body).toHaveProperty('filename', 'testfile.xlsx');
//     });

//     it('should return BAD_REQUEST if no file is uploaded', async () => {
//       const response = await request(app).post('/tasks').expect(400);

//       expect(response.text).toBe('No file uploaded');
//     });
//   });

//   describe('GET /tasks/:taskId/status', () => {
//     it('should return the status of the task', async () => {
//       const taskId = '609c72ef6b64fdb1a6c81302';

//       const response = await request(app).get(`/tasks/${taskId}/status`).expect(200);
//       expect(response.body).toHaveProperty('status');
//       expect(response.body.status).toBeDefined();
//     });

//     it('should return 404 if task is not found', async () => {
//       const taskId = 'invalidtaskid';
//       const response = await request(app).get(`/tasks/${taskId}/status`).expect(404);
//       expect(response.text).toBe('Task not found');
//     });
//   });

//   describe('GET /tasks/:taskId/data', () => {
//     it('should return task data with pagination', async () => {
//       const taskId = '609c72ef6b64fdb1a6c81302'; // Usa un ID de tarea válido

//       const response = await request(app).get(`/tasks/${taskId}/data`).query({ page: 1, limit: 10 }).expect(200);

//       expect(Array.isArray(response.body)).toBe(true);
//       expect(response.body.length).toBeLessThanOrEqual(10);
//     });

//     it('should return an empty array if no data is found', async () => {
//       const taskId = '609c72ef6b64fdb1a6c81302'; // Usa un ID de tarea válido

//       const response = await request(app)
//         .get(`/tasks/${taskId}/data`)
//         .query({ page: 999, limit: 10 }) // Página alta sin datos
//         .expect(200);

//       expect(response.body).toEqual([]);
//     });
//   });
// });
