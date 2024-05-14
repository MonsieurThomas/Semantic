// pages/api/users/index.ts
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import bcrypt from "bcrypt";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log("debut de api/users/index.ts")
  if (req.method === "POST") {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    try {
      const newUser = await prisma.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
        },
      });
      res.status(201).json(newUser);
    } catch (error) {
      res.status(400).json({ error: "User creation failed" });
    }
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
