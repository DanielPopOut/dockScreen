"use strict";
(() => {
var exports = {};
exports.id = 428;
exports.ids = [428];
exports.modules = {

/***/ 727:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ handler)
});

// EXTERNAL MODULE: ./src/misc/dataProcessing/processEvents.ts
var processEvents = __webpack_require__(529);
;// CONCATENATED MODULE: ./src/helpers/keyBy.ts
const keyBy = (array, key)=>{
    return (array || []).reduce((r, x)=>({
            ...r,
            [x[key]]: x
        }), {});
}; // EXAMPLE:
 // const data = [
 //   { id: 1, name: 'John' },
 //   { id: 2, name: 'Jane' },
 //   { id: 3, name: 'Mario' },
 // ];
 //
 // const result = keyBy(data, 'id');
 //
 // console.log(result);
 // // {
 // //   1: { id: 1, name: 'John' },
 // //   2: { id: 2, name: 'Jane' },
 // //   3: { id: 3, name: 'Mario' },
 // // }

;// CONCATENATED MODULE: ./src/services/OfficeRnDDataAggregator.tsx

class OfficeRnDDataAggregator {
    combineOfficeRnDDataIntoAppBookings = (floors, meetingRooms, events, teams, members)=>{
        const floorsById = keyBy(floors, "_id");
        const teamsById = keyBy(teams, "_id");
        const meetingRoomsById = this.combineMeetingRoomsAndFloors(floorsById, meetingRooms);
        const membersById = keyBy(members, "_id");
        const eventsWithMeetingRooms = events.map((event)=>{
            const meetingRoom = meetingRoomsById[event.resourceId];
            const team = teamsById[event.team];
            const member = membersById[event.member];
            return {
                _id: event._id,
                summary: event.summary,
                endDateTime: event.end?.dateTime,
                startDateTime: event.start?.dateTime,
                timezone: event.timezone,
                room: meetingRoom?.name || "no meeting room",
                floor: meetingRoom?.floor || "no floor",
                host: team?.name || member?.name || "no host"
            };
        });
        return eventsWithMeetingRooms;
    };
    combineMeetingRoomsAndFloors = (floorsById, meetingRooms)=>{
        const meetingRoomsWithFloor = meetingRooms.map((meetingRoom)=>{
            const floor = floorsById[meetingRoom.room];
            return {
                ...meetingRoom,
                floor: floor?.name || "no floor"
            };
        });
        return keyBy(meetingRoomsWithFloor, "_id");
    };
}

;// CONCATENATED MODULE: ./src/services/OfficeRnDService.ts

