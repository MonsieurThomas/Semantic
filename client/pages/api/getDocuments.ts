import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const documents = await prisma.document.findMany();
    res.status(200).json(documents);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}
