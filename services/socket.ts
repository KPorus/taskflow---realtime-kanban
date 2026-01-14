// import { io } from 'socket.io-client';

// const URL = 'https://task-monitor-swart.vercel.app';

// export const socket = io(URL, {
//   transports: ['websocket'],
//   autoConnect: true,
//   withCredentials: true,
// });

// export const SOCKET_EVENTS = {
//   // Client -> Server
//   JOIN_TEAM: 'joinTeam',

//   // Server -> Client
//   TASK_CREATED: 'taskCreated',
//   TASK_UPDATED: 'taskUpdate',
//   TASK_ASSIGNED: 'taskAssign',
//   TASK_DELETED: 'taskDelete',

//   TEAM_MEMBER_ADDED: 'teamMemberAdd',
//   TEAM_MEMBER_REMOVED: 'teamMemberRemove',
// };

import { io, Socket } from "socket.io-client";

// const URL = "https://task-monitor-swart.vercel.app/api/v1";
const URL = "https://task-monitor-backend-service.onrender.com";
// const URL = "https://task-monitor-backend-service-production.up.railway.app";
// const URL ="http://localhost:5001"
// export const socket = io(URL, {
//   transports: ["polling", "websocket"], // Allow polling to fix connection issues on some networks/proxies
//   autoConnect: true,
//   withCredentials: true,
//   auth: (cb) => {
//     // Pass token for authentication if available
//     const token = localStorage.getItem("taskflow_token");
//     cb({ token });
//   },
// });

export const socket:Socket = io(URL, {
  transports: ["websocket"],
  autoConnect: true,
  withCredentials: true,
  auth: (cb) => {
    const token = localStorage.getItem("taskflow_token");
    cb({ token });
  },
});

export const SOCKET_EVENTS = {
  // Client -> Server
  JOIN_TEAM: "joinTeam",

  // Server -> Client
  TASK_CREATED: "taskCreated",
  TASK_UPDATED: "taskUpdate",
  TASK_ASSIGNED: "taskAssign",
  TASK_DELETED: "taskDelete",

  TEAM_MEMBER_ADDED: "teamMemberAdd",
  TEAM_MEMBER_REMOVED: "teamMemberRemove",
};
