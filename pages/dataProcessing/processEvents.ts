export type OfficeRnDEvent = {
    start: {dateTime: string};
    end: {dateTime: string};
}

export function TrimExpiredEvents(events: Array<OfficeRnDEvent>, dateTimeToCompare: Date) {
    return events.filter((event: any) => {
        const eventEndTime = new Date(event["end"]["dateTime"]);
        return eventEndTime > dateTimeToCompare;
    })
}

export function SeparateStartedAndUpcomingEvents(events: Array<OfficeRnDEvent>, dateTimeToCompare: Date) {
    let out = {started: Array<OfficeRnDEvent>(), upcoming: Array<OfficeRnDEvent>()};
    for(let i=0; i < Object.keys(events).length; i++) {
        const item: any = events[i];
        if (new Date(item["start"]["dateTime"]) < dateTimeToCompare) {
            out["started"].push(item)
        } else {
            out["upcoming"].push(item)
        }
    }
    return out
}

// We check for currentEvent in the SeparateStartedAndUpcomingEventsFromEventBrite so don't need to iterate array twice
// Function is Shamelessly stolen from Aiden
export function SeparateStartedAndUpcomingEventsFromEventBrite(events: Array<OfficeRnDEvent>, dateTimeToCompare: Date) {
    let out = {started: Array<OfficeRnDEvent>(), upcoming: Array<OfficeRnDEvent>()};
    let previousDate = new Date();
    previousDate.setDate(dateTimeToCompare.getDate() - 1);
    for(let i=0; i < Object.keys(events).length; i++) {
        const item: any = events[i];
        if (new Date(item["start"]["utc"]) == previousDate) {
            out["started"].push(item)
        } else if (new Date(item["start"]["utc"]) >= dateTimeToCompare) {
            out["upcoming"].push(item)
        }
    }
    return out
}