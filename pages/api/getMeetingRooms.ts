// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Authenticate, GetWithToken } from './authenticate'

async function getMeetingRooms (
  token: string
) {
  let fetchedData = await fetch('https://app.officernd.com/api/v1/organizations/thedock/resources?type=meeting_room', GetWithToken(token));
  return await fetchedData.json();
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const authResponse = await Authenticate();
  const meetingRooms = await getMeetingRooms(authResponse.access_token);
  res.status(200).json(meetingRooms)
}