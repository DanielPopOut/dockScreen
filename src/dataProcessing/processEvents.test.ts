import { AppBooking } from '@/src/services/OfficeRnDTypes/Booking';
import {
  SeparateStartedAndUpcomingEvents,
  TrimExpiredEvents,
} from './processEvents';

test('Array of 2 events successfully removes 1 expired event from TrimOldEvents', () => {
  expect(
    TrimExpiredEvents(
      [
        { endDateTime: '2024-01-10T12:00:00.000Z', startDateTime: '' },
        { endDateTime: '2024-01-10T19:00:00.000Z', startDateTime: '' },
      ] as AppBooking[],
      new Date('2024-01-10T17:00:00.000Z'),
    ),
  ).toStrictEqual([
    { endDateTime: '2024-01-10T19:00:00.000Z', startDateTime: '' },
  ]);
});

test('Array of 1 active event and 1 upcoming event successfully splits into 2 arrays', () => {
  expect(
    SeparateStartedAndUpcomingEvents(
      [
        { startDateTime: '2024-01-10T11:00:00.000Z', endDateTime: '' },
        { startDateTime: '2024-01-10T14:00:00.000Z', endDateTime: '' },
      ] as AppBooking[],
      new Date('2024-01-10T12:00:00.000Z'),
    ),
  ).toStrictEqual({
    started: [{ startDateTime: '2024-01-10T11:00:00.000Z', endDateTime: '' }],
    upcoming: [{ startDateTime: '2024-01-10T14:00:00.000Z', endDateTime: '' }],
  });
});
