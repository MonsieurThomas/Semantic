import { NextApiRequest, NextApiResponse } from 'next';
import { Prisma } from '@prisma/client';
import bcrypt from 'bcrypt';
import prisma from '../../lib/prisma';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });
    res.status(201).json(user);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // The .code property can be used to determine the type of error
      if (error.code === 'P2002') {
        return res.status(409).json({ message: 'User already exists' });
      }
    }
    res.status(500).json({ message: 'Internal server error' });
  }
}
