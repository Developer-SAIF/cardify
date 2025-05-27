import { DEFAULT_SKILLS, DEFAULT_EDUCATION, DEFAULT_LINKS } from "@/types";
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId } = req.query;

  if (typeof userId !== "string") {
    res.status(400).json({ error: "Invalid userId" });
    return;
  }

  if (req.method === "GET") {
    // Fetch user profile
    const [rows] = await db.query(
      "SELECT * FROM user_profiles WHERE userId = ?",
      [userId]
    );
    const userRows = rows as any[];
    if (userRows.length > 0) {
      const user = userRows[0];

      user.showHeadline = Boolean(user.showHeadline);
      user.showProfession = Boolean(user.showProfession);
      user.showCompany = Boolean(user.showCompany);
      user.showLocation = Boolean(user.showLocation);
      user.showContactEmail = Boolean(user.showContactEmail);
      user.showContactPhone = Boolean(user.showContactPhone);

      // Parse JSON fields and apply defaults if needed
      user.skills = user.skills ? user.skills : DEFAULT_SKILLS;
      user.education = user.education ? user.education : DEFAULT_EDUCATION;
      user.links = user.links ? user.links : DEFAULT_LINKS;

      res.status(200).json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } else if (req.method === "POST" || req.method === "PUT") {
    const data = req.body;

    // Stringify JSON fields before saving
    if (data.skills) data.skills = JSON.stringify(data.skills);
    if (data.education) data.education = JSON.stringify(data.education);
    if (data.links) data.links = JSON.stringify(data.links);

    try {
      await db.query(`REPLACE INTO user_profiles SET ?`, [data]);
      res.status(200).json({ success: true });
    } catch (error) {
      console.error("DB error occurred:", { error });

      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";

      res.status(500).json({ success: false, error: errorMessage });
    }
  } else {
    res.status(405).end();
  }
}
