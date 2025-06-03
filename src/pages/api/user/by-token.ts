import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";
import { generateShortIdFromUserId } from "@/lib/utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { shortId } = req.query;
  if (typeof shortId !== "string") {
    res.status(400).json({ error: "Invalid shortId" });
    return;
  }
  // Find user by shortId (by scanning userId hashes)
  const [rows] = await db.query("SELECT * FROM user_profiles");
  const userRows = rows as any[];
  const user = userRows.find(
    (u) => generateShortIdFromUserId(u.userId) === shortId
  );
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  // Attach shortId to response
  user.shortId = shortId;
  res.status(200).json(user);
}
