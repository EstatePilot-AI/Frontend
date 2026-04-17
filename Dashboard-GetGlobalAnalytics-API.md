# Dashboard — GetGlobalAnalytics API Guide

> **Endpoint:** `GET /api/Dashboard/GetGlobalAnalytics`
> **Auth:** Bearer JWT — `superadmin` role required
> **Content-Type:** `application/json`

---

## Request

All parameters are **optional** (query string). Omit everything to get all-time stats.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `fromDate` | `string` (ISO 8601 date) | No | Start of date range (inclusive). E.g. `2026-01-01` |
| `toDate` | `string` (ISO 8601 date) | No | End of date range (inclusive). E.g. `2026-04-17` |
| `outcomeName` | `string` | No | Filter by call outcome. Case-insensitive. Values: `Interested`, `NotInterested`, `NotAnswer`, `Failed` |

### Example Requests

```
GET /api/Dashboard/GetGlobalAnalytics
GET /api/Dashboard/GetGlobalAnalytics?fromDate=2026-01-01&toDate=2026-04-17
GET /api/Dashboard/GetGlobalAnalytics?outcomeName=Interested
GET /api/Dashboard/GetGlobalAnalytics?fromDate=2026-01-01&toDate=2026-04-17&outcomeName=NotAnswer
```

### Axios Example

```js
const { data } = await axios.get("/api/Dashboard/GetGlobalAnalytics", {
  headers: { Authorization: `Bearer ${token}` },
  params: {
    fromDate: "2026-01-01",
    toDate: "2026-04-17",
    // outcomeName: "Interested",  // optional
  },
});
```

---

## Responses

### 200 OK — Success

```json
{
  "keyMetrics": {
    "totalEngagements": 1248,
    "qualifiedLeads": 342,
    "conversionRate": 27.4,
    "resourceOptimizationHours": 186.5,
    "averageHandlingTime": 127.45
  },
  "outcomeDistributions": [
    { "categoryName": "Interested", "occurrences": 342, "sharePercentage": 27.4 },
    { "categoryName": "NotAnswer", "occurrences": 410, "sharePercentage": 32.9 },
    { "categoryName": "NotInterested", "occurrences": 380, "sharePercentage": 30.4 },
    { "categoryName": "Failed", "occurrences": 116, "sharePercentage": 9.3 }
  ],
  "peakActivityTrends": [
    { "timeSlot": "08:00 AM", "volume": 23 },
    { "timeSlot": "09:00 AM", "volume": 87 },
    { "timeSlot": "10:00 AM", "volume": 112 },
    { "timeSlot": "11:00 AM", "volume": 95 },
    { "timeSlot": "12:00 PM", "volume": 40 },
    { "timeSlot": "01:00 PM", "volume": 78 },
    { "timeSlot": "02:00 PM", "volume": 105 },
    { "timeSlot": "03:00 PM", "volume": 98 },
    { "timeSlot": "04:00 PM", "volume": 64 },
    { "timeSlot": "05:00 PM", "volume": 31 }
  ],
  "propertyInventoryStatus": [
    { "statusName": "Available", "count": 156, "percentage": 62.4 },
    { "statusName": "Sold", "count": 58, "percentage": 23.2 },
    { "statusName": "Reserved", "count": 36, "percentage": 14.4 }
  ],
  "generatedAt": "2026-04-17T14:30:00Z"
}
```

### 204 No Content — No data

No response body. Returned when no call logs match the filters.

**Handle it:**

```js
if (status === 204) {
  // Show empty state in the dashboard
}
```

### 401 Unauthorized

Missing or invalid JWT token.

### 403 Forbidden

Authenticated but not a `superadmin` user.

---

## Response Schema

### `DashboardAnalyticsResponse`

| Field | Type | Description |
|---|---|---|
| `keyMetrics` | `KeyMetrics` | Summary KPIs |
| `outcomeDistributions` | `OutcomeDistribution[]` | Breakdown by call outcome (pie/donut chart) |
| `peakActivityTrends` | `PeakActivity[]` | Hourly call volume (line/bar chart) |
| `propertyInventoryStatus` | `PropertyStatus[]` | Properties grouped by status |
| `generatedAt` | `string` (ISO 8601) | UTC timestamp of snapshot generation |

### `KeyMetrics`

| Field | Type | Description |
|---|---|---|
| `totalEngagements` | `int` | Total calls in the filtered range |
| `qualifiedLeads` | `int` | Calls with "Interested" outcome |
| `conversionRate` | `double` | `qualifiedLeads / totalEngagements * 100` |
| `resourceOptimizationHours` | `double` | Total call duration converted to hours |
| `averageHandlingTime` | `double` | Average call duration in seconds |

### `OutcomeDistribution`

| Field | Type | Description |
|---|---|---|
| `categoryName` | `string` | Outcome name (e.g. `"Interested"`) |
| `occurrences` | `int` | Raw count |
| `sharePercentage` | `double` | Percentage of total (0–100) |

### `PeakActivity`

| Field | Type | Description |
|---|---|---|
| `timeSlot` | `string` | Hour label in 12h format (e.g. `"10:00 AM"`) |
| `volume` | `int` | Number of calls in that hour |

### `PropertyStatus`

| Field | Type | Description |
|---|---|---|
| `statusName` | `string` | Status name (e.g. `"Available"`, `"Sold"`) |
| `count` | `int` | Number of properties |
| `percentage` | `double` | Percentage of total properties (0–100) |

---

## TypeScript Types

```ts
interface KeyMetrics {
  totalEngagements: number;
  qualifiedLeads: number;
  conversionRate: number;
  resourceOptimizationHours: number;
  averageHandlingTime: number;
}

interface OutcomeDistribution {
  categoryName: string;
  occurrences: number;
  sharePercentage: number;
}

interface PeakActivity {
  timeSlot: string;
  volume: number;
}

interface PropertyInventoryStatus {
  statusName: string;
  count: number;
  percentage: number;
}

interface DashboardAnalyticsResponse {
  keyMetrics: KeyMetrics;
  outcomeDistributions: OutcomeDistribution[];
  peakActivityTrends: PeakActivity[];
  propertyInventoryStatus: PropertyInventoryStatus[];
  generatedAt: string;
}

interface GlobalAnalyticsRequest {
  fromDate?: string;
  toDate?: string;
  outcomeName?: string;
}
```

---

## Chart Mapping

| Dashboard Component | Use Field | Chart Type |
|---|---|---|
| KPI Cards (4–5 cards) | `keyMetrics.*` | Number display |
| Call Outcomes | `outcomeDistributions` | Pie / Donut |
| Peak Hours | `peakActivityTrends` | Bar / Line chart (x = `timeSlot`, y = `volume`) |
| Property Inventory | `propertyInventoryStatus` | Horizontal bar or stacked bar |

---

## Migration Notes (Old → New)

| What Changed | Old | New |
|---|---|---|
| Date filtering | `day`, `month`, `year` (3 params) | `fromDate`, `toDate` (range) |
| Empty response | `200` with `{ message: "No data..." }` | `204` No Content (no body) |
| Response JSON keys | PascalCase (`KeyMetrics`) | camelCase (`keyMetrics`) |
| Old endpoint signature | `?day=17&month=4&year=2026&outcomeName=Interested` | `?fromDate=2026-01-01&toDate=2026-04-17&outcomeName=Interested` |

> **Breaking change:** The old `day`/`month`/`year` query params are no longer supported. Use `fromDate`/`toDate` instead.
