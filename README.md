# IDXExchange
A property search application built for the 2026 Summer SDE Intern program at IDXExchange.

![IDXExchange Screenshot](./screenshot.png)


## Tech Stack

Data Storage: Docker, MySQL

Backend: Node.js, Express.js

Frontend: Next.js, Tailwind CSS, React

## Description

This project was built for IDXExchange's Summer 2026 Software Devlopment Engineer (SDE) cohort.
It is a property search application which finds relevant database entries according to your
search filters, and can further retrieve more information on a specific property when entries
are expanded to reveal reviews, an integrated Google Map, and a list of photos, if applicable.

• This is a full-stack property search application w/ Next.js, Express.js, Docker containers for SQL
• Routes can fetch 6000+ property records with filtering, pagination, and injection protections
• Data Storage uses SQL Indexing to improve query performance, middleware for request timing and logging
• Interacted with through a responsive frontend with API routes, reusable TSX components and Jest test suites
• Can change queries using filter bar to send custom API fetch URLs for to construct specific MySQL queries


## Setup

- Set up data storage
- Run `npm install` in the backend.
- Populate backend .env according to this template:

```bash
DB_HOST=
DB_PORT=
DB_USER=
DB_PASSWORD=
DB_NAME=
```

- Run `npm install` in the frontend.
- Populate frontend .env according to this template:

```bash
NEXT_PUBLIC_APP_URL=http://localhost:[PORT]
BACKEND_API_URL=http://localhost:[PORT]
REACT_APP_GOOGLE_MAPS_API_KEY=
```

## Running the Project

- Docker Desktop with a MySQL container for property data: docker start idx-mysql-local
- Backend on Express + Node.js: npm run dev (shortcut for nodemon server.js)
- Frontend on Next.js: npm run dev

## Development

The below commands are how I initialized the project. If you are using your own database, refer to the Docker commands to set up an environment for your data to be queried from.

### Docker MySQL Commands
- Create container: `docker run --name idx-mysql-local -e MYSQL_ROOT_PASSWORD=<pass> -e MYSQL_DATABASE=<name> -p <port>:<port> -d mysql:8`
- Pass in file: `docker exec -i idx-mysql-local mysql -u root -p"<pass>" <name> < <file>.sql`
- Enter MySQL: `docker exec -it idx-mysql-local mysql -u root -p"<pass>" <name>`
- Verify tables: `USE rets;` `SHOW TABLES;`

### Backend Setup Commands
- Initialize a Node.js project: `npm init -y`
- Dependencies: `npm install express mysql2 dotenv cors`
- Dev Dependencies: `npm install --save-dev nodemon` + `"dev": "nodemon server.js"` in package.json
- Make .env for DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME

### Frontend Setup Commands
- Initialize a Next.js project: `npx create-next-app@latest frontend` with defaults

Automatically installs TypeScript, ESLint, No React Compiler, Tailwind CSS, App Router, etc.

## Architecture

### Frontend Architecture

The frontend is a Next.js application using the App Router, React, TypeScript, and Tailwind CSS. Next.js provides the routing and rendering structure: files inside `frontend/app` define pages and API route handlers, while reusable React components live in `frontend/src/components`.

The listings page is rendered by `app/listings/page.tsx`. It places the interactive `ListingsClient` component inside an error boundary. `ListingsClient` is a client component because it manages browser state and events with React hooks. The filter form, property cards, sorting controls, and pagination controls are separate components composed by this client component.

Tailwind CSS supplies utility classes directly in the JSX, such as grid, spacing, typography, color, and responsive-layout classes. Tailwind is loaded with `@import "tailwindcss"` in `frontend/app/globals.css`. That file also defines the application's light and dark color variables, maps them into Tailwind theme colors, and creates reusable component classes such as `property-card`, `primary-button`, and `column-layout` with `@apply`. Next's font integration loads the Inter font in the root layout, and the layout applies the global stylesheet and base page structure to every route.

### Backend and Database

The backend is a Node.js Express server in `backend/server.js`. It enables CORS and JSON request parsing, loads environment variables with `dotenv`, logs request timing, and mounts the property routers under `/api/properties`. It listens on port `5000` and exposes `/api/health`, which runs `SELECT 1` to verify that the database is reachable.

