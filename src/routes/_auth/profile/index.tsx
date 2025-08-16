import { Link, createFileRoute } from "@tanstack/react-router";
import {
  useUpdateUserInfoMutation,
  userInfoQueryOptions,
} from "../../../api/users/userQueryOptions";
import { TGroup, TUserInfo } from "../../../types";
import { groupQueryOptions } from "../../../api/groups/groupQueries";
import { notificationsQueryOptions } from "../../../api/notifications/notificationQueryOptions";
import { ThemeType, useThemeProvider } from "../../../providers/theme.provider";
import { TUpdateUserInfo } from "../../../api/users/userInfo";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  User, 
  Edit, 
  MapPin, 
  Clock, 
  Palette, 
  CheckCircle, 
  Users,
  Crown,
  Mail
} from "lucide-react";
import { ThemeSelector } from "../../../components/ThemeSelector";
import { GroupNotifications } from "../../../components/GroupNotifications";
import { useEffect } from "react";
import { toast } from "sonner";

const ProfileCard = ({ profile, userEmail }: { profile: TUserInfo; userEmail?: string }) => {
  const {
    firstName,
    lastName,
    timezone,
    country,
    userSettings: { theme, profileComplete },
  } = profile;

  const getInitials = (first: string | null, last: string | null) => {
    return `${first?.charAt(0) || ''}${last?.charAt(0) || ''}`.toUpperCase();
  };

  return (
    <Card className="card-gradient">
      <CardHeader className="text-center pb-4">
        <div className="flex justify-center mb-4">
          <Avatar className="w-24 h-24 border-4 border-gradient-to-r from-primary to-secondary">
            <AvatarFallback className="bg-gradient-to-r from-primary to-secondary text-white text-xl font-bold">
              {getInitials(firstName, lastName)}
            </AvatarFallback>
          </Avatar>
        </div>
        <CardTitle className="text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          {firstName} {lastName}
        </CardTitle>
        <CardDescription className="flex items-center justify-center gap-2">
          {profileComplete ? (
            <>
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Profile Complete</span>
            </>
          ) : (
            <>
              <User className="h-4 w-4 text-yellow-500" />
              <span>Profile Incomplete</span>
            </>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          {userEmail && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-blue-100/50 to-transparent">
              <div className="w-8 h-8 rounded-full bg-blue-200/50 flex items-center justify-center">
                <Mail className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{userEmail}</p>
              </div>
            </div>
          )}
          
          <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-primary/5 to-transparent">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <MapPin className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Country</p>
              <p className="font-medium">{country}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-secondary/5 to-transparent">
            <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center">
              <Clock className="h-4 w-4 text-secondary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Timezone</p>
              <p className="font-medium">{timezone}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-purple-100/50 to-transparent">
            <div className="w-8 h-8 rounded-full bg-purple-200/50 flex items-center justify-center">
              <Palette className="h-4 w-4 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Current Theme</p>
              <Badge variant="secondary" className="mt-1">
                {theme}
              </Badge>
            </div>
          </div>
        </div>
        
        <div className="pt-4">
          <Button asChild className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-lg hover:shadow-primary/25 transition-all duration-300">
            <Link to="/profile/edit">
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const UserProfile = () => {
  const {
    auth: { user },
    queryClient,
  } = Route.useRouteContext();
  const { updateTheme } = useThemeProvider();

  const mutation = useUpdateUserInfoMutation(
    user!.token!,
    () => {
      toast.success("Theme updated successfully!", {
        description: "Your theme preference has been saved."
      });
      queryClient.invalidateQueries({ queryKey: ["userInfo", user!.token!] });
    },
    (e) => {
      toast.error("Failed to update theme", {
        description: e.message
      });
      console.error("Mutation error:", e.message);
    }
  );

  const profile: TUserInfo = useSuspenseQuery(
    userInfoQueryOptions(user!.token!)
  ).data as TUserInfo;

  const { data: groupData = [] } = useSuspenseQuery(
    groupQueryOptions(user!.token!)
  );

  const adminUser = (group: TGroup) =>
    group.users.find((user: { role: string }) => user.role === "ADMIN")!.user;

  const updateProfileTheme = (theme: ThemeType) => {
    const updatedProfile: TUpdateUserInfo = {
      userSettings: {
        userSetting_id: profile.userSettings.userSetting_id,
        theme: theme,
        profileComplete: profile.userSettings.profileComplete,
      },
    };
    
    // Update theme immediately for instant visual feedback
    updateTheme(theme);
    
    // Then update the profile in the database
    return new Promise<void>((resolve, reject) => {
      mutation.mutate(updatedProfile, {
        onSuccess: () => resolve(),
        onError: (error) => reject(error)
      });
    });
  };

  const ownedGroups = groupData.filter(
    (group: TGroup) => adminUser(group).username === user?.userInfo!.username
  );

  // Sync theme provider with user's profile theme on load
  useEffect(() => {
    if (profile?.userSettings?.theme) {
      updateTheme(profile.userSettings.theme as ThemeType);
    }
  }, [profile?.userSettings?.theme, updateTheme]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-background to-green-50">
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/10 via-background to-secondary/10 p-8 border border-primary/20 mb-8">
          <div className="text-center">
            <h1 className="text-4xl font-headers tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
              Profile Settings
            </h1>
            <p className="text-muted-foreground">
              Manage your account, preferences, and groups
            </p>
          </div>
          {/* Decorative elements */}
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-secondary/5 rounded-full blur-2xl"></div>
        </div>

        {/* Main Content */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <ProfileCard profile={profile} userEmail={user?.userInfo?.email} />
          </div>

          {/* Groups and Theme */}
          <div className="lg:col-span-2 space-y-8">
            {/* Groups Section */}
            <Card className="card-gradient-empty">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-secondary/20 to-primary/20 flex items-center justify-center">
                    <Crown className="h-5 w-5 text-secondary" />
                  </div>
                  Groups You Own
                </CardTitle>
                <CardDescription>
                  Groups where you have administrative privileges
                </CardDescription>
              </CardHeader>
              <CardContent>
                {ownedGroups.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-secondary/20 to-primary/20 flex items-center justify-center">
                      <Users className="h-8 w-8 text-secondary" />
                    </div>
                    <h3 className="text-lg font-subheaders mb-2">No groups owned</h3>
                    <p className="text-muted-foreground mb-4">
                      Create your first group to start collaborating
                    </p>
                    <Button className="bg-gradient-to-r from-secondary to-primary hover:from-secondary/90 hover:to-primary/90">
                      Create Group
                    </Button>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {ownedGroups.map((group: TGroup) => (
                      <Card key={group.id} className="card-gradient hover:border-secondary/20">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-subheaders">{group.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {group.users.length} member{group.users.length !== 1 ? 's' : ''}
                              </p>
                            </div>
                            <Badge className="bg-secondary/20 text-secondary-foreground">
                              Owner
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Theme Selector */}
            <ThemeSelector updateProfileTheme={updateProfileTheme} />
            
            {/* Group Notifications */}
            <GroupNotifications token={user!.token!} />
          </div>
        </div>
      </div>
    </div>
  );
};

export const Route = createFileRoute("/_auth/profile/")({
  loader: async ({ context: { auth, queryClient } }) => {
    await queryClient.prefetchQuery(userInfoQueryOptions(auth.user!.token!));
    await queryClient.prefetchQuery(groupQueryOptions(auth.user!.token!));
    await queryClient.prefetchQuery(notificationsQueryOptions(auth.user!.token!));
  },
  component: UserProfile,
});
