export class OfficeRnDService {
  BASE_API_URL = 'https://app.officernd.com/api/v1/organizations/thedock';
  access_token = '';
  authenticate = async () => {
    if (this.access_token) {
      return this.access_token;
    }
    let fetchedData = await fetch(
      'https://identity.officernd.com/oauth/token',
      AuthOptions,
    );
    const answer: { access_token: string } = await fetchedData.json();
    this.access_token = answer.access_token;
    return this.access_token;
  };

  fetchWithToken = async (url: string) => {
    const token = await this.authenticate();
    let fetchedData = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'insomnia/2023.5.8',
        Authorization: 'Bearer ' + token,
      },
    });
    return await fetchedData.json();
  };

  getEvent = async (dateStart: string, dateEnd: string) => {
    let fetchedData = await this.fetchWithToken(
      `${this.BASE_API_URL}/bookings?seriesStart.%24gte=` +
        dateStart +
        '&seriesStart.%24lte=' +
        dateEnd,
    );
    return fetchedData;
  };

  getMeetingRooms = async () => {
    let fetchedData = await this.fetchWithToken(
      `${this.BASE_API_URL}/resources?type=meeting_room`,
    );
    return fetchedData;
  };
}

const AuthOptions = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'User-Agent': 'insomnia/2023.5.8',
  },
  body: new URLSearchParams({
    client_id: process.env.client_id as string,
    client_secret: process.env.client_secret as string,
    grant_type: 'client_credentials',
    scope: 'officernd.api.read',
  }),
};
