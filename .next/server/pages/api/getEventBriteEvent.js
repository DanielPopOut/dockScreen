"use strict";
(() => {
var exports = {};
exports.id = 17;
exports.ids = [17];
exports.modules = {

/***/ 991:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ handler)
});

// EXTERNAL MODULE: ./src/misc/dataProcessing/processEvents.ts
var processEvents = __webpack_require__(529);
;// CONCATENATED MODULE: ./src/services/EventBriteService.ts
class EventBriteService {
    AUTH_URL = "https://www.eventbriteapi.com/v3/";
    access_token = process.env.eventbrite_private_token;
    organizationId = process.env.organization_id;
    organizer_id = process.env.organizer_id;
    fetchWithToken = async (url)=>{
        let fetchedData = await fetch(url, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${this.access_token}`
            }
        });
        return await fetchedData.json();
    };
    // Pagination
    getEventBriteEventsByOrg = async (time_filter = "current_future")=>{
        // Query time_filter can help filter out expired event. page_size is 1000 in case of pagination problems. order_by asc in query so we don't need to sort it.
        let urlWithQuery;
        urlWithQuery = `${this.AUTH_URL}organizations/${this.organizationId}/events?time_filter=${time_filter}&order_by=start_asc&page_size=1000&organizer_filter=${this.organizer_id}`;
        let allEvents = await this.fetchWithToken(urlWithQuery);
        return convertEventBriteDataArray(allEvents.events);
    };
}
const convertEventBriteData = (eventBriteData)=>{
    let processedEventBriteData = {
        location: eventBriteData["venue_id"],
        name: eventBriteData["name"]["text"],
        startDateTime: eventBriteData["start"]["utc"],
        endDateTime: eventBriteData["end"]["utc"],
        timeStart: new Date(eventBriteData["start"]["utc"]).toLocaleTimeString(),
        timeEnd: new Date(eventBriteData["end"]["utc"]).toLocaleTimeString(),
        description: eventBriteData["description"]["text"],
        picUrl: eventBriteData["logo"]["url"]
    };
    return processedEventBriteData;
};
const convertEventBriteDataArray = (eventBriteData)=>{
    return eventBriteData.map(convertEventBriteData);
};

;// CONCATENATED MODULE: ./pages/api/getEventBriteEvent.ts
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction


function convertTestDate(lessEventOption = false, option = "en") {
    if (option == "de") {
        if (lessEventOption) {
            return "24.10.2023";
        }
        return "21.09.2023";
    } else if (option == "fr") {
        if (lessEventOption) {
            return "24/10/2023";
        }
        return "21/09/2023";
    }
    if (lessEventOption) {
        return "10/24/2023";
    }
    return "9/21/2023";
}
async function handler(req, res) {
    const date = new Date();
    const test = true;
    let nowDate = date.toLocaleDateString();
    if (test) {
        nowDate = convertTestDate(true); // en-US
    // const nowDate = "21.09.2023"; // de-DE
    // const nowDate = "21/09/2023"; // fr-FR
    }
    date.setDate(date.getDate() + 2);
    const eventBriteService = new EventBriteService();
    const eventBriteEvents = await eventBriteService.getEventBriteEventsByOrg();
    // order_by asc in query so we don't need to sort it.
    let returnResult;
    if (test) {
        returnResult = (0,processEvents/* SeparateStartedAndUpcomingEvents */.R)(eventBriteEvents, new Date(nowDate));
    } else {
        returnResult = (0,processEvents/* SeparateStartedAndUpcomingEvents */.R)(eventBriteEvents, new Date());
    }
    res.status(200).json(returnResult);
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
var __webpack_exports__ = (__webpack_exec__(991));
module.exports = __webpack_exports__;

})();