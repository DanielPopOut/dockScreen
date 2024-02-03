import { OfficeRndBooking, AppBooking } from "./OfficeRnDTypes/Booking";
import { OfficeRnDTeam } from "./OfficeRnDTypes/Team";
import { OfficeRndMeetingRoom } from "./OfficeRnDTypes/MeetingRoom";
import { OfficeRnDFloor } from "./OfficeRnDTypes/Floor";
import { keyBy } from "../helpers/keyBy";
import { OfficeRnDMember } from "./OfficeRnDTypes/Member";

export class OfficeRnDDataAggregator {
  combineOfficeRnDDataIntoAppBookings = (
    floors: OfficeRnDFloor[],
    meetingRooms: OfficeRndMeetingRoom[],
    events: OfficeRndBooking[],
    teams: OfficeRnDTeam[],
    members: OfficeRnDMember[],
  ): AppBooking[] => {
    const floorsById = keyBy(floors, '_id');
    const teamsById = keyBy(teams, '_id');
    const meetingRoomsById = this.combineMeetingRoomsAndFloors(
      floorsById, meetingRooms
    );
    const membersById = keyBy(members, '_id');
    const eventsWithMeetingRooms = events.map((event) => {
      const meetingRoom = meetingRoomsById[event.resourceId];
      const team = teamsById[event.team];
      const member = membersById[event.member];
      return {
        _id: event._id,
        summary: event.summary,
        endDateTime: event.end?.dateTime,
        startDateTime: event.start?.dateTime,
        timezone: event.timezone,
        room: meetingRoom?.name || 'no meeting room',
        floor: meetingRoom?.floor || 'no floor',
        host: team?.name || member?.name || 'no host',
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