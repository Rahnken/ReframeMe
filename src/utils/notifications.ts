/**
 * Simple notification system for group invitations
 * This is a basic in-memory system that could be enhanced with backend persistence
 */

export interface GroupNotification {
  id: string;
  type: 'group_invitation';
  groupId: string;
  groupName: string;
  invitedBy: string;
  timestamp: string;
  read: boolean;
}

const NOTIFICATIONS_KEY = 'group_notifications';

// Get notifications from localStorage
export const getNotifications = (username: string): GroupNotification[] => {
  try {
    const stored = localStorage.getItem(`${NOTIFICATIONS_KEY}_${username}`);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

// Save notifications to localStorage
export const saveNotifications = (username: string, notifications: GroupNotification[]): void => {
  try {
    localStorage.setItem(`${NOTIFICATIONS_KEY}_${username}`, JSON.stringify(notifications));
  } catch (error) {
    console.error('Failed to save notifications:', error);
  }
};

// Add a new group invitation notification
export const addGroupInvitationNotification = (
  username: string,
  groupId: string,
  groupName: string,
  invitedBy: string
): void => {
  const notifications = getNotifications(username);
  
  // Check if notification already exists
  const exists = notifications.some(n => 
    n.type === 'group_invitation' && 
    n.groupId === groupId && 
    n.invitedBy === invitedBy
  );
  
  if (!exists) {
    const newNotification: GroupNotification = {
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'group_invitation',
      groupId,
      groupName,
      invitedBy,
      timestamp: new Date().toISOString(),
      read: false,
    };
    
    notifications.unshift(newNotification); // Add to beginning
    saveNotifications(username, notifications);
  }
};

// Mark notification as read
export const markNotificationAsRead = (username: string, notificationId: string): void => {
  const notifications = getNotifications(username);
  const updated = notifications.map(n => 
    n.id === notificationId ? { ...n, read: true } : n
  );
  saveNotifications(username, updated);
};

// Clear all notifications
export const clearAllNotifications = (username: string): void => {
  saveNotifications(username, []);
};

// Get unread notification count
export const getUnreadCount = (username: string): number => {
  const notifications = getNotifications(username);
  return notifications.filter(n => !n.read).length;
};