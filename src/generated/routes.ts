/**
 * AUTO-GENERATED EXPRESS API ROUTES
 * CRUD endpoints for Users and Tasks
 */

import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { db } from './db.js';
import type { User, Task } from './types.js';

const router = Router();

// Validation schemas
const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
});

const updateUserSchema = z.object({
  email: z.string().email().optional(),
  name: z.string().min(1).optional(),
});

const createTaskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  status: z.enum(['pending', 'in_progress', 'completed']).optional(),
  assigned_user_id: z.string().uuid().optional(),
  due_date: z.string().datetime().optional(),
});

const updateTaskSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  status: z.enum(['pending', 'in_progress', 'completed']).optional(),
  assigned_user_id: z.string().uuid().optional(),
  due_date: z.string().datetime().optional(),
});

// USERS ROUTES
router.get('/users', async (req: Request, res: Response) => {
  try {
    const users = await db.getUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

router.get('/users/:id', async (req: Request, res: Response) => {
  try {
    const user = await db.getUserById(req.params.id);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

router.post('/users', async (req: Request, res: Response) => {
  try {
    const data = createUserSchema.parse(req.body);
    const user = await db.createUser(data);
    res.status(201).json(user);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors[0].message });
      return;
    }
    res.status(500).json({ error: 'Failed to create user' });
  }
});

router.put('/users/:id', async (req: Request, res: Response) => {
  try {
    const data = updateUserSchema.parse(req.body);
    const user = await db.updateUser(req.params.id, data);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json(user);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors[0].message });
      return;
    }
    res.status(500).json({ error: 'Failed to update user' });
  }
});

router.delete('/users/:id', async (req: Request, res: Response) => {
  try {
    const deleted = await db.deleteUser(req.params.id);
    if (!deleted) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// TASKS ROUTES
router.get('/tasks', async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string | undefined;
    const tasks = await db.getTasks(userId);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

router.get('/tasks/:id', async (req: Request, res: Response) => {
  try {
    const task = await db.getTaskById(req.params.id);
    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch task' });
  }
});

router.post('/tasks', async (req: Request, res: Response) => {
  try {
    const data = createTaskSchema.parse(req.body);
    const task = await db.createTask(data);
    res.status(201).json(task);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors[0].message });
      return;
    }
    res.status(500).json({ error: 'Failed to create task' });
  }
});

router.put('/tasks/:id', async (req: Request, res: Response) => {
  try {
    const data = updateTaskSchema.parse(req.body);
    const task = await db.updateTask(req.params.id, data);
    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }
    res.json(task);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors[0].message });
      return;
    }
    res.status(500).json({ error: 'Failed to update task' });
  }
});

router.delete('/tasks/:id', async (req: Request, res: Response) => {
  try {
    const deleted = await db.deleteTask(req.params.id);
    if (!deleted) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

export default router;
