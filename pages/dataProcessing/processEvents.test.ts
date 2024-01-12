import { TrimExpiredEvents, SeparateStartedAndUpcomingEvents } from "./processEvents";

test('Array of 2 events successfully removes 1 expired event from TrimOldEvents', () => {
    expect(
        TrimExpiredEvents(
            [
                {end: {dateTime: "2024-01-10T12:00:00.000Z"}, start:{dateTime:""}}, 
                {end: {dateTime: "2024-01-10T19:00:00.000Z"}, start:{dateTime:""}}
            ], 
            new Date("2024-01-10T17:00:00.000Z")
        )
    ).toStrictEqual(
        [
            {end: {dateTime: "2024-01-10T19:00:00.000Z"}, start:{dateTime:""}}
        ]
    );
});

test('Array of 1 active event and 1 upcoming event successfully splits into 2 arrays', () => {
    expect(SeparateStartedAndUpcomingEvents(
        [
            {start: {dateTime: "2024-01-10T11:00:00.000Z"}, end:{dateTime:""}}, 
            {start: {dateTime: "2024-01-10T14:00:00.000Z"}, end:{dateTime:""}}
        ], 
        new Date("2024-01-10T12:00:00.000Z")
    )).toStrictEqual(
        {
            started: [{start: {dateTime: "2024-01-10T11:00:00.000Z"}, end:{dateTime:""}}],
            upcoming: [{start: {dateTime: "2024-01-10T14:00:00.000Z"}, end:{dateTime:""}}]
        }
    );
});