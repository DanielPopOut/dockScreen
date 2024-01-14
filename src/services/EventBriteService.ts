export class EventBriteService {
  AUTH_URL = 'https://www.eventbriteapi.com/v3/';
  access_token = process.env.eventbrite_private_token;
  organizationId = process.env.organization_id;

  fetchWithToken = async (url: string) => {
    let fetchedData = await fetch(url,
      {
        method: 'GET',
        headers: {
          Authorization: `BEARER ${this.access_token}`
        }
      });
    return await fetchedData.json();
  };

  getEventBriteEventsByOrg = async () => {
    let allEvents = await this.fetchWithToken(
      `${this.AUTH_URL}organizations/event/${this.organizationId}`
    );
    return allEvents.json();
  };
}