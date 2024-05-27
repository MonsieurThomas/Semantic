// import { NextApiRequest, NextApiResponse } from "next";
// import { getServerSession } from "next-auth/next";
// import authOptions from "../auth/[...nextauth]";
// import prisma from "../../../lib/prisma";

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== "GET") {
//     res.status(405).json({ error: `Method ${req.method} not allowed` });
//     return;
//   }

//   try {
//     const session = await getServerSession(req, res, authOptions);


//     if (!session || !session.user || !session.user.email) {
//       res.status(401).json({ error: "Unauthorized" });
//       return;
//     }

//     const email = session.user.email as string;

//     const user = await prisma.user.findUnique({
//       where: { email },
//     });

//     if (!user) {
//       res.status(404).json({ error: "User not found" });
//       return;
//     }

//     res.status(200).json(user);
//   } catch (error) {
//     console.error("Error fetching user data:", error);
//     res.status(500).json({ error: "Failed to fetch user data" });
//   }
// }
