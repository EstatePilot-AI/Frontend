# Pagination API Documentation — Leads & Call Logs

## Overview

Both the **Leads** and **Call Logs** endpoints use the same offset-based pagination pattern. All pagination metadata is returned in the JSON response body (no custom headers).

---

## Shared Response Structure

Every paginated endpoint returns a `PaginatedResult<T>`:

```json
{
  "data": [ ... ],
  "totalCount": 150,
  "pageNumber": 1,
  "pageSize": 10,
  "totalPages": 15,
  "hasPreviousPage": false,
  "hasNextPage": true
}
```

| Field              | Type       | Description                                    |
| ------------------ | ---------- | ---------------------------------------------- |
| `data`             | `T[]`      | Array of items for the current page            |
| `totalCount`       | `int`      | Total number of matching records (all pages)   |
| `pageNumber`       | `int`      | Current page number (1-based)                  |
| `pageSize`         | `int`      | Number of items per page                       |
| `totalPages`       | `int`      | Total number of pages (`ceil(totalCount/size)`)|
| `hasPreviousPage`  | `bool`     | `true` if `pageNumber > 1`                     |
| `hasNextPage`      | `bool`     | `true` if `pageNumber < totalPages`            |

---

## Pagination Parameters

Both endpoints share these pagination query parameters:

| Parameter     | Type   | Default | Min | Max  | Description          |
| ------------- | ------ | ------- | --- | ---- | -------------------- |
| `pageNumber`  | `int`  | `1`     | `1` | —    | Page number (1-based)|
| `pageSize`    | `int`  | `10`    | `1` | `50` | Items per page       |

> Values outside bounds are automatically clamped: `pageNumber < 1` → `1`, `pageSize < 1` → `10`, `pageSize > 50` → `50`.

---

## Leads

### Endpoint

```
GET /api/LeadRequest/GetAllLeads
GET /api/LeadRequest/FilterLeads   (alias — identical behavior)
```

> **Authorization:** `Bearer` token required. Role: `superadmin`.

### Query Parameters

| Parameter    | Type      | Required | Description                                       |
| ------------ | --------- | -------- | ------------------------------------------------- |
| `pageNumber` | `int`     | No       | Page number (default: `1`)                        |
| `pageSize`   | `int`     | No       | Page size (default: `10`, max: `50`)              |
| `statusId`   | `int?`    | No       | Filter by lead status ID                          |
| `searchTerm` | `string?` | No       | Search in **buyer name** and **phone number**     |

### Sorting

Hardcoded: **`RequestId` DESC** (newest leads first). Not configurable via query.

### Response Item Shape

```json
{
  "requestId": 45,
  "buyerName": "Ahmed Mohamed",
  "buyerPhone": "+201234567890",
  "statusName": "Pending Call"
}
```

| Field        | Type     | Description               |
| ------------ | -------- | ------------------------- |
| `requestId`  | `int`    | Lead request ID           |
| `buyerName`  | `string` | Buyer name                |
| `buyerPhone` | `string` | Contact phone number      |
| `statusName` | `string` | Lead status display name  |

### Example Requests

```bash
# First page, default size (10)
GET /api/LeadRequest/GetAllLeads

# Page 2 with 20 items per page
GET /api/LeadRequest/GetAllLeads?pageNumber=2&pageSize=20

# Filter by status + search
GET /api/LeadRequest/GetAllLeads?statusId=1&searchTerm=Ahmed

# Combined: page 3, size 25, filtered
GET /api/LeadRequest/GetAllLeads?pageNumber=3&pageSize=25&statusId=2&searchTerm=Ali
```

### Example Response

```json
{
  "data": [
    {
      "requestId": 45,
      "buyerName": "Ahmed Mohamed",
      "buyerPhone": "+201234567890",
      "statusName": "Pending Call"
    },
    {
      "requestId": 42,
      "buyerName": "Ali Hassan",
      "buyerPhone": "+201198765432",
      "statusName": "Pending Call"
    }
  ],
  "totalCount": 150,
  "pageNumber": 2,
  "pageSize": 20,
  "totalPages": 8,
  "hasPreviousPage": true,
  "hasNextPage": true
}
```

### Supporting Endpoint: Get Status List

Use this to populate the `statusId` filter dropdown:

```
GET /api/LeadRequest/GetStatusList
```

---

## Call Logs

### Endpoint

```
GET /api/CallLog/GetAllCallLogs
```

> **Authorization:** `Bearer` token required. Role: `superadmin`.

### Query Parameters

