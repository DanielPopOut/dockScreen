export type OfficeRndMeetingRoom = {
  type: 'meeting_room';
  _id: string;
  name: string;
  room: string; // this is the floor id... I do not know why
};

// Below is an exmaple of the MeetingRoom type from the OfficeRnD API
// {
//   "access": {
//     "full": true,
//     "public": false,
//     "teams": [],
//     "plans": []
//   },
//   "availability": [
//     {
//       "startDate": "2021-01-09T00:00:00.000Z",
//       "endDate": null
//     }
//   ],
//   "_id": "5ffaa0035a32c02dd3ced40a",
//   "price": 0,
//   "deposit": 0,
//   "parents": [],
//   "type": "meeting_room",
//   "office": "office_id",
//   "name": "Name of the room",
//   "number": 3,
//   "size": 0,
//   "organization": "organization_id",
//   "createdAt": "2021-01-10T06:34:43.016Z",
//   "modifiedAt": "2023-09-27T21:53:48.154Z",
//   "createdBy": "5a9dd6415ca35614003a2e23",
//   "modifiedBy": "5a9dd6415ca35614003a2e23",
//   "room": "5ff27481c00c71652733ded9", // THIS IS THE FLOOR ID (I dont know why ?)
//   "target": "60003f85dc4fdf52684fa085",
//   "order": 9,
//   "area": 11148364.086504687,
//   "description": "text... decribing the room",
//   "rate": "61c390b444c98219db6f5181",
//   "image": "//imageURK",
//   "color": "#8bc34a",
//   "amenities": [
//     "5fe23608d3c7b60d706ef75a",
//     "5fe23608d3c7b687136ef75c"
//   ],
//   "timezone": "America/Vancouver",
//   "status": "meeting_room"
// }
