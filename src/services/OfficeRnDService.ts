import { keyBy } from '../helpers/keyBy';
import { AppBooking, OfficeRndBooking } from './OfficeRnDTypes/Booking';
import { OfficeRnDFloor } from './OfficeRnDTypes/Floor';
import { OfficeRndMeetingRoom } from './OfficeRnDTypes/MeetingRoom';
import { OfficeRnDTeam } from './OfficeRnDTypes/Team';

export class OfficeRnDService {
  BASE_API_URL = 'https://app.officernd.com/api/v1/organizations/thedock';
  access_token = '';
  private authenticate = async () => {
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

  private rawFetchWithToken = async <T extends {}>(url: string) => {
    const token = await this.authenticate();
    let fetchedData = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'insomnia/2023.5.8',
        Authorization: 'Bearer ' + token,
      },
    });
    return fetchedData;
  };

  private fetchWithToken = async <T extends {}>(url: string) => {
    let fetchedData = await this.rawFetchWithToken(url);
    return (await fetchedData.json()) as T;
  };

  private getEvents = async (dateStart: string, dateEnd: string) => {
    let fetchedData = await this.fetchWithToken<OfficeRndBooking[]>(
      `${this.BASE_API_URL}/bookings?seriesStart.$gte=` +
        dateStart +
        '&seriesStart.$lte=' +
        dateEnd,
    );
    return fetchedData;
  };

  getEventsWithMeetingRoomsAndHostingTeam = async (
    dateStart: string,
    dateEnd: string,
  ): Promise<AppBooking[]> => {
    const meetingRoomsById = await this.getMeetingRoomsWithFloor();
    const events = await this.getEvents(dateStart, dateEnd);
    const teamsById = await this.getTeams();
    return this.combineOfficeRnDData(
      meetingRoomsById,
      events,
      teamsById
    );
  };

  combineOfficeRnDData = (
    meetingRoomsById: Record<string, {
      floor: string;
      _id: string;
      name: string;
      room: string;
    }>,
    events: OfficeRndBooking[],
    teamsById: Record<string, OfficeRnDTeam>,
  ): AppBooking[] => {
    const eventsWithMeetingRooms = events.map((event) => {
      const meetingRoom = meetingRoomsById[event.resourceId];
      const teamName = teamsById[event.team];
      return {
        _id: event._id,
        summary: event.summary,
        title: event.summary,
        endDateTime: event.end?.dateTime,
        startDateTime: event.start?.dateTime,
        timezone: event.timezone,
        room: meetingRoom?.name || 'no meeting room',
        floor: meetingRoom?.floor || 'no floor',
        team: teamName?.name || 'no team',
      } as AppBooking;
    });
    return eventsWithMeetingRooms;
  };

  private getMeetingRoomsWithFloor = async () => {
    return this.combineMeetingRoomsAndFloors(
      await this.getFloorsById(),
      await this.getMeetingRooms()
    )
  };

  combineMeetingRoomsAndFloors = (
    floorsById : Record<string, OfficeRnDFloor>,
    meetingRooms: OfficeRndMeetingRoom[]
  ) => {
    const meetingRoomsWithFloor = meetingRooms.map((meetingRoom) => {
      const floor = floorsById[meetingRoom.room];
      return {
        ...meetingRoom,
        floor: floor?.name || 'no floor',
      };
    });
    return keyBy(meetingRoomsWithFloor, '_id');
  };

  private getMeetingRooms = async () => {
    let meetingRooms = await this.fetchWithToken<OfficeRndMeetingRoom[]>(
      `${this.BASE_API_URL}/resources?type=meeting_room`,
    );
    return meetingRooms;
  };

  private getFloorsById = async () => {
    let floorsArray = await this.fetchWithToken<OfficeRnDFloor[]>(
      `${this.BASE_API_URL}/floors`,
    );
    return keyBy(floorsArray, '_id');
  };

  private getTeams = async () => {
    let currNextPointer = '';
    const baseGetTeamsURL = `${this.BASE_API_URL}/teams?$limit=100`;
    let teamsArray = new Array<OfficeRnDTeam>();
    do {
      const currURL =
        currNextPointer == ''
          ? baseGetTeamsURL
          : baseGetTeamsURL + `&$next=` + currNextPointer;

      let currFetch = await this.rawFetchWithToken<OfficeRnDTeam[]>(currURL);
      const body = (await currFetch.json()) as OfficeRnDTeam[];
      teamsArray = teamsArray.concat(body);
      const fetchNextCursor = currFetch.headers.get('rnd-cursor-next');
      currNextPointer = fetchNextCursor != null ? fetchNextCursor : '';
    } while (currNextPointer != '');
    return keyBy(teamsArray, '_id');
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
