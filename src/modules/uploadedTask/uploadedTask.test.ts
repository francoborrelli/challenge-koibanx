import app from '../../app';

// Model
import { User } from '../user';
import mongoose from 'mongoose';
import UploadTask from './uploadedTask.model';

// Config
import config from '../../config/config';

// Utils
import dayjs from 'dayjs';
import bcrypt from 'bcryptjs';

// Tests related
import request from 'supertest';
import { faker } from '@faker-js/faker';
import setupTestDB from '../../jest/setupTestDB';
import { describe, expect, it, beforeAll } from '@jest/globals';

// Interfaces
import { tokenService, tokenTypes } from '../token';

setupTestDB();

const password = 'password1';
const salt = bcrypt.genSaltSync(8);
const hashedPassword = bcrypt.hashSync(password, salt);
const accessTokenExpires = dayjs().add(config.jwt.accessExpirationMinutes, 'minutes');

const admin = {
  _id: new mongoose.Types.ObjectId(),
  name: faker.person.fullName(),
  email: faker.internet.email().toLowerCase(),
  password,
  role: 'admin',
  isEmailVerified: false,
};

const task = {
  _id: new mongoose.Types.ObjectId(),
  filename: 'testfile.xlsx',
  filepath: 'uploads/testfile.xlsx',
  formatter: 0,
  status: 'processing',
};

const insertUsers = async (users: Record<string, any>[]) => {
  await User.insertMany(users.map((user) => ({ ...user, password: hashedPassword })));
};

const insertTask = async (tasks: Record<string, any>[]) => {
  await UploadTask.insertMany(tasks);
};

const adminAccessToken = tokenService.generateToken(admin._id, accessTokenExpires, tokenTypes.ACCESS);

describe('UploadedTask Routes', () => {
  beforeAll(() => {});

  describe('POST /v1/tasks', () => {
    it('should create a task and return an ID when a file is uploaded', async () => {
      await insertUsers([admin]);
      const file = Buffer.from('fake file content'); // Puedes usar un archivo real en lugar de Buffer

      const response = await request(app)
        .post('/v1/tasks')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .attach('file', file, 'testfile.xlsx') // Asegúrate de tener un archivo de prueba
        .field('formatter', 1) // Enviar el formato como parte del body
        .expect(201); // Código de éxito para creación

      expect(response.body).toHaveProperty('_id');
      expect(response.body).toHaveProperty('createdAt');
      expect(response.body).toHaveProperty('formatter', 1);
      expect(response.body).toHaveProperty('status', 'pending');
    });

    it('should return BAD_REQUEST if no file is uploaded', async () => {
      await insertUsers([admin]);
      const response = await request(app)
        .post('/v1/tasks')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(400);

      expect(response.text).toBe('No file uploaded');
    });

    it('should return UNAUTHORIZED if no bearer token is provided', async () => {
      const file = Buffer.from('fake file content');
      await request(app).post('/v1/tasks').attach('file', file, 'testfile.xlsx').field('formatter', 1).expect(401);
    });
  });

  describe('GET /v1/tasks/:taskId/status', () => {
    it('should return the status of the task', async () => {
      await Promise.all([insertUsers([admin]), insertTask([task])]);
      const taskId = task._id;

      const response = await request(app)
        .get(`/v1/tasks/${taskId}/status`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(200);

      expect(['processing', 'done', 'pending']).toContain(response.body.status);
    });

    it('should return 404 if task is not found', async () => {
      await insertUsers([admin]);
      const taskId = new mongoose.Types.ObjectId();
      await request(app)
        .get(`/v1/tasks/${taskId}/status`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(404);
    });

    it('should return UNAUTHORIZED if no bearer token is provided', async () => {
      const taskId = '609c72ef6b64fdb1a6c81302';
      await request(app).get(`/v1/tasks/${taskId}/status`).expect(401);
    });
  });

  describe('GET /v1/tasks/:taskId/data', () => {
    it('should return task data with pagination', async () => {
      await Promise.all([insertUsers([admin]), insertTask([task])]);
      const taskId = task._id;

      const response = await request(app)
        .get(`/v1/tasks/${taskId}/data`)
        .query({ page: 1, limit: 10 })
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(200);

      expect(Array.isArray(response.body.results)).toBe(true);
      expect(response.body.results.length).toBeLessThanOrEqual(10);
    });

    it('should return an empty array if no data is found', async () => {
      await Promise.all([insertUsers([admin]), insertTask([task])]);
      const taskId = task._id;

      const response = await request(app)
        .get(`/v1/tasks/${taskId}/data`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ page: 999, limit: 10 }) // Página alta sin datos
        .expect(200);

      expect(response.body).toEqual({
        limit: 10,
        page: 999,
        results: [],
        totalPages: 0,
        totalResults: 0,
      });
    });

    it('should return UNAUTHORIZED if no bearer token is provided', async () => {
      const taskId = '609c72ef6b64fdb1a6c81302';
      await request(app).get(`/v1/tasks/${taskId}/data`).query({ page: 1, limit: 10 }).expect(401);
    });
  });
});
