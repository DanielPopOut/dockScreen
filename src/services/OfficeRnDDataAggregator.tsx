import { OfficeRndBooking, AppBooking } from "./OfficeRnDTypes/Booking";
import { OfficeRnDTeam } from "./OfficeRnDTypes/Team";
import { OfficeRndMeetingRoom } from "./OfficeRnDTypes/MeetingRoom";
import { OfficeRnDFloor } from "./OfficeRnDTypes/Floor";
import { keyBy } from "../helpers/keyBy";

export class OfficeRnDDataAggregator {
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
}