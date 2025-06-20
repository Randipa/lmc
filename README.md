# LMC

This repository contains a Node.js backend and a React frontend.

## Environment configuration

Create a `backend/.env` file with the required environment variables. You can use `backend/.env.example` as a reference. The backend uses Bunny.net for video uploads, so set `BUNNY_API_KEY` and `BUNNY_LIBRARY_ID` with your credentials in the `.env` file.

If you want to upload files directly to a Bunny storage zone, also provide `BUNNY_STORAGE_ZONE_NAME`, `BUNNY_STORAGE_ACCESS_KEY` and optionally `BUNNY_STORAGE_REGION`.

### Video upload endpoint

Videos are uploaded via `POST /api/courses/:id/upload-video`. This route requires
an authenticated request using a Bearer token and valid Bunny.net credentials.
Attempting to open the URL directly in a browser (a `GET` request) will result
in `Cannot GET /api/.../upload-video`.

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
3. If uploading to a storage zone, verify `BUNNY_STORAGE_ZONE_NAME`, `BUNNY_STORAGE_ACCESS_KEY`, and `BUNNY_STORAGE_REGION`.
4. Restart the backend server after updating `.env` so new values are loaded.


