import { TrimExpiredEvents, SeparateActiveAndUpcomingEvents } from "./processEvents";

test('Array of 2 events successfully removes 1 expired event from TrimOldEvents', () => {
    expect(
        TrimExpiredEvents(
            [
                {end: {dateTime: "2024-01-10T12:00:00.000Z"}}, 
                {end: {dateTime: "2024-01-10T19:00:00.000Z"}}
            ], 
            new Date("2024-01-10T17:00:00.000Z")
        )
    ).toStrictEqual(
        [
            {end: {dateTime: "2024-01-10T19:00:00.000Z"}}
        ]
    );
});

test('Array of 1 active event and 1 upcoming event successfully splits into 2 arrays', () => {
    expect(SeparateActiveAndUpcomingEvents(
        [
            {start: {dateTime: "2024-01-10T11:00:00.000Z"}, end: {dateTime: "2024-01-10T13:00:00.000Z"}}, 
            {start: {dateTime: "2024-01-10T14:00:00.000Z"}, end: {dateTime: "2024-01-10T16:00:00.000Z"}}
        ], 
        new Date("2024-01-10T17:00:00.000Z")
    )).toStrictEqual({
        active: [{start: {dateTime: "2024-01-10T11:00:00.000Z"}, end: {dateTime: "2024-01-10T13:00:00.000Z"}}],
        upcoming: [{start: {dateTime: "2024-01-10T14:00:00.000Z"}, end: {dateTime: "2024-01-10T16:00:00.000Z"}}]
    }
    );
});