import { mapTask, mapTeam, mapUser } from "@/helpers/maper";
import {
  User,
  Task
} from "../types";
import { KEYS, request } from "@/helpers/request";



export const ApiService = {
  auth: {
    login: async (email: string, password?: string) => {
      const result = await request("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      const token =
        localStorage.getItem(KEYS.TOKEN) || result.data?.accessToken;
      if (token) localStorage.setItem(KEYS.TOKEN, token);

      const user: User = {
        id: result.data.id,
        email: result.data.email,
        name: result.data.email.split("@")[0],
      };

      localStorage.setItem(KEYS.USER_DATA, JSON.stringify(user));
      return { user, token };
    },
    register: async (name: string, email: string, password?: string) => {
      const result = await request("/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      });

      const token =
        localStorage.getItem(KEYS.TOKEN) || result.data?.accessToken;
      if (token) localStorage.setItem(KEYS.TOKEN, token);

      const user: User = {
        id: result.data.user.id,
        email: result.data.user.email,
        name: name,
      };

      localStorage.setItem(KEYS.USER_DATA, JSON.stringify(user));
      return { user, token };
    },
  },
  teams: {
    list: async () => {
      const result = await request("/team/list");
      const teams = Array.isArray(result.data)
        ? result.data
        : result.data?.teams || [];
      return Array.isArray(teams) ? teams.map(mapTeam) : [];
    },
    create: async (name: string) => {
      const result = await request("/team/create", {
        method: "POST",
        body: JSON.stringify({ name }),
      });
      return mapTeam(result.data?.team || result.data);
    },
    addMember: async (teamId: string, userId: string) => {
      const result = await request(`/team/${teamId}/add-member`, {
        method: "PUT",
        body: JSON.stringify({ user: userId }),
      });
      return mapTeam(result.data?.team || result.data);
    },
    removeMember: async (teamId: string, userId: string) => {
      const result = await request(`/team/remove-member`, {
        method: "PUT",
        body: JSON.stringify({ teamId, memberId: userId }),
      });
      return mapTeam(result.data?.team || result.data);
    },
    delete: async (teamId: string) => {
      await request(`/team/delete-team`, {
        method: "DELETE",
        body: JSON.stringify({ id: teamId }),
      });
      return teamId;
    },
  },
  tasks: {
    list: async (teamId: string) => {
      const result = await request(`/task/task-list`, {
        method: "POST",
        body: JSON.stringify({ teamId: teamId }),
      });
      // Handle both { data: [tasks] } and { data: { tasks: [] } } structures
      const tasks = Array.isArray(result.data)
        ? result.data
        : result.data?.tasks || [];
      return Array.isArray(tasks) ? tasks.map(mapTask) : [];
    },
    create: async (task: Omit<Task, "id" | "createdAt">) => {
      const payload = {
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        dueDate: task.dueDate,
        assignee: task.assigneeId,
      };

      const result = await request(`/task/create-task/${task.teamId}`, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      return mapTask(result.data?.task || result.data);
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
        method: "PUT",
        body: JSON.stringify(payload),
      });

      return mapTask(result.data?.task || result.data);
    },
    delete: async (taskId: string, teamId: string) => {
      await request(`/task/delete-task`, {
        method: "DELETE",
        body: JSON.stringify({ id: taskId, teamId }),
      });
      return true;
    },
  },
  users: {
    list: async () => {
      const result = await request("/auth/get-all-users");
      // const users = result.data || [];
      const users = Array.isArray(result.data) ? result.data : (result.data?.users || []);
      return Array.isArray(users) ? users.map(mapUser) : [];
    },
  },
};
