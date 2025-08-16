import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  notificationsQueryOptions, 
  useMarkNotificationAsReadMutation, 
  useDeleteAllNotificationsMutation 
} from '../api/notifications/notificationQueryOptions';
import { TNotification, TGroupInvitationData } from '../types';
import { toast } from 'sonner';

// Transform backend notification to frontend format
const transformNotification = (notification: TNotification) => {
  let data: TGroupInvitationData;
  
  try {
    data = JSON.parse(notification.data);
  } catch (error) {
    console.error('Failed to parse notification data:', error);
    data = { groupId: '', groupName: 'Unknown Group', invitedBy: 'Unknown User' };
  }

  return {
    id: notification.id,
    type: 'group_invitation' as const,
    groupId: data.groupId,
    groupName: data.groupName,
    invitedBy: data.invitedBy,
    timestamp: notification.created_at,
    read: notification.is_read,
  };
};

export const useNotifications = (token?: string) => {
  // Fetch notifications from API
  const { data: notificationsData = [], isLoading, error } = useQuery({
    ...notificationsQueryOptions(token!),
    enabled: !!token,
  });

  // Transform notifications to frontend format
  const notifications = useMemo(() => {
    return notificationsData.map(transformNotification);
  }, [notificationsData]);

  // Calculate unread count
  const unreadCount = useMemo(() => {
    return notifications.filter(n => !n.read).length;
  }, [notifications]);

  // Mark as read mutation
  const markAsReadMutation = useMarkNotificationAsReadMutation(
    token!,
    () => {
      toast.success('Notification marked as read');
    },
    (error) => {
      toast.error('Failed to mark notification as read');
      console.error('Mark as read error:', error);
    }
  );

  // Clear all notifications mutation
  const clearAllMutation = useDeleteAllNotificationsMutation(
    token!,
    () => {
      toast.success('All notifications cleared');
    },
    (error) => {
      toast.error('Failed to clear notifications');
      console.error('Clear all error:', error);
    }
  );

  const markAsRead = (notificationId: string) => {
    if (!token) return;
    markAsReadMutation.mutate(notificationId);
  };

  const clearAll = () => {
    if (!token) return;
    clearAllMutation.mutate();
  };

  return {
    notifications,
    unreadCount,
    markAsRead,
    clearAll,
    isLoading,
    error,
    isMarkingAsRead: markAsReadMutation.isPending,
    isClearingAll: clearAllMutation.isPending,
  };
};