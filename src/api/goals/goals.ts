import { z } from "zod";
import { fetchWithAuthHandling } from "../../utils/apiErrorHandler";

const BASE_URL = import.meta.env.VITE_API_BASE_URL! + "/goals";

const goalProgressRequestSchema = z.object({
  feedback: z.string().optional(),
  goal_id: z.string(),
  weekNumber: z.number().nonnegative(),
  targetAmount: z.number().optional(),
  completedAmount: z.number().optional(),
  id: z.string(),
  achieved: z.boolean().optional(),
  notes: z.string().optional(),
});

const goalRequestSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  description: z.string().optional(),
  isPrivate: z.boolean().optional(),
  weeklyTrackingTotal:z.number().optional(),
  sharedGroups:z.string().array().optional(),
  // SMART goal fields
  specific: z.string().optional(),
  measurable: z.string().optional(),
  attainable: z.string().optional(),
  relevant: z.string().optional(),
  timeBound: z.string().optional(),
});

const createGoalRequestSchema = z.object({
  title: z.string(),
  description: z.string(),
  isPrivate: z.boolean(),
  weeklyTrackingTotal: z.number(),
  sharedToGroup: z.string().array().optional(),
  // SMART goal fields
  specific: z.string().optional(),
  measurable: z.string().optional(),
  attainable: z.string().optional(),
  relevant: z.string().optional(),
  timeBound: z.string().optional(),
});

type GoalProgressUpdateBody = z.infer<typeof goalProgressRequestSchema>;
type GoalUpdateBody = z.infer<typeof goalRequestSchema>;
type GoalCreateBody = z.infer<typeof createGoalRequestSchema>;

export type { GoalProgressUpdateBody, GoalUpdateBody, GoalCreateBody };

export const getAllGoalsQuery = async (token: string) => {
  return await fetchWithAuthHandling(BASE_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
export const getGoalById = async (token: string, goalId: string) => {
  return await fetchWithAuthHandling(`${BASE_URL}/${goalId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const createGoal = async (
  token: string,
  requestBody: GoalCreateBody
) => {
  return await fetchWithAuthHandling(`${BASE_URL}/create`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });
};
export const updateGoalProgressById = async (
  token: string,
  body: GoalProgressUpdateBody
) => {
  return await fetchWithAuthHandling(`${BASE_URL}/${body.goal_id}/${body.weekNumber}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
};
export const updateGoalById = async (token: string, body: GoalUpdateBody) => {
  return await fetchWithAuthHandling(`${BASE_URL}/${body.id}/edit`, {
    method: "PATCH",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};
export const deleteGoalById = async (token: string, goalId: string) => {
  return await fetchWithAuthHandling(`${BASE_URL}/${goalId}/delete`, {
    method: "DELETE",
    headers : {
      Authorization: `Bearer ${token}`
    }
  });
};

// Batch update multiple weeks of progress
export const batchUpdateGoalProgress = async (
  token: string,
  goalId: string,
  weekProgress: Record<number, { achieved: boolean; notes: string }>
) => {
  return await fetchWithAuthHandling(`${BASE_URL}/${goalId}/progress/batch`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ weekProgress }),
  });
};
