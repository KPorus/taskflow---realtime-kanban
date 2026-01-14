# TaskFlow - MERN Stack Real-time Kanban System

## Overview

TaskFlow is a multi-user task management application designed with a focus on real-time collaboration. It implements a Kanban-style board where users can create, update, and drag-and-drop tasks.

## Architecture & Technology Stack

While this demo runs entirely in the browser for preview purposes, it is architected to reflect a full MERN stack application.

### Frontend
- **React 18**: UI Library using Functional Components and Hooks.
- **Redux Toolkit**: Global state management for Auth, Teams, and Tasks.
- **Tailwind CSS**: Utility-first styling.
- **TypeScript**: Type safety across the application.
- **HTML5 Drag & Drop**: Native API for board interactions.

### Backend (Simulated in `services/mockBackend.ts`)
This project mocks the behavior of the requested **Nest.js** backend:
- **Authentication**: Simulates JWT issuance and validation.
- **Database**: Simulates **MongoDB** schema and operations using `localStorage`.
- **Real-time**: Simulates **Socket.IO** events using `BroadcastChannel` API. This allows you to open the app in two different browser tabs and see updates reflect instantly in both.

## How to Test Real-Time Features

1. Open the application in **Tab A**.
2. Login as `alice@example.com`.
3. Open the application in **Tab B**.
4. Login as `bob@example.com`.
5. In Tab A, drag a task from "To Do" to "In Progress".
6. Watch Tab B update instantly without refreshing.
7. Create a new task in Tab B; it will appear in Tab A.

## Planned Backend Structure (Nest.js)

If this were deployed to a real server, the structure would be:

```
src/
  auth/           # JWT Strategy & Guards
  users/          # User Entity & Service
  teams/          # Team Entity & Service
  tasks/          # Task Entity & Service
  gateway/        # WebSocket Gateway (Socket.IO)
```

## Running the App

Since this is a client-side preview:
1. Ensure dependencies (`react`, `react-dom`, `@reduxjs/toolkit`, `react-redux`, `lucide-react`) are installed.
2. Run with Vite or Create React App.
