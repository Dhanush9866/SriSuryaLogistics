# Sri Surya Logistics — Website (MERN)

Premium single-page website for **Sri Surya Logistics**, Peravali (NH-216).

| Layer    | Tech                                   | Folder    |
| -------- | -------------------------------------- | --------- |
| Frontend | React 18 + Vite                        | `client/` |
| Backend  | Node.js + Express                      | `server/` |
| Database | MongoDB (Mongoose) — stores quote requests | `server/models` |

## Run locally

```bash
npm run install:all          # installs root, server and client deps
# make sure MongoDB is running locally, or put an Atlas URI in server/.env
npm run dev                  # API on :5050, website on http://localhost:5173
```

## Edit content

All text, phone numbers, services and founders are in **`client/src/data/site.js`**.

## API

- `POST /api/quotes` — saves a quote request (name, phone, pickup, drop, goods, vehicle, date, message)
- `GET  /api/quotes` — lists requests; send header `x-admin-key: <ADMIN_KEY from .env>`
- `GET  /api/health` — health / DB status


## Deploy

**Option A – single server:** `npm run build`, then set `NODE_ENV=production` in `server/.env`
and `npm start`. Express serves the built site and the API together.

**Option B – split:** deploy `client/` to Vercel/Netlify with env `VITE_API_URL=https://your-api.com`,
and `server/` to Render/Railway with `MONGO_URI` (MongoDB Atlas) and `CLIENT_ORIGIN` set.
