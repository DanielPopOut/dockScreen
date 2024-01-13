// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import {
  SeparateStartedAndUpcomingEvents,
  TrimExpiredEvents,
} from '../dataProcessing/processEvents';
import { Authenticate, GetWithToken } from './authenticate';

export async function getEvent(
  token: string,
  dateStart: string,
  dateEnd: string,
) {
  let fetchedData = await fetch(
    'https://app.officernd.com/api/v1/organizations/thedock/bookings?seriesStart.%24gte=' +
      dateStart +
      '&seriesStart.%24lte=' +
      dateEnd,
    GetWithToken(token),
  );
  const JSONFetched = await fetchedData.json();
  return JSONFetched;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const date = new Date();
  const nowDate = date.toLocaleDateString();
  date.setDate(date.getDate() + 2);
  const tomorrowDate = date.toLocaleDateString();
  console.log(nowDate, tomorrowDate);
  const authResults = await Authenticate();
  const events = await getEvent(
    authResults.access_token,
    nowDate,
    tomorrowDate,
  );
  const todayEvents = events.filter((event: any) => {
    return new Date(event['start']['dateTime']).toLocaleDateString() == nowDate;
  });
  const todayEventsSorted = todayEvents.sort(function (a: any, b: any) {
    return (
      new Date(a['start']['dateTime']).getTime() -
      new Date(b['start']['dateTime']).getTime()
    );
  });
  res
    .status(200)
    .json(
      SeparateStartedAndUpcomingEvents(
        TrimExpiredEvents(todayEventsSorted, new Date()),
        new Date(),
      ),
    );
}
