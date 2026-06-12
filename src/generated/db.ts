/**
 * AUTO-GENERATED DATABASE CLIENT
 * Connects to PostgreSQL database provisioned by Lynq
 */

import { Pool, QueryResult } from 'pg';
import type { User, Task, CreateUserInput, UpdateUserInput, CreateTaskInput, UpdateTaskInput } from './types.js';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres@localhost:5432/lynq_ad89fc12_1781248507289',
});

export class DatabaseClient {
  // USERS QUERIES
  async getUsers(): Promise<User[]> {
    const result = await pool.query('SELECT * FROM users ORDER BY created_at DESC');
    return result.rows;
  }

  async getUserById(id: string): Promise<User | null> {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0] || null;
  }

  async createUser(data: CreateUserInput): Promise<User> {
    const result = await pool.query(
      'INSERT INTO users (email, name) VALUES ($1, $2) RETURNING *',
      [data.email, data.name]
    );
    return result.rows[0];
  }

  async updateUser(id: string, data: UpdateUserInput): Promise<User | null> {
    const updates: string[] = [];
    const values: unknown[] = [id];
    let paramCount = 2;

    if (data.email) {
      updates.push(`email = $${paramCount++}`);
      values.push(data.email);
    }
    if (data.name) {
      updates.push(`name = $${paramCount++}`);
      values.push(data.name);
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);

    if (updates.length === 1) return this.getUserById(id);

    const query = `UPDATE users SET ${updates.join(', ')} WHERE id = $1 RETURNING *`;
    const result = await pool.query(query, values);
    return result.rows[0] || null;
  }

  async deleteUser(id: string): Promise<boolean> {
    const result = await pool.query('DELETE FROM users WHERE id = $1', [id]);
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // TASKS QUERIES
  async getTasks(userId?: string): Promise<Task[]> {
    let query = 'SELECT * FROM tasks';
    const values: unknown[] = [];

    if (userId) {
      query += ' WHERE assigned_user_id = $1';
      values.push(userId);
    }

    query += ' ORDER BY created_at DESC';
    const result = await pool.query(query, values);
    return result.rows;
  }

  async getTaskById(id: string): Promise<Task | null> {
    const result = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  async createTask(data: CreateTaskInput): Promise<Task> {
    const result = await pool.query(
      `INSERT INTO tasks (title, description, priority, status, assigned_user_id, due_date)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [data.title, data.description, data.priority, data.status || 'pending', data.assigned_user_id, data.due_date]
    );
    return result.rows[0];
  }

  async updateTask(id: string, data: UpdateTaskInput): Promise<Task | null> {
    const updates: string[] = [];
    const values: unknown[] = [id];
    let paramCount = 2;

    if (data.title) {
      updates.push(`title = $${paramCount++}`);
      values.push(data.title);
    }
    if (data.description !== undefined) {
      updates.push(`description = $${paramCount++}`);
      values.push(data.description);
    }
    if (data.priority) {
      updates.push(`priority = $${paramCount++}`);
      values.push(data.priority);
    }
    if (data.status) {
      updates.push(`status = $${paramCount++}`);
      values.push(data.status);
    }
    if (data.assigned_user_id !== undefined) {
      updates.push(`assigned_user_id = $${paramCount++}`);
      values.push(data.assigned_user_id);
    }
    if (data.due_date !== undefined) {
      updates.push(`due_date = $${paramCount++}`);
      values.push(data.due_date);
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);

    if (updates.length === 1) return this.getTaskById(id);

    const query = `UPDATE tasks SET ${updates.join(', ')} WHERE id = $1 RETURNING *`;
    const result = await pool.query(query, values);
    return result.rows[0] || null;
  }

  async deleteTask(id: string): Promise<boolean> {
    const result = await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
    return result.rowCount ? result.rowCount > 0 : false;
  }
}

export const db = new DatabaseClient();
