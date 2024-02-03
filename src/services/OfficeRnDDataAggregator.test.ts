import { OfficeRnDDataAggregator } from "./OfficeRnDDataAggregator";

test('combineMeetingRoomsAndFloors combines two single entry items that match', () => {
  const aggregator = new OfficeRnDDataAggregator();
  expect(
    aggregator.combineMeetingRoomsAndFloors(
      {"10": {_id: "10", name: "Test Floor"}},
      [{_id: "0", name: "Test Room", room: "10"}]
    )
  ).toStrictEqual(
    {"0": {_id: "0", name: "Test Room", room: "10", floor: "Test Floor"}}
  )
})

test('combineOfficeRnDDataIntoAppBookings combines a set of single entry data items correctly', () => {
  const aggregator = new OfficeRnDDataAggregator();
  expect(
    aggregator.combineOfficeRnDDataIntoAppBookings(
      [{_id: "3", name: "Test Floor"}],
      [{_id: "0", name: "Test Room", room: "3"}],
      [{
        _id: "1", 
        summary: "", 
        start: {dateTime: ""}, 
        end: {dateTime: ""}, 
        timezone: "", 
        resourceId: "0", 
        team: "2",
        member: ""
      }],
      [{_id: "2", name: "Test Team"}],
      [],
    )
  ).toStrictEqual(
    [{
      _id: "1",
      startDateTime: "",
      endDateTime: "",
      timezone: "",
      room: "Test Room",
      floor: "Test Floor",
      summary: "",
      host: "Test Team",
    }]
  )
})

test('combineOfficeRnDDataIntoAppBookings uses member name as host when no team', () => {
  const aggregator = new OfficeRnDDataAggregator();
  expect(
    aggregator.combineOfficeRnDDataIntoAppBookings(
      [],
      [],
      [{
        _id: "", 
        summary: "", 
        start: {dateTime: ""}, 
        end: {dateTime: ""}, 
        timezone: "", 
        resourceId: "", 
        team: "",
        member: "0"
      }],
      [],
      [{_id: "0", name: "Test Member"}],
    )
  ).toStrictEqual(
    [{
      _id: "",
      startDateTime: "",
      endDateTime: "",
      timezone: "",
      room: "no meeting room",
      floor: "no floor",
      summary: "",
      host: "Test Member",
    }]
  )
})