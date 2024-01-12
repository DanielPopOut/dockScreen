export function TrimExpiredEvents(events: any, dateTimeToCompare: Date) {
    return events.filter((event: any) => {
        const eventEndTime = new Date(event["end"]["dateTime"])
        return eventEndTime > dateTimeToCompare
    })
}