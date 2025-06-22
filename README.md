# LMC

This repository contains a Node.js backend and a React frontend.

## Environment configuration

Create a `backend/.env` file with the required environment variables. A sample file is included in this repository with placeholder values, mirroring `backend/.env.example`. Replace each value with your own credentials. The backend uses Bunny.net for video uploads, so set `BUNNY_API_KEY` and `BUNNY_LIBRARY_ID` accordingly in `.env`.

If you want to upload files directly to a Bunny storage zone, also provide `BUNNY_STORAGE_ZONE_NAME`, `BUNNY_STORAGE_ACCESS_KEY` and optionally `BUNNY_STORAGE_REGION`.

### Video upload endpoint

Videos can be attached to a course by sending a Bunny.net video URL to
`POST /api/courses/:id/content`. The body accepts `title`, `videoId`,
`videoUrl`, `isPublic` and optional subtitles. The former file upload route
`POST /api/courses/:id/upload-video` still exists but the admin dashboard now
uses the URL method.

Both routes require an authenticated request using a Bearer token. Attempting to
open either endpoint in a browser with a `GET` request will result in
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


