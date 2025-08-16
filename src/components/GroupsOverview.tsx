/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Users,
  Target,
  ChevronRight,
  Trophy,
  Clock,
  Crown,
  Menu,
  Edit,
  BarChart3,
} from "lucide-react";
import { TGroup, TGroupUser, TSharedGoal, TGoal } from "../types";
import { Link } from "@tanstack/react-router";
import { getCurrentGoalWeek } from "../utils/goalWeekCalculator";
import { getAvatarProps } from "../utils/avatarUtils";
import { updateGoalProgressById, updateGoalById } from "../api/goals/goals";
import { GoalProgressTracker } from "./GoalProgressTracker";
import { GoalForm } from "./forms/GoalForm";
import { Modal } from "./component-parts/modal";
import { useModal } from "../utils/useModal";
import { useAuth } from "../providers/auth.provider";
import { useQueryClient } from "@tanstack/react-query";

interface GroupsOverviewProps {
  groups: TGroup[];
  userGoals?: TGoal[];
}

interface MemberProgress {
  userId: string;
  username: string;
  role: "ADMIN" | "MEMBER";
  goals: {
    goal: TGoal;
    currentWeekProgress: {
      completed: number;
      target: number;
      percentage: number;
    };
    overallProgress: {
      weeksCompleted: number;
      totalWeeks: number;
      percentage: number;
    };
  }[];
}

