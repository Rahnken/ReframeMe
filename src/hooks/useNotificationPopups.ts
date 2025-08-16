import React, { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { notificationsQueryOptions, useMarkNotificationAsReadMutation } from '../api/notifications/notificationQueryOptions';
import { TNotification } from '../types';
import { toast } from 'sonner';
import { Users, Target, Bell } from 'lucide-react';
import { useRouter } from '@tanstack/react-router';

interface UseNotificationPopupsProps {
  token: string;
  enabled?: boolean;
  pollInterval?: number; // in milliseconds, default 30 seconds
  showPopups?: boolean; // whether to show toast popups, default true
}

export const useNotificationPopups = ({ 
  token, 
  enabled = true, 
  pollInterval = 30000, // 30 seconds
  showPopups = true 
}: UseNotificationPopupsProps) => {
  const previousNotificationsRef = useRef<TNotification[]>([]);
  const router = useRouter();
  
  // Poll for notifications
  const { data: notifications = [] } = useQuery({
    ...notificationsQueryOptions(token),
    refetchInterval: pollInterval,
    enabled,
  });

  const markAsReadMutation = useMarkNotificationAsReadMutation(token);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'GROUP_INVITATION':
        return Users;
      case 'GROUP_REMOVAL':
        return Users;
      case 'GOAL_SHARED':
        return Target;
      default:
        return Bell;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'GROUP_INVITATION':
        return 'text-blue-600';
      case 'GROUP_REMOVAL':
        return 'text-red-600';
      case 'GOAL_SHARED':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const parseNotificationData = (dataString: string) => {
    try {
      return JSON.parse(dataString);
    } catch {
      return {};
    }
  };

  useEffect(() => {
    if (!enabled || !showPopups || notifications.length === 0) return;

    const previousNotifications = previousNotificationsRef.current;
    
    // Find new notifications (ones that weren't in the previous fetch)
    const newNotifications = notifications.filter(notification => 
      !previousNotifications.some(prev => prev.id === notification.id)
    );

    // Show popup for each new unread notification
    newNotifications
      .filter(notification => !notification.read)
      .forEach(notification => {
        const Icon = getNotificationIcon(notification.type);
        const iconColor = getNotificationColor(notification.type);
        const notificationData = parseNotificationData(notification.data);

        toast(notification.title, {
          description: notification.message,
          duration: 8000, // 8 seconds
          icon: React.createElement(Icon, { className: `h-4 w-4 ${iconColor}` }),
          action: notificationData.groupId ? {
            label: "View Group",
            onClick: () => {
              // Mark as read and navigate to the group
              markAsReadMutation.mutate(notification.id);
              router.navigate({ 
                to: '/dashboard/groups/$groupId', 
                params: { groupId: notificationData.groupId } 
              });
            },
          } : undefined,
          cancel: {
            label: "Mark Read",
            onClick: () => {
              // Mark as read when dismissed
              markAsReadMutation.mutate(notification.id);
            },
          },
        });
      });

    // Update the previous notifications reference
    previousNotificationsRef.current = notifications;
  }, [notifications, enabled, showPopups, markAsReadMutation, router]);

  return {
    notifications,
    unreadCount: notifications.filter(n => !n.read).length,
  };
};