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