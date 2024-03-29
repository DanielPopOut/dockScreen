// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { SeparateStartedAndUpcomingEvents } from '../../src/misc/dataProcessing/processEvents';
import { EventBriteService } from '../../src/services/EventBriteService';

function convertTestDate(lessEventOption = false, option = 'en') {
  if (option == 'de') {
    if (lessEventOption) {
      return '24.10.2023';
    }
    return '21.09.2023';
  } else if (option == 'fr') {
    if (lessEventOption) {
      return '24/10/2023';
    }
    return '21/09/2023';
  }
  if (lessEventOption) {
    return '10/24/2023';
  }
  return '9/21/2023';
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const date = new Date();
  const test = true;

  let nowDate = date.toLocaleDateString();
  if (test) {
    nowDate = convertTestDate(true); // en-US
    // const nowDate = "21.09.2023"; // de-DE
    // const nowDate = "21/09/2023"; // fr-FR
  }

  date.setDate(date.getDate() + 2);

  const eventBriteService = new EventBriteService();
  const eventBriteEvents = await eventBriteService.getEventBriteEventsByOrg();

  // order_by asc in query so we don't need to sort it.
  let returnResult;
  if (test) {
    returnResult = SeparateStartedAndUpcomingEvents(
      eventBriteEvents,
      new Date(nowDate),
    );
  } else {
    returnResult = SeparateStartedAndUpcomingEvents(
      eventBriteEvents,
      new Date(),
    );
  }

  res.status(200).json(returnResult);
}
