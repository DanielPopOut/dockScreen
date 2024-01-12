import { TrimOldEvents } from "./processEvents";

test('Array of 2 events successfully removes 1 expired event from TrimOldEvents', () => {
    expect(TrimOldEvents(
            [{end: {dateTime: "2024-01-10T12:00:00.000Z"}}, {end: {dateTime: "2024-01-10T19:00:00.000Z"}}], 
            new Date("2024-01-10T17:00:00.000Z"))
        ).toStrictEqual(
            [{end: {dateTime: "2024-01-10T19:00:00.000Z"}}]
        );
  });