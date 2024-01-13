export type MeetingRoomInfo = {
  _id: string,
  name: string
}

export function ResolveMeetingRoomName(id: string, rooms: Array<MeetingRoomInfo>) {
  for (let i=0; i<rooms.length; i++) {
    if (id == rooms[i]._id) {
      return rooms[i].name;
    }
  }
  return "Error finding room name.";
}