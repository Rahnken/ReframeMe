import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getAllNotifications, 
  markNotificationAsRead, 
  deleteNotification, 
  markAllNotificationsAsRead
} from "./notifications";

/**
 * Query options for fetching notifications
 */
export const notificationsQueryOptions = (token: string) =>
  queryOptions({
    queryKey: ["notifications", token],
    queryFn: () => getAllNotifications(token),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });

/**
 * Mutation for marking a notification as read
 */
export const useMarkNotificationAsReadMutation = (
  token: string,
  onSuccess?: () => void,
  onError?: (error: any) => void
) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (notificationId: string) => markNotificationAsRead(token, notificationId),
    onSuccess: () => {
      // Invalidate and refetch notifications
      queryClient.invalidateQueries({ queryKey: ["notifications", token] });
      onSuccess?.();
    },
    onError: (error) => {
      console.error("Failed to mark notification as read:", error);
      onError?.(error);
    },
  });
};

/**
 * Mutation for deleting a notification
 */
export const useDeleteNotificationMutation = (
  token: string,
  onSuccess?: () => void,
  onError?: (error: any) => void
) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (notificationId: string) => deleteNotification(token, notificationId),
    onSuccess: () => {
      // Invalidate and refetch notifications
      queryClient.invalidateQueries({ queryKey: ["notifications", token] });
      onSuccess?.();
    },
    onError: (error) => {
      console.error("Failed to delete notification:", error);
      onError?.(error);
    },
  });
};

/**
 * Mutation for marking all notifications as read
 */
export const useMarkAllNotificationsAsReadMutation = (
  token: string,
  onSuccess?: () => void,
  onError?: (error: any) => void
) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => markAllNotificationsAsRead(token),
    onSuccess: () => {
      // Invalidate and refetch notifications
      queryClient.invalidateQueries({ queryKey: ["notifications", token] });
      onSuccess?.();
    },
    onError: (error) => {
      console.error("Failed to mark all notifications as read:", error);
      onError?.(error);
    },
  });
};