export function GroupsOverview({
  groups,
  userGoals = [],
}: GroupsOverviewProps) {
  const { user, handleAuthError } = useAuth();
  const queryClient = useQueryClient();

  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(
    groups[0]?.id || null
  );

  // Get the selected group first
  const selectedGroup = groups.find((g) => g.id === selectedGroupId);

  // Find current user in the selected group to get their user_id
  const currentUserInGroup = selectedGroup?.users.find(
    (groupUser: TGroupUser) =>
      groupUser.user.username === user?.userInfo?.username
  );
  const currentUserId = currentUserInGroup?.user_id;
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Goal editing state
  const [selectedGoal, setSelectedGoal] = useState<TGoal | null>(null);
  const progressModal = useModal();
  const editModal = useModal();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleUpdateProgress = (goal: TGoal) => {
    setSelectedGoal(goal);
    progressModal.open();
  };

  const handleEditGoal = (goal: TGoal) => {
    setSelectedGoal(goal);
    editModal.open();
  };

  const handleSaveProgress = async (progressData: any) => {
    try {
      // Update each week individually using the existing API
      const updatePromises = Object.entries(progressData.weekProgress).map(
        async ([weekNumber, data]: [string, any]) => {
          const goalWeek = selectedGoal?.goalWeeks.find(
            (w: any) => w.weekNumber === parseInt(weekNumber)
          );

          if (goalWeek) {
            return updateGoalProgressById(user!.token!, {
              id: goalWeek.id,
              goal_id: progressData.goalId,
              weekNumber: parseInt(weekNumber),
              feedback: data.notes || goalWeek.feedback || "",
              targetAmount: goalWeek.targetAmount,
              completedAmount: data.completedAmount ?? goalWeek.completedAmount,
              achieved: data.achieved,
              notes: data.notes,
            } as any);
          }
        }
      );

      await Promise.all(updatePromises.filter(Boolean));
      // Refetch group data to update UI
      queryClient.invalidateQueries({ queryKey: ["groups", user!.token!] });
    } catch (error) {
      console.error("Failed to save progress:", error);
      handleAuthError(error);
    }
  };

  const handleSaveGoal = async (goalData: any) => {
    try {
      await updateGoalById(user!.token!, goalData);
      // Refetch group data to update UI
      queryClient.invalidateQueries({ queryKey: ["groups", user!.token!] });
    } catch (error) {
      console.error("Failed to update goal:", error);
      handleAuthError(error);
    }
  };

  // Calculate member progress for the selected group
  const getMemberProgress = (group: TGroup): MemberProgress[] => {
    const memberProgressMap = new Map<string, MemberProgress>();

    // Check if group has required properties
    if (!group || !group.users || !Array.isArray(group.users)) {
      console.warn("Invalid group structure:", group);
      return [];
    }

    // Initialize members
    group.users.forEach((groupUser: TGroupUser) => {
      memberProgressMap.set(groupUser.user_id, {
        userId: groupUser.user_id,
        username: groupUser.user.username,
        role: groupUser.role,
        goals: [],
      });
    });

    // Process shared goals
    if (!group.sharedGoals || !Array.isArray(group.sharedGoals)) {
      console.warn("Group missing sharedGoals:", group);
      return Array.from(memberProgressMap.values());
    }

    group.sharedGoals.forEach((sharedGoal: TSharedGoal) => {
      let goal: TGoal | undefined = sharedGoal.goal;
      // If goal data is missing, try to find it in user's goals
      if (!goal && sharedGoal.goal_id) {
        goal = userGoals.find((g) => g.id === sharedGoal.goal_id);
      }
      // Check if goal data is properly populated
      if (!goal) {
        console.warn(
          "Shared goal missing goal data and not found in user goals:",
          sharedGoal
        );
        return;
      }

      // Skip if goal doesn't have user_id
      if (!goal.user_id) {
        console.warn("Goal missing user_id:", goal);
        return;
      }

      const member = memberProgressMap.get(goal.user_id);

      if (member) {
        const currentWeek = goal.startDate
          ? getCurrentGoalWeek(goal.startDate, goal.cycleDuration || 12)
          : 1;

        const currentWeekData = goal.goalWeeks?.find(
          (w) => w.weekNumber === currentWeek
        );

        const currentWeekProgress = currentWeekData
          ? {
              completed: currentWeekData.completedAmount,
              target: currentWeekData.targetAmount,
              percentage: Math.round(
                (currentWeekData.completedAmount /
                  currentWeekData.targetAmount) *
                  100
              ),
            }
          : { completed: 0, target: 1, percentage: 0 };

        const weeksCompleted =
          goal.goalWeeks?.filter((w) => w.achieved).length || 0;
        const totalWeeks = goal.cycleDuration || 12;
        const overallProgress = {
          weeksCompleted,
          totalWeeks,
          percentage: Math.round((weeksCompleted / totalWeeks) * 100),
        };

        member.goals.push({
          goal,
          currentWeekProgress,
          overallProgress,
        });
      } else {
        console.warn(
          "Goal user_id",
          goal.user_id,
          "not found in group members. Goal:",
          goal.title
        );
      }
    });

    return Array.from(memberProgressMap.values());
  };

  const memberProgress = selectedGroup ? getMemberProgress(selectedGroup) : [];

  // Sort members: admins first, then by username
  memberProgress.sort((a, b) => {
    if (a.role === "ADMIN" && b.role !== "ADMIN") return -1;
    if (a.role !== "ADMIN" && b.role === "ADMIN") return 1;
    return a.username.localeCompare(b.username);
  });

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-headers tracking-tight">
            Groups Overview
          </h1>
          <p className="text-muted-foreground mt-2">
            Track progress across all your groups and members
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Mobile Group Selector Button */}
          {isMobile && groups.length > 0 && (
            <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="lg:hidden">
                  <Menu className="h-4 w-4 mr-2" />
                  Groups
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[350px]">
                <SheetHeader>
                  <SheetTitle>Your Groups</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-3">
                  {groups.map((group) => (
                    <Card
                      key={group.id}
                      className={`cursor-pointer transition-all hover:border-primary/50 ${
                        selectedGroupId === group.id
                          ? "border-primary ring-2 ring-primary/20"
                          : ""
                      }`}
                      onClick={() => {
                        setSelectedGroupId(group.id);
                        setIsDrawerOpen(false);
                      }}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-subheaders">{group.name}</h4>
                            <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {group.users.length}
                              </span>
                              <span className="flex items-center gap-1">
                                <Target className="h-3 w-3" />
                                {group.sharedGoals.length}
                              </span>
                            </div>
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          )}
          <Badge variant="outline" className="gap-1">
            <Users className="h-3 w-3" />
            {groups.length} {groups.length === 1 ? "Group" : "Groups"}
          </Badge>
        </div>
      </div>

      {groups.length === 0 ? (
        <Card className="card-gradient-empty">
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 flex items-center justify-center">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-subheaders mb-2">No groups yet</h3>
              <p className="text-muted-foreground mb-4">
                Create or join a group to start collaborating on goals
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
          {/* Groups List - Hidden on mobile */}
          <div className="hidden lg:block space-y-3">
            <h3 className="text-sm font-subheaders text-muted-foreground mb-2">
              YOUR GROUPS
            </h3>
            {groups.map((group) => (
              <Card
                key={group.id}
                className={`cursor-pointer transition-all hover:border-primary/50 ${
                  selectedGroupId === group.id
                    ? "border-primary ring-2 ring-primary/20"
                    : ""
                }`}
                onClick={() => setSelectedGroupId(group.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-subheaders">{group.name}</h4>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {group.users.length}
                        </span>
                        <span className="flex items-center gap-1">
                          <Target className="h-3 w-3" />
                          {group.sharedGoals.length}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Selected Group Details */}
          {selectedGroup && (
            <div className="space-y-6">
              {/* Group Header */}
              <Card className="card-gradient">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl">
                        {selectedGroup.name}
                      </CardTitle>
                      <p className="text-muted-foreground mt-1">
                        {selectedGroup.description}
                      </p>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link
                        to="/dashboard/groups/$groupId"
                        params={{ groupId: selectedGroup.id }}
                      >
                        View Details
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-primary">
                        {selectedGroup.users.length}
                      </p>
                      <p className="text-sm text-muted-foreground">Members</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-secondary">
                        {selectedGroup.sharedGoals.length}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Shared Goals
                      </p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-accent">
                        {memberProgress.reduce(
                          (acc, member) =>
                            acc +
                            member.goals.filter(
                              (g) => g.currentWeekProgress.percentage === 100
                            ).length,
                          0
                        )}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Completed This Week
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Members Progress */}
              <div className="space-y-4">
                <h3 className="text-lg font-subheaders flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Member Progress
                </h3>

                {memberProgress.map((member) => (
                  <Card key={member.userId} className="card-gradient">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {(() => {
                            const avatarProps = getAvatarProps(
                              undefined,
                              undefined,
                              member.username,
                              "md"
                            );
                            return (
                              <Avatar className={avatarProps.className}>
                                <AvatarFallback
                                  className={avatarProps.fallbackClassName}
                                >
                                  {/* TODO: Pass firstName/lastName when available from backend */}
                                  {avatarProps.initials}
                                </AvatarFallback>
                              </Avatar>
                            );
                          })()}
                          <div>
                            <h4 className="font-subheaders flex items-center gap-2">
                              {member.username}
                              {member.role === "ADMIN" && (
                                <Badge
                                  variant="secondary"
                                  className="gap-1 text-xs"
                                >
                                  <Crown className="h-3 w-3" />
                                  Admin
                                </Badge>
                              )}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {member.goals.length}{" "}
                              {member.goals.length === 1 ? "goal" : "goals"}{" "}
                              shared
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {member.goals.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          No goals shared with this group yet
                        </p>
                      ) : (
                        <Tabs defaultValue="week" className="w-full">
                          <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="week">This Week</TabsTrigger>
                            <TabsTrigger value="overall">Overall</TabsTrigger>
                          </TabsList>
                          <TabsContent value="week" className="space-y-3 mt-4">
                            {member.goals.map((goalData) => {
                              const currentWeek = goalData.goal.startDate
                                ? getCurrentGoalWeek(
                                    goalData.goal.startDate,
                                    goalData.goal.cycleDuration || 12
                                  )
                                : 1;

                              return (
                                <div
                                  key={goalData.goal.id}
                                  className="space-y-2"
                                >
                                  <div className="flex items-center justify-between">
                                    <h5 className="font-subheaders text-sm">
                                      {goalData.goal.title}
                                    </h5>
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      <Clock className="h-3 w-3 mr-1" />
                                      Week {currentWeek}
                                    </Badge>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <Progress
                                      value={
                                        goalData.currentWeekProgress.percentage
                                      }
                                      className="flex-1 h-2"
                                    />
                                    <span className="text-sm font-medium min-w-[60px] text-right">
                                      {goalData.currentWeekProgress.completed} /{" "}
                                      {goalData.currentWeekProgress.target}
                                    </span>
                                  </div>
                                  {/* Show edit buttons if this is the current user's goal */}
                                  {currentUserId === goalData.goal.user_id && (
                                    <div className="flex items-center gap-1 mt-2">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                          handleEditGoal(goalData.goal)
                                        }
                                        className="text-xs h-6 px-2 hover:bg-secondary/10"
                                      >
                                        <Edit className="h-3 w-3 mr-1" />
                                        Edit
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                          handleUpdateProgress(goalData.goal)
                                        }
                                        className="text-xs h-6 px-2 border-primary/30 hover:border-primary hover:bg-primary/10"
                                      >
                                        <BarChart3 className="h-3 w-3 mr-1" />
                                        Update
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </TabsContent>
                          <TabsContent
                            value="overall"
                            className="space-y-3 mt-4"
                          >
                            {member.goals.map((goalData) => (
                              <div key={goalData.goal.id} className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <h5 className="font-subheaders text-sm">
                                    {goalData.goal.title}
                                  </h5>
                                  <Badge
                                    variant={
                                      goalData.overallProgress.percentage >= 80
                                        ? "default"
                                        : goalData.overallProgress.percentage >=
                                            50
                                          ? "secondary"
                                          : "outline"
                                    }
                                    className="text-xs"
                                  >
                                    {goalData.overallProgress.percentage}%
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-3">
                                  <Progress
                                    value={goalData.overallProgress.percentage}
                                    className="flex-1 h-2"
                                  />
                                  <span className="text-sm font-medium min-w-[80px] text-right">
                                    {goalData.overallProgress.weeksCompleted} /{" "}
                                    {goalData.overallProgress.totalWeeks} weeks
                                  </span>
                                </div>
                                {/* Show edit buttons if this is the current user's goal */}
                                {currentUserId === goalData.goal.user_id && (
                                  <div className="flex items-center gap-1 mt-2">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() =>
                                        handleEditGoal(goalData.goal)
                                      }
                                      className="text-xs h-6 px-2 hover:bg-secondary/10"
                                    >
                                      <Edit className="h-3 w-3 mr-1" />
                                      Edit
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        handleUpdateProgress(goalData.goal)
                                      }
                                      className="text-xs h-6 px-2 border-primary/30 hover:border-primary hover:bg-primary/10"
                                    >
                                      <BarChart3 className="h-3 w-3 mr-1" />
                                      Update
                                    </Button>
                                  </div>
                                )}
                              </div>
                            ))}
                          </TabsContent>
                        </Tabs>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Goal Progress Modal */}
      <Modal
        isOpen={progressModal.isOpen}
        onClose={progressModal.close}
        title="Update Goal Progress"
        size="xl"
      >
        {selectedGoal && (
          <GoalProgressTracker
            goal={selectedGoal}
            onClose={progressModal.close}
            onSave={handleSaveProgress}
          />
        )}
      </Modal>

      {/* Edit Goal Modal */}
      <Modal
        isOpen={editModal.isOpen}
        onClose={editModal.close}
        title="Edit Goal"
        size="xl"
      >
        {selectedGoal && (
          <GoalForm
            goal={selectedGoal}
            onClose={editModal.close}
            onSave={handleSaveGoal}
          />
        )}
      </Modal>
    </div>
  );
}
