import { Task, Team, User } from "@/types";
import { getId } from "./getId";

/**
 * Mapper for Backend MongoDB Team structure to Frontend Team type
 */
export const mapTeam = (t: any): Team => {
  if (!t) return null as any;
  return {
    id: t._id,
    name: t.name,
    ownerId: getId(t.owner),
    members: (t.members || []).map((m: any) => ({
      user:
        typeof m.user === "object" && m.user !== null
          ? {
              id: m.user._id,
              name: m.user.name,
              email: m.user.email,
            }
          : m.user,
    })),
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
    assigneeId: getId(t.assignee),
    teamId: getId(t.team),
    creatorId: getId(t.creator),
    dueDate: t.dueDate,
    createdAt: t.createdAt,
  };
};

export const mapUser = (u: any): User => {
  return {
    id: u._id,
    name: u.name,
    email: u.email,
  };
};