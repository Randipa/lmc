# LMC

This repository contains a Node.js backend and a React frontend.

## Environment configuration

Create a `backend/.env` file with the required environment variables. A sample file is included in this repository with placeholder values, mirroring `backend/.env.example`. Replace each value with your own credentials. The backend uses Bunny.net for video uploads, so set `BUNNY_API_KEY` and `BUNNY_LIBRARY_ID` accordingly in `.env`.

If you want to upload files directly to a Bunny storage zone, also provide `BUNNY_STORAGE_ZONE_NAME`, `BUNNY_STORAGE_ACCESS_KEY` and optionally `BUNNY_STORAGE_REGION`.

### Video upload endpoint

Videos must now be attached to a course using a Bunny.net video URL. Submit
`POST /api/courses/:id/content` with `title`, `videoId`, `videoUrl`, `isPublic`
and optional subtitles. The `isPublic` flag determines whether a video is free
for unpaid students or restricted to enrolled users. The older file upload
endpoint is no longer used by the dashboard.

### Updating full course details

Admins can replace all information and video metadata for a course in a single
request using:

```
PUT /api/courses/:id/full
```

Include regular course fields (`title`, `description`, etc.) and an array
`courseContent`. Each content item accepts `isPublic` as a toggle: when `true`
the video is available for free, otherwise it requires enrollment.

The admin dashboard now uses a pair of radio buttons labelled
"Allow access for unpaid students" and "Restrict to paid students" when
adding or editing course videos. Subtitle URL inputs are validated to ensure
they contain a valid `.vtt` link whenever subtitles are enabled.

Requests to `/api/courses/:id/content` must include a valid Bearer token.
Attempting to open the endpoint in a browser with a `GET` request will result in
`Cannot GET /api/...`.

### Uploading files to a storage zone

The utility script `backend/utils/bunnyStorageUploader.js` can upload any file
to your Bunny storage zone. A simple CLI wrapper is available at
`backend/scripts/uploadStorageFile.js`.

Example usage:

```bash
node backend/scripts/uploadStorageFile.js /path/to/local/video.mp4
```


If API credentials are incorrect, video uploads will fail with a **401 Unauthorized** error. Ensure the values you provide are valid for your Bunny account.

### Troubleshooting Bunny authentication

A 401 response usually means the Bunny API rejected the credentials. Double-check the following:

1. `BUNNY_API_KEY` is copied exactly from your Bunny dashboard.
2. `BUNNY_LIBRARY_ID` matches the ID of the video library you wish to use.
3. Make sure the API key is the **Stream API Key** for that library (the Storage key will cause a 401 error).
4. If uploading to a storage zone, verify `BUNNY_STORAGE_ZONE_NAME`, `BUNNY_STORAGE_ACCESS_KEY`, and `BUNNY_STORAGE_REGION`.
5. Restart the backend server after updating `.env` so new values are loaded.
6. Ensure no extra whitespace or newline characters are present in your `.env` values.


## Deploying to Vercel

Both the backend and frontend can be deployed as separate projects on Vercel. The repository already contains configuration files for each part.

### Backend

1. Inside the `backend` directory run `vercel` and create a new project.
2. Vercel will detect the `vercel.json` file which builds `api/index.js` as a serverless function.
3. Copy the variables from `backend/.env.example` into the project settings on Vercel. Use the same names so the Express app can access them.

### Frontend

1. In the `frontend` directory run `vercel` and create another project.
2. Set the `VITE_API_BASE_URL` environment variable to the URL of the deployed backend followed by `/api`. For example:

```bash
VITE_API_BASE_URL=https://lmc-server.vercel.app/api
```
3. Vercel uses `frontend/vercel.json` to build the Vite project and serve the compiled assets.

After both deployments complete, the frontend will call the backend using the URL defined in `VITE_API_BASE_URL`.