MySQL runs in the Docker container described in the setup instructions (for example, `idx-mysql-local`). The backend connects to that database through the promise-based `mysql2` connection pool in `backend/db.js`. Connection details such as `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, and `DB_NAME` come from the backend environment. The property data is stored in the `rets_property` table, and open-house records are stored in `rets_openhouse`.

### Listings Search Flow

1. `ListingsClient` loads the first page automatically when the listings route opens. The default page size is 20.
2. `PropertyFilters` collects city, ZIP code, minimum price, maximum price, minimum beds, and minimum baths. On submit, empty fields are removed and the filters are passed back to `ListingsClient`. A new search resets the current page to 1.
3. `ListingsClient` converts the filters into URL query parameters and adds `limit` and `offset` for pagination. Optional sort rules are sent as `sortBy[0]`, `sortOrder[0]`, and so on.
4. The frontend API client requests `/api/listProperties`. This Next.js route handler forwards the query string to the Express endpoint `${BACKEND_API_URL}/api/properties`, keeping the backend URL on the server side of the frontend proxy.
5. The Express properties route validates string and numeric query values, builds the filtered SQL query, and executes it with parameterized values. City matching is case-insensitive and trimmed; price, beds, and baths are lower-bound or range comparisons. Sorting is restricted to a whitelist of supported database columns and directions.
6. Express runs both the paginated query and a matching `COUNT(*)` query, then returns `{ total, limit, offset, results }`. The client stores the results and total count, renders each row as a `PropertyCard`, and calculates the number of pagination pages from the total.

Each property card parses its JSON photo list for the carousel and links to `/property/{L_ListingID}`. Changing or removing sort rules repeats the same request with the current filters and page.

### Property Detail Flow

The dynamic route `app/property/[id]/page.tsx` receives the listing ID from the URL and runs as an async server component. It calls the frontend API client for both the property and its open houses. The `/api/getProperty` and `/api/getOpenHouses` Next.js route handlers validate that an ID was supplied, URL-encode it, and proxy the requests to Express as `/api/properties/:id` and `/api/properties/:id/openhouses`.

The Express detail router validates that the ID is alphanumeric and no longer than 20 characters, then uses a parameterized lookup against `rets_property`. The open-house route checks that the property exists and returns matching `rets_openhouse` rows ordered by date and start time. A missing property produces the frontend's "Property not found" state.

When the property exists, the detail page parses `L_Photos` and displays the image gallery, address, price, beds, baths, square footage, year built, description, open houses, and map coordinates. `PropertyImageGallery` provides thumbnail selection and a lightbox, `OpenHouses` renders the scheduled events, and `PropertyMap` uses the latitude and longitude from the property record.

## API Reference

This project exposes a small REST API for property search and property detail retrieval.

All backend endpoints are served by the Express server at: http://localhost:5000/api/properties

The frontend calls Next.js route handlers which describe the HTTP method and create a secure fetch url to avoid CORS issues.

### GET /api/properties
Returns a paginated list of properties with optional filters and sorting.

| Name | Type | Description |
| --- | --- | --- |
| ``city`` | string | Case‑insensitive match on ``L_City`` |
| ``zipcode`` | string | Exact match on ``L_Zip`` |
| ``minPrice`` | number | Minimum ``L_SystemPrice`` |
| ``maxPrice`` | number | Maximum ``L_SystemPrice`` |
| ``beds`` | number | Minimum ``L_Keyword2`` |
| ``baths`` | number | Minimum ``LM_Dec_3`` |
| ``limit`` | number | Page size (default 20) |
| ``offset`` | number | Pagination offset (default 0) |
| ``sortBy[n]`` | string | Whitelisted sort fields |
| ``sortOrder[n]`` | string | ``"asc"`` or ``"desc"`` |

Example Request: `GET /api/properties?city=san%20diego&beds=3&limit=20&offset=0`
Example Response:

```bash
json
{
  "total": 487,
  "limit": 20,
  "offset": 0,
  "results": [
    {
      "L_ListingID": "24001234",
      "L_Address": "123 Main St",
      "L_City": "San Diego",
      "L_State": "CA",
      "L_SystemPrice": 899000,
      "L_Photos": "[...]"
    }
  ]
}
```

### GET /api/properties/:id
Returns a single property record.

Example Request: `GET /api/properties/24001234`
Example Response:

```bash
json
{
  "L_ListingID": "24001234",
  "L_Address": "123 Main St",
  "L_City": "San Diego",
  "L_State": "CA",
  "L_SystemPrice": 899000,
  "L_Photos": "[...]",
  "Beds": 3,
  "Baths": 2,
  "SqFt": 1450
}
```

Error Responses:
- 400: invalid ID format
- 404: property not found

### GET /api/properties/:id/openhouses
Returns all open houses for a property.

Example Request: `GET /api/properties/24001234/openhouses`
Example Response:

```bash
json
[
  {
    "OH_StartDate": "2024-08-12",
    "OH_StartTime": "13:00:00",
    "OH_EndTime": "15:00:00",
    "Remarks": "Hosted by John Doe"
  }
]
```

- If the property does not exist, it returns an empty array.
- If the ID is invalid, it returns 400.

## Database Schema Summary

Table: rets_property

| Column | Description |
| --- | --- |
| ``L_ListingID`` (PK) | Unique listing identifier |
| ``L_Address`` | Street address |
| ``L_City`` | City |
| ``L_State`` | State |
| ``L_SystemPrice`` | Listing price |
| ``L_Photos`` | JSON string of photo URLs |
| ``L_Keyword2`` | Beds |
| ``LM_Dec_3`` | Baths |
| ``LM_Int2_3`` | Square footage |
| ``Latitude``, ``Longitude`` | Coordinates |

Table: rets_openhouse
| Column | Description |
| --- | --- |
| ``id`` (PK) | Unique open house ID |
| ``L_ListingID`` (FK) | References ``rets_property.L_ListingID`` |
| ``OH_StartDate`` | Date |
| ``OH_StartTime`` | Start time |
| ``OH_EndTime`` | End time |
| ``Remarks`` | Notes |

One property can have many open houses.

## Known Issues

- Some MLS photo fields contain malformed JSON, or broken links.
- Some listings have missing latitude/longitude.
- Open houses data may contain duplicates depending on MLS feed timing.
- Many listings will not have open houses available due to the dataset.
- Sorting only supports a limited whitelist of columns.

## Potential Improvements

- Add map‑based search with clustering.
- Add user accounts and saved searches.
- Add CI/CD pipeline with automated tests.
- Add bulk import tooling for MLS feeds.