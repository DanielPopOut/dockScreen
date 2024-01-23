export class EventBriteService {
  AUTH_URL = 'https://www.eventbriteapi.com/v3/';
  access_token = process.env.eventbrite_private_token;
  organizationId = process.env.organization_id;
  organizer_id = process.env.organizer_id; // this is theDock id

  fetchWithToken = async (url: string) => {
    let fetchedData = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.access_token}`,
      },
    });
    return await fetchedData.json();
  };

  // Pagination
  getEventBriteEventsByOrg = async (
    time_filter: 'current_future' | 'past' = 'current_future',
  ) => {
    // Query time_filter can help filter out expired event. page_size is 1000 in case of pagination problems. order_by asc in query so we don't need to sort it.
    let urlWithQuery;
    urlWithQuery = `${this.AUTH_URL}organizations/${this.organizationId}/events?time_filter=${time_filter}&order_by=start_asc&page_size=1000&organizer_filter=${this.organizer_id}`;
    let allEvents = await this.fetchWithToken(urlWithQuery);
    return convertEventBriteDataArray(allEvents.events);
  };
}

export type ProcessedEventBriteData = {
  location: string;
  name: string;
  timeStart: string;
  timeEnd: string;
  description: string;
  picUrl: string;
};

type BaseEventBriteData = {
  name: {
    text: string;
  };
  description: {
    text: string;
  };
  start: {
    utc: string;
  };
  end: {
    utc: string;
  };
  logo: {
    url: string;
  };
  venue_id: string;
};

const convertEventBriteData = (eventBriteData: BaseEventBriteData) => {
  let processedEventBriteData: ProcessedEventBriteData = {
    location: eventBriteData['venue_id'],
    name: eventBriteData['name']['text'],
    timeStart: new Date(eventBriteData['start']['utc']).toLocaleTimeString(),
    timeEnd: new Date(eventBriteData['end']['utc']).toLocaleTimeString(),
    description: eventBriteData['description']['text'],
    picUrl: eventBriteData['logo']['url'],
  };
  return processedEventBriteData;
};

const convertEventBriteDataArray = (
  eventBriteData: BaseEventBriteData[],
): ProcessedEventBriteData[] => {
  return eventBriteData.map(convertEventBriteData);
};
