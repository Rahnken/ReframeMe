import { fetchWithAuthHandling } from "../../utils/apiErrorHandler";

const BASE_URL = import.meta.env.VITE_API_BASE_URL! + "/user/notifications";

/**
 * Fetch all notifications for the authenticated user
 */
export const getAllNotifications = async (token: string) => {
  return await fetchWithAuthHandling(BASE_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

/**
 * Mark a specific notification as read
 */
export const markNotificationAsRead = async (token: string, notificationId: string) => {
  return await fetchWithAuthHandling(`${BASE_URL}/${notificationId}/read`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

/**
 * Delete a specific notification
 */
export const deleteNotification = async (token: string, notificationId: string) => {
  return await fetchWithAuthHandling(`${BASE_URL}/${notificationId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

/**
 * Mark all notifications as read for the authenticated user
 */
export const markAllNotificationsAsRead = async (token: string) => {
  return await fetchWithAuthHandling(`${BASE_URL}/mark-all-read`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};