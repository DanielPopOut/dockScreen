export type OfficeRndBooking = {
  _id: string;
  summary: string;
  start: {
    dateTime: string;
  };
  end: {
    dateTime: string;
  };
  timezone: string;
  resourceId: string;
  team: string;
  member: string;
};

export type AppBooking = {
  _id: string;
  startDateTime: string;
  endDateTime: string;
  timezone: string;
  room: string;
  floor: string;
  summary: string;
  team: string;
  member: string;
};

// Below is an exmaple of the Booking type from the OfficeRnD API
// {
//   "createdAt": "2023-08-15T04:30:25.554Z",
//   "createdBy": "63505d666b5233e62032f574",
//   "modifiedAt": "2023-11-16T19:55:31.993Z",
//   "modifiedBy": "63fd08487a57c300078e93df",
//   "organization": "5fe23607d3c7b61e5d6ef706",
//   "start": {
//     "dateTime": "2024-01-13T16:00:00.000Z",
//     "date": null
//   },
//   "end": {
//     "dateTime": "2024-01-14T00:00:00.000Z",
//     "date": null
//   },
//   "serviceSlots": {
//     "before": 0,
//     "after": 0
//   },
//   "timezone": "America/Vancouver",
//   "source": "portal",
//   "gcalId": "googleCalID??",
//   "summary": "description of the booking",
//   "seriesStart": "2024-01-13T16:00:00.000Z",
//   "seriesEnd": "2024-01-14T00:00:00.000Z",
//   "recurrence": {
//     "rrule": null
//   },
//   "fees": [],
//   "resourceId": "600638f94c6ea94c6dddc709",
//   "team": "63505d666b5233c8d432f585",
//   "member": "63505d666b52330ae632f58d",
//   "visitors": [],
//   "members": [],
//   "plan": "5ffa920d5a32c02dd4ce93f3",
//   "accountedUntil": null,
//   "free": false,
//   "tentative": true,
//   "canceled": true,
//   "accounted": true,
//   "reference": "G35X86D",
//   "office": "5ff26d59e7d284ecce7b5e74",
//   "_id": "64daff61c1a625f9053d5ece"
// }
