// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { OfficeRnDService } from '../../src/services/OfficeRnDService';
import {
  SeparateStartedAndUpcomingEvents,
  TrimExpiredEvents,
} from '../dataProcessing/processEvents';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const date = new Date();
  const nowDate = date.toLocaleDateString();
  date.setDate(date.getDate() + 2);
  const tomorrowDate = date.toLocaleDateString();
  console.log(nowDate, tomorrowDate);
  const officeRNDService = new OfficeRnDService();
  const events = await officeRNDService.getEventsWithMeetingRooms(
    nowDate,
    tomorrowDate,
  );
  const todayEvents = events.filter((event: any) => {
    return new Date(event.startDateTime).toLocaleDateString() == nowDate;
  });
  const todayEventsSorted = todayEvents.sort(function (a, b) {
    return (
      new Date(a.startDateTime).getTime() - new Date(b.endDateTime).getTime()
    );
  });
  const eventsToShow = SeparateStartedAndUpcomingEvents(
    TrimExpiredEvents(todayEventsSorted, new Date()),
    new Date(),
  );
  res.status(200).json(eventsToShow);
}
