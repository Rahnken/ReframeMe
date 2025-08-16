import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { goalsQueryOptions } from "../../../../../api/goals/goalQueries";
import {
  groupQueryIdOptions,
  useAddMemberToGroupMutation,
} from "../../../../../api/groups/groupQueries";
import { TGroup, TSharedGoal, TGroupUser, TGoal } from "../../../../../types";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Users,
  Target,
  Crown,
  User,
  Plus,
  ChevronLeft,
  ChevronRight,
  Clock,
  Calendar,
  Trophy,
  Settings,
  UserPlus,
  Menu,
  X,
  Edit,
  BarChart3,
} from "lucide-react";
import { getCurrentGoalWeek } from "../../../../../utils/goalWeekCalculator";
import { getAvatarProps } from "../../../../../utils/avatarUtils";
import { updateGoalProgressById, updateGoalById } from "../../../../../api/goals/goals";
import { GoalProgressTracker } from "../../../../../components/GoalProgressTracker";
import { GoalForm } from "../../../../../components/forms/GoalForm";
import { Modal } from "../../../../../components/component-parts/modal";
import { useModal } from "../../../../../utils/useModal";
import { useAuth } from "../../../../../providers/auth.provider";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const Route = createFileRoute("/_auth/dashboard/groups/$groupId/")({
  loader: ({ context: { auth, queryClient }, params: { groupId } }) => {
    queryClient.ensureQueryData(
      groupQueryIdOptions(auth.user!.token!, groupId)
    );
    queryClient.ensureQueryData(goalsQueryOptions(auth.user!.token!));
  },
  component: GroupDetailPage,
});

