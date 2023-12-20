// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

const options = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'User-Agent': 'insomnia/2023.5.8'
  },
  body: new URLSearchParams({
    client_id: process.env.client_id as string,
    client_secret: process.env.client_secret as string,
    grant_type: 'client_credentials',
    scope: 'officernd.api.read'
  })
};

const optionEvent = (token: string) => {
  return {
    method: 'GET',
    headers: {
      'User-Agent': 'insomnia/2023.5.8',
      Authorization: 'Bearer ' + token
    }
  }
};

export async function getEvent(
  token: string,
  dateStart: string,
  dateEnd: string
) {
  let fetchedData = await fetch('https://app.officernd.com/api/v1/organizations/thedock/bookings?seriesStart.%24gte=' + dateStart + '&seriesStart.%24lte=' + dateEnd, optionEvent(token));
  const JSONFetched = await fetchedData.json();
  return JSONFetched;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const date = new Date();
  const nowDate = date.toISOString().split('T')[0];
  date.setDate(date.getDate() + 1);
  const tomorrowDate = date.toISOString().split('T')[0];
  let fetchedData = await fetch('https://identity.officernd.com/oauth/token', options);
  const JSONFetched = await fetchedData.json();
  const events = await getEvent(JSONFetched.access_token, nowDate, tomorrowDate);
  res.status(200).json(events);
}