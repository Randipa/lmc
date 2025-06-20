# LMC

This repository contains a Node.js backend and a React frontend.

## Environment configuration

Copy `backend/.env.example` to `backend/.env` and provide values for each variable. The backend uses Bunny.net for video uploads. You must set `BUNNY_API_KEY` and `BUNNY_LIBRARY_ID` with your credentials in the `.env` file.

## Bunny video management

Admins can upload course videos using `/api/courses/:id/upload-video`. To list all videos stored in your Bunny library, send a GET request to `/api/videos` (authentication and admin role required).