function GroupDetailPage() {
  const {
    auth: { user: authUser },
  } = Route.useRouteContext();
  const { handleAuthError } = useAuth();
  const queryClient = useQueryClient();

  const { groupId } = Route.useParams();

  const group: TGroup = useSuspenseQuery(
    groupQueryIdOptions(authUser!.token!, groupId)
  ).data;

  const [currentWeek, setCurrentWeek] = useState(1);
  const [selectedUser, setSelectedUser] = useState<TGroupUser | null>(null);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isMembersSheetOpen, setIsMembersSheetOpen] = useState(false);
  const [identifierInput, setIdentifierInput] = useState("");
  
  // Goal editing state
  const [selectedGoal, setSelectedGoal] = useState<TGoal | null>(null);
  const progressModal = useModal();
  const editModal = useModal();

  const validIdentifier = z.string().min(1);
  const identifierValid = validIdentifier.safeParse(identifierInput).success;
  const adminUser = group.users.find((user) => user.role === "ADMIN")?.user;
  const isUserAdmin = authUser?.userInfo?.username === adminUser?.username;
  
  // Find current user in the group to get their user_id (similar to GroupsOverview)
  const currentUserInGroup = group.users.find(
    (groupUser) => groupUser.user.username === authUser?.userInfo?.username
  );
  const currentUserId = currentUserInGroup?.user_id;


  const mutation = useAddMemberToGroupMutation(
    authUser!.token!,
    groupId,
    () => {
      toast.success("Member added successfully");
      setIsAddMemberOpen(false);
      setIdentifierInput("");
    },
    (e) => {
      toast.error(`Failed to add member: ${e.message}`);
    }
  );

  const userGoals = group.users.reduce(
    (acc, user) => {
      const goalsForUser = group.sharedGoals.filter(
        (sharedGoal) => sharedGoal.goal.user_id === user.user_id
      );
      acc[user.user.username] = goalsForUser;
      return acc;
    },
    {} as Record<string, TSharedGoal[]>
  );

  const displayedGoals = selectedUser
    ? userGoals[selectedUser.user.username]
    : group.sharedGoals;

  const handleAddMember = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (identifierValid) {
      mutation.mutate([{ user_identifier: identifierInput, role: "MEMBER" }]);
    }
  };

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
          const goalWeek = selectedGoal
            ?.goalWeeks.find((w: any) => w.weekNumber === parseInt(weekNumber));

          if (goalWeek) {
            return updateGoalProgressById(authUser!.token!, {
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
      toast.success("Progress saved successfully!");
      // Refetch group data to update UI
      queryClient.invalidateQueries({ queryKey: ["groups", authUser!.token!, groupId] });
    } catch (error) {
      console.error("Failed to save progress:", error);
      handleAuthError(error);
      toast.error("Failed to save progress. Please try again.");
    }
  };

  const handleSaveGoal = async (goalData: any) => {
    try {
      await updateGoalById(authUser!.token!, goalData);
      toast.success("Goal updated successfully!");
      // Refetch group data to update UI
      queryClient.invalidateQueries({ queryKey: ["groups", authUser!.token!, groupId] });
    } catch (error) {
      console.error("Failed to update goal:", error);
      handleAuthError(error);
      toast.error("Failed to update goal. Please try again.");
    }
  };

  const maxWeek = Math.max(
    ...displayedGoals.map((sharedGoal) => 
      sharedGoal.goal.cycleDuration || 12
    ),
    12
  );

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/dashboard/groups" className="hover:text-primary">
            <ChevronLeft className="h-6 w-6" />
          </Link>
          <div>
            <h1 className="text-3xl font-headers tracking-wide">{group.name}</h1>
            <p className="text-muted-foreground mt-1">{group.description}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Mobile Members Button */}
          <Sheet open={isMembersSheetOpen} onOpenChange={setIsMembersSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="lg:hidden">
                <Menu className="h-4 w-4 mr-2" />
                Members
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[350px]">
              <SheetHeader>
                <SheetTitle>Group Members</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-3">
                <Button
                  variant={selectedUser === null ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => {
                    setSelectedUser(null);
                    setIsMembersSheetOpen(false);
                  }}
                >
                  <Users className="h-4 w-4 mr-2" />
                  All Members
                </Button>
                {group.users.map((gUser: TGroupUser) => (
                  <Button
                    key={gUser.id}
                    variant={selectedUser?.user_id === gUser.user_id ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => {
                      setSelectedUser(gUser);
                      setIsMembersSheetOpen(false);
                    }}
                  >
                    {(() => {
                      const avatarProps = getAvatarProps(undefined, undefined, gUser.user.username, "sm");
                      return (
                        <Avatar className={`${avatarProps.className} mr-2`}>
                          <AvatarFallback className={avatarProps.fallbackClassName}>
                            {avatarProps.initials}
                          </AvatarFallback>
                        </Avatar>
                      );
                    })()}
                    <span className="flex-1 text-left">{gUser.user.username}</span>
                    {gUser.role === "ADMIN" && (
                      <Crown className="h-3 w-3 text-primary" />
                    )}
                  </Button>
                ))}
              </div>
            </SheetContent>
          </Sheet>

          {isUserAdmin && (
            <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Member
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Member to {group.name}</DialogTitle>
                  <DialogDescription>
                    Invite a new member by their email address or username
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddMember}>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="identifier">Email or Username</Label>
                      <Input
                        id="identifier"
                        type="text"
                        value={identifierInput}
                        onChange={(e) => setIdentifierInput(e.target.value)}
                        placeholder="user@example.com or username"
                        required
                      />
                    </div>
                  </div>
                  <DialogFooter className="mt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsAddMemberOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={!identifierValid || mutation.isPending}
                    >
                      {mutation.isPending ? "Adding..." : "Add Member"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          )}

          <Link to={`/dashboard/groups/${groupId}/edit`}>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </Link>
        </div>
      </div>

      {/* Group Stats */}
      <Card className="card-gradient">
        <CardContent className="pt-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-primary">
                {group.users.length}
              </p>
              <p className="text-sm text-muted-foreground">Members</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-secondary">
                {group.sharedGoals.length}
              </p>
              <p className="text-sm text-muted-foreground">Shared Goals</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-accent">
                {displayedGoals.reduce(
                  (acc, sharedGoal) => {
                    const currentWeekData = sharedGoal.goal.goalWeeks?.find(
                      (w) => w.weekNumber === currentWeek
                    );
                    return acc + (currentWeekData?.achieved ? 1 : 0);
                  },
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

      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        {/* Members Sidebar - Hidden on mobile */}
        <div className="hidden lg:block space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Filter by Member</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant={selectedUser === null ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => setSelectedUser(null)}
              >
                <Users className="h-4 w-4 mr-2" />
                All Members
              </Button>
              {group.users.map((gUser: TGroupUser) => (
                <Button
                  key={gUser.id}
                  variant={selectedUser?.user_id === gUser.user_id ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setSelectedUser(gUser)}
                >
                  {(() => {
                    const avatarProps = getAvatarProps(undefined, undefined, gUser.user.username, "sm");
                    return (
                      <Avatar className={`${avatarProps.className} mr-2`}>
                        <AvatarFallback className={avatarProps.fallbackClassName}>
                          {avatarProps.initials}
                        </AvatarFallback>
                      </Avatar>
                    );
                  })()}
                  <span className="flex-1 text-left">{gUser.user.username}</span>
                  {gUser.role === "ADMIN" && (
                    <Crown className="h-3 w-3 text-primary" />
                  )}
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Week Navigation */}
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="sm"
              disabled={currentWeek === 1}
              onClick={() => setCurrentWeek(currentWeek - 1)}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <Badge variant="outline" className="px-4 py-2">
              <Clock className="h-4 w-4 mr-2" />
              Week {currentWeek}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              disabled={currentWeek >= maxWeek}
              onClick={() => setCurrentWeek(currentWeek + 1)}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>

          {/* Goals Grid */}
          {displayedGoals.length === 0 ? (
            <Card className="card-gradient-empty">
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-subheaders mb-2">No goals found</h3>
                  <p className="text-muted-foreground">
                    {selectedUser
                      ? `${selectedUser.user.username} hasn't shared any goals with this group yet`
                      : "No goals have been shared with this group yet"}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {displayedGoals.map((sharedGoal: TSharedGoal) => (
                <GoalCard
                  key={sharedGoal.goal.id}
                  goal={sharedGoal.goal}
                  group={group}
                  currentWeek={currentWeek}
                  onUpdateProgress={handleUpdateProgress}
                  onEditGoal={handleEditGoal}
                  currentUserId={currentUserId}
                />
              ))}
            </div>
          )}
        </div>
      </div>

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

function GoalCard({
  goal,
  group,
  currentWeek,
  onUpdateProgress,
  onEditGoal,
  currentUserId,
}: {
  goal: TGoal;
  group: TGroup;
  currentWeek: number;
  onUpdateProgress?: (goal: TGoal) => void;
  onEditGoal?: (goal: TGoal) => void;
  currentUserId?: string;
}) {
  const userForGoal = group.users.find(
    (gUser: TGroupUser) => gUser.user_id === goal.user_id
  );
  const username = userForGoal ? userForGoal.user.username : "Unknown";
  
  const currentWeekData = goal.goalWeeks?.find(w => w.weekNumber === currentWeek);
  const progressPercentage = currentWeekData 
    ? Math.round((currentWeekData.completedAmount / currentWeekData.targetAmount) * 100)
    : 0;

  const totalWeeksCompleted = goal.goalWeeks?.filter(w => w.achieved).length || 0;
  const totalWeeks = goal.cycleDuration || 12;
  const overallProgress = Math.round((totalWeeksCompleted / totalWeeks) * 100);

  return (
    <Card className="card-gradient hover:border-primary/20 transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <CardTitle className="text-lg leading-tight">{goal.title}</CardTitle>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {goal.description}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge variant="outline" className="text-xs">
              <User className="h-3 w-3 mr-1" />
              {username}
            </Badge>
            {currentWeekData?.achieved && (
              <Badge className="text-xs bg-green-500 text-white">
                <Trophy className="h-3 w-3 mr-1" />
                Achieved
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="week" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="week">This Week</TabsTrigger>
            <TabsTrigger value="overall">Overall</TabsTrigger>
          </TabsList>
          <TabsContent value="week" className="space-y-3 mt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Week {currentWeek} Progress</span>
              <span className="font-medium">{progressPercentage}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Target</span>
              <span className="font-medium">
                {currentWeekData?.completedAmount || 0} / {currentWeekData?.targetAmount || 1}
              </span>
            </div>
            {currentWeekData?.notes && (
              <div className="mt-2 p-2 bg-muted rounded text-sm">
                <p className="text-muted-foreground mb-1">Notes:</p>
                <p>{currentWeekData.notes}</p>
              </div>
            )}
          </TabsContent>
          <TabsContent value="overall" className="space-y-3 mt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Overall Progress</span>
              <span className="font-medium">{overallProgress}%</span>
            </div>
            <Progress value={overallProgress} className="h-2" />
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Weeks Completed</span>
              <span className="font-medium">
                {totalWeeksCompleted} / {totalWeeks}
              </span>
            </div>
          </TabsContent>
        </Tabs>
        {/* Show edit buttons if this is the current user's goal */}
        {currentUserId && goal.user_id === currentUserId && onUpdateProgress && onEditGoal && (
          <div className="flex items-center gap-2 pt-3 border-t border-border/20">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEditGoal(goal)}
              className="flex-1 hover:bg-secondary/10 transition-all duration-300"
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit Goal
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onUpdateProgress(goal)}
              className="flex-1 border-primary/30 hover:border-primary hover:bg-primary/10 transition-all duration-300"
            >
              <BarChart3 className="h-4 w-4 mr-1" />
              Update Progress
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}