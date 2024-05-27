// import { NextApiRequest, NextApiResponse } from "next";
// import prisma from "../../../lib/prisma";
// import bcrypt from "bcrypt";
// import jwt from 'jsonwebtoken';


// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method === "POST") {
//     const { username, email, password } = req.body;
//     const hashedPassword = await bcrypt.hash(password, 10);

//     try {
//       const newUser = await prisma.user.create({
//         data: {
//           username,
//           email,
//           password: hashedPassword,
//         },
//       });
//       res.status(201).json(newUser);
//     } catch (error) {
//       console.error("Error creating user:", error);  // Log the error
//       res.status(400).json({ error: "User creation failed" });
//     }
//   } if (req.method === 'GET') {
//     const token = req.headers.authorization?.split(' ')[1];
//     if (!token) {
//       return res.status(401).json({ error: 'Unauthorized' });
//     }

//     try {
//       const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
//       const users = await prisma.user.findMany();
//       res.status(200).json(users);
//     } catch (error) {
//       res.status(500).json({ error: 'Failed to fetch users' });
//     }
//   } else {
//     res.status(405).json({ error: `Method ${req.method} not allowed` });
//   }
// }
