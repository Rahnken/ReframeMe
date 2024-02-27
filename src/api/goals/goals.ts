import { z } from "zod";

const BASE_URL = import.meta.env.VITE_API_BASE_URL! + "/goals";

const goalProgressRequestSchema = z.object({
  feedback: z.string().optional(),
  goal_id: z.string(),
  weekNumber: z.number().nonnegative(),
  targetAmount: z.number().optional(),
  completedAmount: z.number().optional(),
  id: z.string(),
});

const goalRequestSchema = z.object({
  title: z.string().optional(),
  goal_id: z.string(),
  description: z.string().optional(),
  isPrivate: z.boolean().optional(),
});

const createGoalRequestSchema = z.object({
  title: z.string(),
  description: z.string(),
  isPrivate: z.boolean(),
  weeklyTrackingTotal: z.number(),
});

type GoalProgressUpdateBody = z.infer<typeof goalProgressRequestSchema>;
type GoalUpdateBody = z.infer<typeof goalRequestSchema>;
type GoalCreateBody = z.infer<typeof createGoalRequestSchema>;

export type { GoalProgressUpdateBody, GoalUpdateBody, GoalCreateBody };
export const getAllGoalsQuery = async (token: string) => {
  return await fetch(BASE_URL, {
    headers: { Authorization: `Bearer ${token}` },
  }).then((response) => response.json());
};
export const getGoalById = async (token: string, goalId: string) => {
  return await fetch(`${BASE_URL}/${goalId}`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then((response) => response.json());
};

export const createGoal = async (
  token: string,
  requestBody: GoalCreateBody
) => {
  return await fetch(`${BASE_URL}/create`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  }).then((response) => response.json());
};
export const updateGoalProgressById = async (
  token: string,
  body: GoalProgressUpdateBody
) => {
  return await fetch(`${BASE_URL}/${body.goal_id}/${body.weekNumber}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  }).then((response) => response.json());
};
export const updateGoalById = async (token: string, body: GoalUpdateBody) => {
  return await fetch(`${BASE_URL}/${body.goal_id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }).then((response) => response.json());
};
