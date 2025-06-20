# LMC

This repository contains a Node.js backend and a React frontend.

## Environment configuration

Copy `backend/.env.example` to `backend/.env` and provide values for each variable. The backend uses Bunny.net for video uploads. You must set `BUNNY_API_KEY` and `BUNNY_LIBRARY_ID` with your credentials in the `.env` file.

### Video upload endpoint

Videos are uploaded via `POST /api/courses/:id/upload-video`. This route requires
an authenticated request using a Bearer token and valid Bunny.net credentials.
Attempting to open the URL directly in a browser (a `GET` request) will result
in `Cannot GET /api/.../upload-video`.

