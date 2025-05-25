import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.query;

  if (typeof userId !== 'string') {
    res.status(400).json({ error: 'Invalid userId' });
    return;
  }

  if (req.method === 'GET') {
    // Fetch user profile
    const [rows] = await db.query('SELECT * FROM user_profiles WHERE userId = ?', [userId]);
    if (Array.isArray(rows) && rows.length > 0) {
      res.status(200).json(rows[0]);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } else if (req.method === 'POST' || req.method === 'PUT') {
    // Update or create user profile
    const data = req.body;
    await db.query(
      `REPLACE INTO user_profiles SET ?`,
      [data]
    );
    res.status(200).json({ success: true });
  } else {
    res.status(405).end();
  }
}