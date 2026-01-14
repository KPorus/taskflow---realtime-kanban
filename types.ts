export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE'
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface TeamMember {
  user: User | string; // Can be ID or populated User object
}

export interface Team {
  id: string;
  name: string;
  ownerId: string;
  members: TeamMember[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId?: string;
  teamId: string;
  creatorId: string;
  dueDate?: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface DataState {
  teams: Team[];
  tasks: Task[];
  users: User[];
  activeTeamId: string | null;
  loading: boolean;
  error: string | null;
}