| Parameter           | Type       | Required | Description                                           |
| ------------------- | ---------- | -------- | ----------------------------------------------------- |
| `pageNumber`        | `int`      | No       | Page number (default: `1`)                            |
| `pageSize`          | `int`      | No       | Page size (default: `10`, max: `50`)                  |
| `callOutcomeId`     | `int?`     | No       | Filter by call outcome (`1`=Interested, `2`=NotInterested, `3`=NotAnswer, `4`=Failed) |
| `callSessionStateId`| `int?`     | No       | Filter by call session state ID                       |
| `fromDate`          | `DateTime?`| No       | Filter calls **on or after** this date (`YYYY-MM-DD`) |
| `toDate`            | `DateTime?`| No       | Filter calls **up to and including** this date (`YYYY-MM-DD`) |
| `searchTerm`        | `string?`  | No       | Search in **contact name**                            |

> **Date range:** `toDate` is inclusive — the backend adds 1 day internally so the entire target day is covered.

### Call Outcome Values (`callOutcomeId`)

| Value | Name              |
| ----- | ----------------- |
| `1`   | Interested        |
| `2`   | Not Interested    |
| `3`   | Not Answer        |
| `4`   | Failed            |

### Sorting

Hardcoded: **`Timestamp` DESC** (most recent calls first). Not configurable via query.

### Response Item Shape

```json
{
  "callId": 123,
  "buyerName": "Ali Hassan",
  "callOutcome": "Interested",
  "callType": "Buyer Inquiry",
  "callSessionState": "Answered",
  "duration": 180,
  "timeStamp": "2h ago"
}
```

| Field              | Type     | Description                                    |
| ------------------ | -------- | ---------------------------------------------- |
| `callId`           | `int`    | Call log ID                                    |
| `buyerName`        | `string` | Contact name                                   |
| `callOutcome`      | `string` | Outcome display name                           |
| `callType`         | `string` | Subject/type display name                      |
| `callSessionState` | `string` | Session state display name                     |
| `duration`         | `int`    | Call duration in seconds                       |
| `timeStamp`        | `string` | Relative time string (e.g. `"5m ago"`, `"2d ago"`, `"Jan 15"`) |

> `timeStamp` is a human-readable relative time computed server-side.

### Example Requests

```bash
# First page, default size
GET /api/CallLog/GetAllCallLogs

# Page 2, 20 per page
GET /api/CallLog/GetAllCallLogs?pageNumber=2&pageSize=20

# Filter by outcome + date range
GET /api/CallLog/GetAllCallLogs?callOutcomeId=1&fromDate=2026-04-01&toDate=2026-04-18

# Combined filters with search
GET /api/CallLog/GetAllCallLogs?pageNumber=1&pageSize=10&callOutcomeId=3&searchTerm=Ali
```

### Example Response

```json
{
  "data": [
    {
      "callId": 123,
      "buyerName": "Ali Hassan",
      "callOutcome": "Interested",
      "callType": "Buyer Inquiry",
      "callSessionState": "Answered",
      "duration": 180,
      "timeStamp": "2h ago"
    },
    {
      "callId": 119,
      "buyerName": "Sara Ahmed",
      "callOutcome": "Not Answer",
      "callType": "Follow Up",
      "callSessionState": "Ringing",
      "duration": 0,
      "timeStamp": "5h ago"
    }
  ],
  "totalCount": 45,
  "pageNumber": 1,
  "pageSize": 10,
  "totalPages": 5,
  "hasPreviousPage": false,
  "hasNextPage": true
}
```

### Supporting Endpoint: Get Call Outcomes

Use this to populate the `callOutcomeId` filter dropdown:

```
GET /api/CallLog/GetCallOutcome
```

---

## Front-End Integration Tips

### Building a Pagination Component

Use the metadata fields to render pagination controls:

```
hasPreviousPage  →  show "Previous" / "←" button
hasNextPage      →  show "Next" / "→" button
pageNumber       →  highlight current page
totalPages       →  render page number buttons
totalCount       →  show "Showing 1-10 of 150 results"
```

### Fetching a Page

```javascript
const params = new URLSearchParams({
  pageNumber: page,
  pageSize: size,
});

if (searchTerm) params.set("searchTerm", searchTerm);
if (statusId) params.set("statusId", statusId);

const res = await fetch(`/api/LeadRequest/GetAllLeads?${params}`, {
  headers: { Authorization: `Bearer ${token}` },
});
const { data, totalCount, pageNumber, pageSize, totalPages, hasPreviousPage, hasNextPage } = await res.json();
```

### Handling Empty Results

When `totalCount === 0`, `data` will be an empty array `[]` and `totalPages` will be `0`.

### Date Filters (Call Logs)

Pass dates in `YYYY-MM-DD` format. The `toDate` filter is inclusive of the entire day:

```javascript
const params = new URLSearchParams({
  fromDate: "2026-04-01",
  toDate: "2026-04-18",   // includes all calls on April 18
});
```
