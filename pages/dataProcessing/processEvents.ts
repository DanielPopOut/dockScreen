import { AppBooking } from "@/src/services/OfficeRnDTypes/Booking";

export function TrimExpiredEvents(events: Array<AppBooking>, dateTimeToCompare: Date) {
    return events.filter((event) => {
        const eventEndTime = new Date(event.endDateTime);
        return eventEndTime > dateTimeToCompare;
    })
}

export function SeparateStartedAndUpcomingEvents(events: Array<AppBooking>, dateTimeToCompare: Date) {
    let out = {started: Array<AppBooking>(), upcoming: Array<AppBooking>()};
    for(let i=0; i < Object.keys(events).length; i++) {
        const item = events[i];
        if (new Date(item.startDateTime) < dateTimeToCompare) {
            out.started.push(item)
        } else {
            out.upcoming.push(item)
        }
    }
    return out
}