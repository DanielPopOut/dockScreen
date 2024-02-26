import { ProcessedEventBriteData } from "@/src/services/EventBriteService";
import { AppBooking } from "@/src/services/OfficeRnDTypes/Booking";

export function TrimExpiredEvents(events: Array<AppBooking>, dateTimeToCompare: Date) {
    return events.filter((event) => {
        const eventEndTime = new Date(event.endDateTime);
        return eventEndTime > dateTimeToCompare;
    })
}

interface HasStartDateTime {
    startDateTime: string;
}

export function SeparateStartedAndUpcomingEvents<T extends HasStartDateTime>(events: Array<T>, dateTimeToCompare: Date) {
    let out = {started: Array<T>(), upcoming: Array<T>()};
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
