import { io } from 'socket.io-client';

const URL = 'https://task-monitor-swart.vercel.app';

export const socket = io(URL, {
  transports: ['websocket'],
  autoConnect: true,
  withCredentials: true,
});

export const SOCKET_EVENTS = {
  // Client -> Server
  JOIN_TEAM: 'joinTeam',
  
  // Server -> Client
  TASK_CREATED: 'taskCreated',
  TASK_UPDATED: 'taskUpdate',
  TASK_ASSIGNED: 'taskAssign',
  TASK_DELETED: 'taskDelete',
  
  TEAM_MEMBER_ADDED: 'teamMemberAdd',
  TEAM_MEMBER_REMOVED: 'teamMemberRemove',
};