# EduTrack

A full-stack attendance management application with separate frontend and backend components.

## Structure

- `frontend/` — React client application
- `backend/` — Express API and MongoDB/Mongoose data handling

## Local development

Requirements: Node.js compatible with the dependencies and a MongoDB database.

1. Configure the backend database connection. Create `backend/.env` with:
   ```dotenv
   MONGO_URI=your_mongodb_connection_string
   ```
   Keep real credentials private; do not commit them.
2. In one terminal, install and start the backend:
   ```sh
   cd backend
   npm install
   npm test
   node index.js
   ```
   The backend listens on port `5000` by default.
3. In a second terminal, install and start the frontend:
   ```sh
   cd frontend
   npm install
   npm start
   ```
   Create React App opens the frontend on port `3000` by default.

The backend `npm test` script runs JavaScript syntax checks; it does not run integration tests.

## Current focus

The backend includes validation and normalization for schools, classes, students, and attendance records.

## Purpose

EduTrack provides a structured digital workflow for managing student attendance while keeping frontend and backend responsibilities separated.
