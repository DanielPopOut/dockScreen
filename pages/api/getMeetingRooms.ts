// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { OfficeRnDService } from '@/src/services/OfficeRnDService';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const officeRNDService = new OfficeRnDService();
  const meetingRooms = await officeRNDService.getMeetingRooms();
  res.status(200).json(meetingRooms);
}
