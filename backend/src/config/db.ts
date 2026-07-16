import mysql from "mysql2/promise";
import { env } from "./env";

export const pool = mysql.createPool({
  uri: env.DATABASE_URL,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  dateStrings: false,
  decimalNumbers: false,
});

export type QueryParams = Array<string | number | boolean | Date | null | undefined>;

export async function query<T = Record<string, unknown>>(sql: string, params: QueryParams = []): Promise<T[]> {
  const [rows] = await pool.query(sql, params);
  return rows as T[];
}

export async function queryOne<T = Record<string, unknown>>(sql: string, params: QueryParams = []): Promise<T | null> {
  const rows = await query<T>(sql, params);
  return rows[0] ?? null;
}

export async function execute(sql: string, params: QueryParams = []): Promise<{ affectedRows: number; insertId: number }> {
  const [result] = await pool.query(sql, params);
  return result as { affectedRows: number; insertId: number };
}

export async function withTransaction<T>(fn: (conn: mysql.PoolConnection) => Promise<T>): Promise<T> {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const result = await fn(conn);
    await conn.commit();
    return result;
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}
