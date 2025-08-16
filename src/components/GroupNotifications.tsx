import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Users, Check, Eye, Target } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { formatDistanceToNow } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import {
  notificationsQueryOptions,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
} from "../api/notifications/notificationQueryOptions";
import { TNotification } from "../types";

interface GroupNotificationsProps {
  token: string;
}

export function GroupNotifications({ token }: GroupNotificationsProps) {
  const {
    data: notifications = [],
    isLoading,
    error,
  } = useQuery(notificationsQueryOptions(token));

  const markAsReadMutation = useMarkNotificationAsReadMutation(token);
  const markAllAsReadMutation = useMarkAllNotificationsAsReadMutation(token);

  const unreadCount = notifications.filter(
    (n: TNotification) => !n.read
  ).length;

  // Show error state if API is not available
  if (error) {
    return (
      <Card className="card-gradient">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
              <Bell className="h-4 w-4 text-red-600" />
            </div>
            Group Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-red-100 flex items-center justify-center">
              <Bell className="h-6 w-6 text-red-500" />
            </div>
            <h3 className="font-subheaders mb-1">Notifications unavailable</h3>
            <p className="text-sm text-muted-foreground">
              Backend notifications API is not configured yet
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <Card className="card-gradient">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
              <Bell className="h-4 w-4 text-blue-600" />
            </div>
            Group Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-muted flex items-center justify-center animate-pulse">
              <Bell className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="font-subheaders mb-1">Loading notifications...</h3>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatTime = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch {
      return "recently";
    }
  };

  const parseNotificationData = (dataString: string) => {
    try {
      return JSON.parse(dataString);
    } catch {
      return {};
    }
  };

  const getNotificationIcon = (type: string, isRead: boolean) => {
    switch (type) {
      case "GROUP_INVITATION":
        return (
          <Users
            className={`h-4 w-4 ${isRead ? "text-muted-foreground" : "text-primary"}`}
          />
        );
      case "GROUP_REMOVAL":
        return (
          <Users
            className={`h-4 w-4 ${isRead ? "text-muted-foreground" : "text-red-600"}`}
          />
        );
      case "GOAL_SHARED":
        return (
          <Target
            className={`h-4 w-4 ${isRead ? "text-muted-foreground" : "text-blue-600"}`}
          />
        );
      default:
        return (
          <Bell
            className={`h-4 w-4 ${isRead ? "text-muted-foreground" : "text-primary"}`}
          />
        );
    }
  };

  const NotificationItem = ({
    notification,
  }: {
    notification: TNotification;
  }) => {
    const notificationData = parseNotificationData(notification.data);

    return (
      <div
        className={`p-4 border rounded-lg transition-all duration-200 ${
          notification.read
            ? "border-border bg-background"
            : "border-primary/20 bg-primary/5"
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                notification.read ? "bg-muted" : "bg-primary/10"
              }`}
            >
              {getNotificationIcon(notification.type, notification.read)}
            </div>

            <div className="flex-1 space-y-1">
              <p
                className={`text-sm ${notification.read ? "text-muted-foreground" : "text-foreground font-medium"}`}
              >
                {notification.message}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatTime(notification.createdAt)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {!notification.read && (
              <Badge variant="secondary" className="text-xs">
                New
              </Badge>
            )}

            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => markAsReadMutation.mutate(notification.id)}
                className="h-8 w-8 p-0"
                title={notification.read ? "Mark as unread" : "Mark as read"}
                disabled={markAsReadMutation.isPending}
              >
                <Check className="h-3 w-3" />
              </Button>

              {(notification.type === "GROUP_INVITATION" ||
                notification.type === "GROUP_REMOVAL" ||
                notification.type === "GOAL_SHARED") &&
                notificationData.groupId && (
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="h-8 w-8 p-0"
                    title="View group"
                  >
                    <Link
                      to="/dashboard/groups/$groupId"
                      params={{ groupId: notificationData.groupId }}
                    >
                      <Eye className="h-3 w-3" />
                    </Link>
                  </Button>
                )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card className="card-gradient">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
              <Bell className="h-4 w-4 text-blue-600" />
            </div>
            Group Notifications
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {unreadCount}
              </Badge>
            )}
          </CardTitle>

          {notifications.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => markAllAsReadMutation.mutate()}
              className="text-xs"
              disabled={markAllAsReadMutation.isPending}
            >
              <Check className="h-3 w-3 mr-1" />
              Mark All Read
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {notifications.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-muted flex items-center justify-center">
              <Bell className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="font-subheaders mb-1">No notifications</h3>
            <p className="text-sm text-muted-foreground">
              You'll see group invitations and updates here
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {notifications.map((notification: TNotification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