class OfficeRnDService {
    BASE_API_URL = "https://app.officernd.com/api/v1/organizations/thedock";
    access_token = "";
    aggregator = new OfficeRnDDataAggregator();
    authenticate = async ()=>{
        if (this.access_token) {
            return this.access_token;
        }
        let fetchedData = await fetch("https://identity.officernd.com/oauth/token", AuthOptions);
        const answer = await fetchedData.json();
        this.access_token = answer.access_token;
        return this.access_token;
    };
    rawFetchWithToken = async (url)=>{
        const token = await this.authenticate();
        let fetchedData = await fetch(url, {
            method: "GET",
            headers: {
                "User-Agent": "insomnia/2023.5.8",
                Authorization: "Bearer " + token
            }
        });
        return fetchedData;
    };
    fetchWithToken = async (url)=>{
        let fetchedData = await this.rawFetchWithToken(url);
        return await fetchedData.json();
    };
    getEvents = async (dateStart, dateEnd)=>{
        let fetchedData = await this.fetchWithToken(`${this.BASE_API_URL}/bookings?seriesStart.$gte=` + dateStart + "&seriesStart.$lte=" + dateEnd);
        return fetchedData;
    };
    getEventsWithMeetingRoomsAndHostingTeam = async (dateStart, dateEnd)=>{
        const floors = await this.getFloors();
        const meetingRooms = await this.getMeetingRooms();
        const events = await this.getEvents(dateStart, dateEnd);
        const teams = await this.getTeams();
        const members = await this.getMembers(events);
        return this.aggregator.combineOfficeRnDDataIntoAppBookings(floors, meetingRooms, events, teams, members);
    };
    getMeetingRooms = async ()=>{
        let meetingRooms = await this.fetchWithToken(`${this.BASE_API_URL}/resources?type=meeting_room`);
        return meetingRooms;
    };
    getFloors = async ()=>{
        let floorsArray = await this.fetchWithToken(`${this.BASE_API_URL}/floors`);
        return floorsArray;
    };
    getTeams = async ()=>{
        let currNextPointer = "";
        const baseGetTeamsURL = `${this.BASE_API_URL}/teams?$limit=100`;
        let teamsArray = new Array();
        do {
            const currURL = currNextPointer == "" ? baseGetTeamsURL : baseGetTeamsURL + `&$next=` + currNextPointer;
            let currFetch = await this.rawFetchWithToken(currURL);
            const body = await currFetch.json();
            teamsArray = teamsArray.concat(body);
            const fetchNextCursor = currFetch.headers.get("rnd-cursor-next");
            currNextPointer = fetchNextCursor != null ? fetchNextCursor : "";
        }while (currNextPointer != "");
        return teamsArray;
    };
    getMembers = async (bookings)=>{
        const memberPromises = bookings.map((booking)=>{
            return this.getMember(booking);
        });
        return Promise.all(memberPromises);
    };
    getMember = async (booking)=>{
        return this.fetchWithToken(`${this.BASE_API_URL}/members/${booking.member}`);
    };
}
const AuthOptions = {
    method: "POST",
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "insomnia/2023.5.8"
    },
    body: new URLSearchParams({
        client_id: process.env.client_id,
        client_secret: process.env.client_secret,
        grant_type: "client_credentials",
        scope: "officernd.api.read"
    })
};

;// CONCATENATED MODULE: ./pages/api/getEvents.ts
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction


async function handler(req, res) {
    const date = new Date();
    const nowDate = date.toLocaleDateString();
    date.setDate(date.getDate() + 2);
    const tomorrowDate = date.toLocaleDateString();
    console.log(nowDate, tomorrowDate);
    const officeRNDService = new OfficeRnDService();
    const events = await officeRNDService.getEventsWithMeetingRoomsAndHostingTeam(nowDate, tomorrowDate);
    const todayEvents = events.filter((event)=>{
        return new Date(event.startDateTime).toLocaleDateString() == nowDate;
    });
    const todayEventsSorted = todayEvents.sort(function(a, b) {
        return new Date(a.startDateTime).getTime() - new Date(b.endDateTime).getTime();
    });
    const eventsToShow = (0,processEvents/* SeparateStartedAndUpcomingEvents */.R)((0,processEvents/* TrimExpiredEvents */.b)(todayEventsSorted, new Date()), new Date());
    res.status(200).json(eventsToShow);
}


/***/ }),

/***/ 529:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "R": () => (/* binding */ SeparateStartedAndUpcomingEvents),
/* harmony export */   "b": () => (/* binding */ TrimExpiredEvents)
/* harmony export */ });
function TrimExpiredEvents(events, dateTimeToCompare) {
    return events.filter((event)=>{
        const eventEndTime = new Date(event.endDateTime);
        return eventEndTime > dateTimeToCompare;
    });
}
function SeparateStartedAndUpcomingEvents(events, dateTimeToCompare) {
    let out = {
        started: Array(),
        upcoming: Array()
    };
    for(let i = 0; i < Object.keys(events).length; i++){
        const item = events[i];
        if (new Date(item.startDateTime) < dateTimeToCompare) {
            out.started.push(item);
        } else {
            out.upcoming.push(item);
        }
    }
    return out;
}


/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__(727));
module.exports = __webpack_exports__;

})();