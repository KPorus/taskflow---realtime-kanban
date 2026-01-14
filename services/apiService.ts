import { User, Team, Task, TaskStatus, TaskPriority, TeamMember } from '../types';
import { socket, SOCKET_EVENTS } from './socket';

const BASE_URL = 'https://task-monitor-swart.vercel.app/api/v1';

const KEYS = {
  USERS: 'taskflow_users',
  TASKS: 'taskflow_tasks',
  TOKEN: 'taskflow_token',
  USER_DATA: 'taskflow_user'
};

/**
 * Core Request Wrapper
 * Handles Authorization headers, JSON content types, and automatic token refresh.
 */
async function request(endpoint: string, options: RequestInit = {}, isRetry = false): Promise<any> {
  const token = localStorage.getItem(KEYS.TOKEN);
  const headers = new Headers(options.headers);
  
  // Explicitly set Authorization header as required
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  
  if (!(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const config: RequestInit = {
    ...options,
    headers,
    credentials: 'include',
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  // Handle Token Refresh (401 Unauthorized)
  if (response.status === 401 && !isRetry && !endpoint.includes('/auth/login')) {
    try {
      const refreshResponse = await fetch(`${BASE_URL}/auth/refreshToken`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (refreshResponse.ok) {
        const refreshResult = await refreshResponse.json();
        const authHeader = refreshResponse.headers.get('Authorization');
        const newToken = authHeader ? authHeader.replace('Bearer ', '') : refreshResult.data;

        if (newToken) {
          localStorage.setItem(KEYS.TOKEN, newToken);
          return request(endpoint, options, true);
        }
      }
    } catch (refreshErr) {
      console.error('Session refresh failed:', refreshErr);
    }
    
    localStorage.removeItem(KEYS.TOKEN);
    localStorage.removeItem(KEYS.USER_DATA);
    throw new Error('Session expired');
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API Error: ${response.status}`);
  }

  const authHeader = response.headers.get('Authorization');
  if (authHeader && (endpoint.includes('/auth/login') || endpoint.includes('/auth/register'))) {
    const receivedToken = authHeader.replace('Bearer ', '');
    localStorage.setItem(KEYS.TOKEN, receivedToken);
  }

  return response.json();
}

/**
 * Mapper for Backend MongoDB Team structure to Frontend Team type
 */
export const mapTeam = (t: any): Team => {
  if (!t) return null as any;
  return {
    id: t._id,
    name: t.name,
    ownerId: t.owner,
    members: (t.members || []).map((m: any) => ({
      user: typeof m.user === 'object' && m.user !== null ? {
        id: m.user._id,
        name: m.user.name,
        email: m.user.email
      } : m.user
    }))
  };
};

/**
 * Mapper for Backend MongoDB Task structure to Frontend Task type
 */
export const mapTask = (t: any): Task => {
  if (!t) return null as any;
  return {
    id: t._id,
    title: t.title,
    description: t.description,
    status: t.status,
    priority: t.priority,
    assigneeId: t.assignee, // Backend returns ID as 'assignee'
    teamId: t.team,         // Backend returns ID as 'team'
    creatorId: t.creator,   // Backend returns ID as 'creator'
    dueDate: t.dueDate,
    createdAt: t.createdAt
  };
};

export const ApiService = {
  auth: {
    login: async (email: string, password?: string) => {
      const result = await request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });

      const token = localStorage.getItem(KEYS.TOKEN) || result.data?.accessToken;
      if (token) localStorage.setItem(KEYS.TOKEN, token);

      const user: User = {
        id: result.data.id,
        email: result.data.email,
        name: result.data.email.split('@')[0]
      };
      
      localStorage.setItem(KEYS.USER_DATA, JSON.stringify(user));
      return { user, token };
    },
    register: async (name: string, email: string, password?: string) => {
      const result = await request('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password })
      });

      const token = localStorage.getItem(KEYS.TOKEN) || result.data?.accessToken;
      if (token) localStorage.setItem(KEYS.TOKEN, token);

      const user: User = {
        id: result.data.user.id,
        email: result.data.user.email,
        name: name
      };

      localStorage.setItem(KEYS.USER_DATA, JSON.stringify(user));
      return { user, token };
    }
  },
  teams: {
    list: async () => {
      const result = await request('/team/list');
      const teams = result.data?.teams || [];
      return Array.isArray(teams) ? teams.map(mapTeam) : [];
    },
    create: async (name: string) => {
      const result = await request('/team/create', {
        method: 'POST',
        body: JSON.stringify({ name })
      });
      return mapTeam(result.data?.team);
    },
    addMember: async (teamId: string, userId: string) => {
      const result = await request(`/team/${teamId}/add-member`, {
        method: 'PUT',
        body: JSON.stringify({ user: userId })
      });
      return mapTeam(result.data?.team);
    },
    removeMember: async (teamId: string, userId: string) => {
      const result = await request(`/team/remove-member`, {
        method: 'PUT',
        body: JSON.stringify({ teamId, memberId: userId })
      });
      return mapTeam(result.data?.team);
    },
    delete: async (teamId: string) => {
      await request(`/team/delete-team`, { 
        method: 'DELETE',
        body: JSON.stringify({ id: teamId })
      });
      return teamId;
    }
  },
  tasks: {
    list: async (teamId: string) => {
      const result = await request(`/task/task-list?teamId=${teamId}`); 
      const tasks = result.data?.tasks || [];
      return Array.isArray(tasks) ? tasks.map(mapTask) : [];
    },
    create: async (task: Omit<Task, 'id' | 'createdAt'>) => {
      const payload = {
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        dueDate: task.dueDate,
        assignee: task.assigneeId
      };
      
      const result = await request(`/task/create-task/${task.teamId}`, {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      
      return mapTask(result.data?.task);
    },
    update: async (taskId: string, updates: Partial<Task>) => {
      const payload: any = { ...updates };
      if (updates.assigneeId) {
        payload.assignee = updates.assigneeId;
        delete payload.assigneeId;
      }
      if (updates.teamId) delete payload.teamId; 
      if (updates.creatorId) delete payload.creatorId;
      if (updates.id) delete payload.id;

      const result = await request(`/task/update-task/${taskId}`, {
        method: 'PUT',
        body: JSON.stringify(payload)
      });
      
      return mapTask(result.data?.task);
    },
    delete: async (taskId: string, teamId: string) => {
      await request(`/task/delete-task`, {
        method: 'DELETE',
        body: JSON.stringify({ id: taskId, teamId })
      });
      return true;
    }
  },
  users: {
    list: async () => {
        return JSON.parse(localStorage.getItem(KEYS.USERS) || '[]');
    }
  }
};