import { keyBy } from '../helpers/keyBy';
import { AppBooking, OfficeRndBooking } from './OfficeRnDTypes/Booking';
import { OfficeRnDFloor } from './OfficeRnDTypes/Floor';
import { OfficeRndMeetingRoom } from './OfficeRnDTypes/MeetingRoom';
import { OfficeRnDMember } from './OfficeRnDTypes/Member';

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

  getEventsWithMeetingRoomsAndHostingMember = async (
    dateStart: string,
    dateEnd: string,
  ): Promise<AppBooking[]> => {
    const meetingRoomsById = await this.getMeetingRoomsWithFloor();
    const events = await this.getEvents(dateStart, dateEnd);
    const membersById = await this.getMembers();
    const eventsWithMeetingRooms = events.map((event) => {
      const meetingRoom = meetingRoomsById[event.resourceId];
      const memberName = membersById[event.member];
      return {
        _id: event._id,
        summary: event.summary,
        title: event.summary,
        endDateTime: event.end?.dateTime,
        startDateTime: event.start?.dateTime,
        timezone: event.timezone,
        room: meetingRoom?.name || 'no meeting room',
        floor: meetingRoom?.floor || 'no floor',
        member: memberName?.name || 'no member',
      } as AppBooking;
    });
    return eventsWithMeetingRooms;
  };

  private getMeetingRoomsWithFloor = async () => {
    const floorsById = await this.getFloorsById();
    const meetingRooms = await this.getMeetingRooms();
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

  private getMembers = async () => {
    let currNextPointer = '';
    const baseGetMembersURL = `${this.BASE_API_URL}/members?$limit=100`;
    let membersArray = new Array<OfficeRnDMember>();
    do {
      const currURL =
        currNextPointer == ''
          ? baseGetMembersURL
          : baseGetMembersURL + `&$next=` + currNextPointer;

      let currFetch = await this.rawFetchWithToken<OfficeRnDMember[]>(currURL);
      const body = (await currFetch.json()) as OfficeRnDMember[];
      membersArray = membersArray.concat(body);
      const fetchNextCursor = currFetch.headers.get('rnd-cursor-next');
      currNextPointer = fetchNextCursor != null ? fetchNextCursor : '';
    } while (currNextPointer != '');
    return keyBy(membersArray, '_id');
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
