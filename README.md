# LMC

This repository contains a Node.js backend and a React frontend.

## Environment configuration

Copy `backend/.env.example` to `backend/.env` and provide values for each variable. The backend uses Bunny.net for video uploads. You must set `BUNNY_API_KEY` and `BUNNY_LIBRARY_ID` with your credentials in the `.env` file.

If API credentials are incorrect, video uploads will fail with a **401 Unauthorized** error. Ensure the values you provide are valid for your Bunny account.

