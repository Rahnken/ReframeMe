/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Target, Plus, Clock, CheckCircle2, Circle, Edit } from "lucide-react";
import { goalsQueryOptions } from "../api/goals/goalQueries";
import { useAuth } from "../providers/auth.provider";
import { TGoal } from "../types";
import { useState } from "react";
import { Modal } from "./component-parts/modal";
import { GoalProgressTracker } from "./GoalProgressTracker";
import { EditGoalForm } from "./EditGoalForm";
import { updateGoalProgressById, updateGoalById } from "../api/goals/goals";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getCurrentGoalWeek } from "../utils/goalWeekCalculator";

interface WeeklyGoalsProps {
  onCreateGoal?: () => void;
}

export function WeeklyGoals({ onCreateGoal }: WeeklyGoalsProps = {}) {
  const { user, handleAuthError } = useAuth();
  const queryClient = useQueryClient();
  
  const { data: goals = [] } = useSuspenseQuery(goalsQueryOptions(user!.token!));

  const [selectedGoal, setSelectedGoal] = useState<TGoal | null>(null);
  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const getGoalProgress = (goal: TGoal) => {
    // Calculate progress based on goal cycle week, not calendar week
    const currentGoalWeek = goal.startDate
      ? getCurrentGoalWeek(goal.startDate, goal.cycleDuration || 12)
      : 1;

    const currentWeekProgress = goal.goalWeeks.find(
      (week) => week.weekNumber === currentGoalWeek
    );

    if (currentWeekProgress) {
      const percentage = Math.round(
        (currentWeekProgress.completedAmount /
          currentWeekProgress.targetAmount) *
          100
      );
      return {
        completed: currentWeekProgress.completedAmount,
        total: currentWeekProgress.targetAmount,
        percentage: Math.min(percentage, 100),
        currentWeek: currentGoalWeek,
        totalWeeks: goal.cycleDuration || 12,
      };
    }

    // Default values if no progress data
    return {
      completed: 0,
      total: goal.goalWeeks[0]?.targetAmount || 1,
      percentage: 0,
      currentWeek: currentGoalWeek,
      totalWeeks: goal.cycleDuration || 12,
    };
  };

  const getStatusBadge = (percentage: number) => {
    if (percentage === 100)
      return {
        label: "Complete",
        variant: "default" as const,
        color: "bg-green-100 text-green-800",
      };
    if (percentage >= 75)
      return {
        label: "On Track",
        variant: "secondary" as const,
        color: "bg-blue-100 text-blue-800",
      };
    if (percentage >= 50)
      return {
        label: "Behind",
        variant: "outline" as const,
        color: "bg-yellow-100 text-yellow-800",
      };
    return {
      label: "At Risk",
      variant: "destructive" as const,
      color: "bg-red-100 text-red-800",
    };
  };

  const handleUpdateProgress = (goal: TGoal) => {
    setSelectedGoal(goal);
    setIsProgressModalOpen(true);
  };

  const handleEditGoal = (goal: TGoal) => {
    setSelectedGoal(goal);
    setIsEditModalOpen(true);
  };

  const handleSaveProgress = async (progressData: any) => {
    try {
      // Update each week individually using the existing API
      const updatePromises = Object.entries(progressData.weekProgress).map(
        async ([weekNumber, data]: [string, any]) => {
          const goalWeek = goals
            .find((g: TGoal) => g.id === progressData.goalId)
            ?.goalWeeks.find((w: any) => w.weekNumber === parseInt(weekNumber));

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
      toast.success("Progress saved successfully!");
      // Refetch goals to update UI
      queryClient.invalidateQueries({ queryKey: ["goals", user!.token!] });
    } catch (error) {
      console.error("Failed to save progress:", error);
      handleAuthError(error);
      toast.error("Failed to save progress. Please try again.");
    }
  };

  const handleSaveGoal = async (goalData: any) => {
    try {
      await updateGoalById(user!.token!, goalData);
      toast.success("Goal updated successfully!");
      // Refetch goals to update UI
      queryClient.invalidateQueries({ queryKey: ["goals", user!.token!] });
    } catch (error) {
      console.error("Failed to update goal:", error);
      handleAuthError(error);
      toast.error("Failed to update goal. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Goal Progress</h2>
          <p className="text-muted-foreground">
            Track your progress across all active goals
          </p>
        </div>
      </div>

      {goals.length === 0 ? (
        <Card className="card-gradient-empty">
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 flex items-center justify-center">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No goals yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first SMART goal to start tracking your progress
              </p>
              <Button
                onClick={onCreateGoal}
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-lg hover:shadow-primary/25"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Goal
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {goals.map((goal: TGoal) => {
            const progress = getGoalProgress(goal);
            const status = getStatusBadge(progress.percentage);

            return (
              <Card
                key={goal.id}
                className="card-gradient hover:border-primary/20"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg leading-tight">
                        {goal.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-2">
                        {goal.description}
                      </CardDescription>
                      {progress.currentWeek > 0 && (
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            Week {progress.currentWeek} of {progress.totalWeeks}
                          </Badge>
                        </div>
                      )}
                    </div>
                    <Badge className={status.color} variant={status.variant}>
                      {status.label}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">
                        {progress.completed} / {progress.total}
                      </span>
                    </div>
                    <Progress value={progress.percentage} className="h-2" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      {goal.isPrivate ? (
                        <span className="flex items-center gap-1">
                          <Circle className="h-3 w-3" />
                          Private
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Public
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditGoal(goal)}
                        className="border-secondary/30 hover:border-secondary hover:bg-secondary/10 transition-all duration-300"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateProgress(goal)}
                        className="border-primary/30 hover:border-primary hover:bg-primary/10 transition-all duration-300"
                      >
                        Update Progress
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Progress Tracking Modal */}
      <Modal
        isOpen={isProgressModalOpen}
        onClose={() => setIsProgressModalOpen(false)}
        title="Track Goal Progress"
        size="xl"
      >
        {selectedGoal && (
          <GoalProgressTracker
            goal={selectedGoal}
            onClose={() => setIsProgressModalOpen(false)}
            onSave={handleSaveProgress}
          />
        )}
      </Modal>

      {/* Edit Goal Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Goal"
        size="xl"
      >
        {selectedGoal && (
          <EditGoalForm
            goal={selectedGoal}
            onClose={() => setIsEditModalOpen(false)}
            onSave={handleSaveGoal}
          />
        )}
      </Modal>
    </div>
  );
}

// Helper to get week number
declare global {
  interface Date {
    getWeek(): number;
  }
}

Date.prototype.getWeek = function () {
  const date = new Date(this.getTime());
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
  const week1 = new Date(date.getFullYear(), 0, 4);
  return (
    1 +
    Math.round(
      ((date.getTime() - week1.getTime()) / 86400000 -
        3 +
        ((week1.getDay() + 6) % 7)) /
        7
    )
  );
};
