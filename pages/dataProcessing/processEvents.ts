import { ProcessedEventBriteData } from "@/src/services/EventBriteService";
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

// We check for currentEvent in the SeparateStartedAndUpcomingEventsFromEventBrite so don't need to iterate array twice
// Function is Shamelessly stolen from Aiden
export function SeparateStartedAndUpcomingEventsFromEventBrite(events: Array<ProcessedEventBriteData>, dateTimeToCompare: Date) {
    let out = {started: Array<ProcessedEventBriteData>(), upcoming: Array<ProcessedEventBriteData>()};
    let previousDate = new Date();
    previousDate.setDate(dateTimeToCompare.getDate() - 1);
    for(let i=0; i < Object.keys(events).length; i++) {
        const item = events[i];
        if (new Date(item.timeStart) == previousDate) {
            out["started"].push(item)
        } else if (new Date(item.timeStart) >= dateTimeToCompare) {
            out["upcoming"].push(item)
        }
    }
    return out
}