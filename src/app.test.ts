import { describe, it, expect, beforeEach, afterEach, beforeAll } from 'vitest';
import app from './app.ts';

const request = require('supertest');

let nonExistentTaskId: number | undefined;

beforeAll(async () => {
    const response = await request(app)
        .post('/tasks')
        .send({ title: 'Non-existent Task' });

    nonExistentTaskId = response.body?.id;

    let setupComplete = false;
    try {
        expect(response.status).toEqual(201);
        expect(nonExistentTaskId).toBeTypeOf('number');

        const deleteRes = await request(app).delete(`/tasks/${nonExistentTaskId}`);
        expect(deleteRes.status).toEqual(204);
        setupComplete = true;
    } finally {
        if (!setupComplete && nonExistentTaskId !== undefined) {
            await request(app).delete(`/tasks/${nonExistentTaskId}`);
        }
    }
});

describe('POST /tasks', () => {
    let postId: number;

    afterEach(async () => {
        if (postId) {
            await request(app).delete(`/tasks/${postId}`);
            postId = 0; 
        }
    });

    it('Should create a new task and return 201', async () => {
        const response = await request(app)
            .post('/tasks')
            .send({ title: 'New Task' });

        postId = response.body?.id;
        expect(response.status).toEqual(201);
        
        expect(response.body.title).toBe('New Task');
    });

    it('Should not create a new task and return 400', async () => {
        const response = await request(app).post('/tasks').send({ title: "" });
        expect(response.status).toEqual(400);
    });

    it('Should not create a new task and return 400', async () => {
        const response = await request(app).post('/tasks').send({ title: 123 });
        expect(response.status).toEqual(400);
    });

    it('Should not create a new task and return 400', async () => {
        const response = await request(app).post('/tasks').send();
        expect(response.status).toEqual(400);
    });
});

describe('GET /tasks', () => {
    it('Should return an array of tasks and return 200', async () => {
        const response = await request(app).get('/tasks');

        expect(response.status).toEqual(200);
        expect(Array.isArray(response.body)).toBe(true);
    });
});
   
describe('GET /tasks/:id', () => {
    let taskId: number;

    beforeEach(async () => {
        const response = await request(app)
            .post('/tasks')
            .send({ title: 'New Task' });

        taskId = response.body?.id;
        expect(response.status).toEqual(201);
    });

    afterEach(async () => {
        if (taskId) {
            await request(app).delete(`/tasks/${taskId}`);
            taskId = 0;
        }
    });

    it('Should return a task with the specified id and return 200', async () => {
        const response = await request(app).get(`/tasks/${taskId}`);

        expect(response.status).toEqual(200);
        expect(response.body).toHaveProperty('id', taskId);
    });

    it('Should return 400 for abc', async () => {
        const response = await request(app).get('/tasks/abc');
        expect(response.status).toEqual(400);
    });

    it('Should return 400 for 01', async () => {
        const response = await request(app).get('/tasks/01');
        expect(response.status).toEqual(400);
    });

    it('Should return 404 for non-existent id', async () => {
        const response = await request(app).get(`/tasks/${nonExistentTaskId}`);
        expect(response.status).toEqual(404);
    });
});

describe('PATCH /tasks/:id', () => {
    let taskId: number;

    beforeEach(async () => {
        const response = await request(app)
            .post('/tasks')
            .send({ title: 'New Task' });
            
        taskId = response.body?.id;
        expect(response.status).toEqual(201);
    });

    afterEach(async () => {
        if (taskId) {
            await request(app).delete(`/tasks/${taskId}`);
            taskId = 0;
        }
    });

    it('Should update a task with specific ID and return 200', async () => {
        const response = await request(app)
            .patch(`/tasks/${taskId}`)
            .send({ title: 'Updated Task', done: true });

        expect(response.status).toEqual(200);
        expect(response.body).toHaveProperty('title', 'Updated Task');
        expect(response.body).toHaveProperty('done', true);
    });

    it('Should return 400 for empty title', async () => {
        const response = await request(app).patch(`/tasks/${taskId}`).send({ title: '' });
        expect(response.status).toEqual(400);
    });

    it('Should return 400 for non-boolean done', async () => {
        const response = await request(app).patch(`/tasks/${taskId}`).send({ done: 'sim' });
        expect(response.status).toEqual(400);
    });

    it('Should return 400 for empty body', async () => {
        const response = await request(app).patch(`/tasks/${taskId}`).send({});
        expect(response.status).toEqual(400);
    });

    it('Should return 404 for non-existent id', async () => {
        const response = await request(app)
            .patch(`/tasks/${nonExistentTaskId}`)
            .send({ title: 'Updated Task', done: true });

        expect(response.status).toEqual(404);
    });
});

describe('DELETE /tasks/:id', () => {
    let taskId: number;

    afterEach(async () => {
        if (taskId) {
            await request(app).delete(`/tasks/${taskId}`);
            taskId = 0;
        }
    });

    it('Should delete a task and return 404 on subsequent attempts', async () => {
        const postRes = await request(app)
            .post('/tasks')
            .send({ title: 'Task to delete' });
        
        taskId = postRes.body?.id;
        expect(postRes.status).toEqual(201);

        const deleteRes1 = await request(app).delete(`/tasks/${taskId}`);
        expect(deleteRes1.status).toEqual(204);

        const deleteRes2 = await request(app).delete(`/tasks/${taskId}`);
        expect(deleteRes2.status).toEqual(404);

        taskId = 0;
    });

    it('Should return 400 for abc', async () => {
        const response = await request(app).delete('/tasks/abc');
        expect(response.status).toEqual(400);
    });
});
