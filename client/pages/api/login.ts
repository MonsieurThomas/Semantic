// pages/api/login.ts

import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../../lib/prisma";
import { serialize } from "cookie";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      console.log("User not found");
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      console.log("Password does not match");
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET);

    console.log("Token generated:", token);

    res.setHeader(
      "Set-Cookie",
      serialize("token", token, {
        // httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 360000,
        path: "/",
      })
    );

    res
      .status(200)
      .json({ token, user: { id: user.id, username: user.username } });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
