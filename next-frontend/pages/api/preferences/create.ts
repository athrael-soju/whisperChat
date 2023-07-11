import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/utils/mongoConnection';

import { Preference } from '@/models/Preference';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    const { activity, userEmail } = req.body;

    await connectDB();

    
      const newPreference = await Preference.findOneAndUpdate(
        { userEmail: { $eq: userEmail as string } },
        { activity },
        { upsert: true, new: true },
      );

      res.status(201).json(newPreference);
    
      res.status(500).json({ error: 'Failed to create preference' });
    
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}