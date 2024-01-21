export class EventBriteService {
  AUTH_URL = 'https://www.eventbriteapi.com/v3/';
  access_token = process.env.eventbrite_private_token;
  organizationId = process.env.organization_id;
  organizer_id = process.env.organizer_id;  // this is theDock id
  test = false;
  fetchWithToken = async (url: string) => {
    let fetchedData = await fetch(url,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.access_token}`
        }
      });
    return await fetchedData.json();
  };

  // Pagination
  getEventBriteEventsByOrg = async () => {
    // Query time_filter can help filter out expired event. page_size is 1000 in case of pagination problems. order_by asc in query so we don't need to sort it.
    let urlWithQuery;
    urlWithQuery = `${this.AUTH_URL}organizations/${this.organizationId}/events?time_filter=current_future&order_by=start_asc&page_size=1000&organizer_filter=${this.organizer_id}`;
    if (this.test) {
      urlWithQuery = `${this.AUTH_URL}organizations/${this.organizationId}/events?time_filter=past&order_by=start_asc&page_size=1000&organizer_filter=${this.organizer_id}`;
    }
    let allEvents = await this.fetchWithToken(
      urlWithQuery
    );
    return allEvents;
  };
}