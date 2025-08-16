import { useSuspenseQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Calendar, Target, Award, BarChart3 } from "lucide-react";
import { goalsQueryOptions } from "../api/goals/goalQueries";
import { useAuth } from "../providers/auth.provider";
import { TGoal } from "../types";

export function MonthlyProgress() {
  const { user } = useAuth();
  const { data: goals = [] } = useSuspenseQuery(
    goalsQueryOptions(user!.token!)
  );

  // Calculate real stats from actual goal data
  const calculateMonthlyStats = () => {
    if (goals.length === 0) {
      return {
        completedGoals: 0,
        totalGoals: 0,
        streakDays: 0,
        averageProgress: 0,
      };
    }

    // Count goals that have any achieved weeks
    const completedGoals = goals.filter((goal: TGoal) => 
      goal.goalWeeks.some(week => week.achieved)
    ).length;

    // Calculate average progress across all goals
    let totalProgress = 0;
    let totalWeeks = 0;
    
    goals.forEach((goal: TGoal) => {
      goal.goalWeeks.forEach(week => {
        totalProgress += Math.min((week.completedAmount / week.targetAmount) * 100, 100);
        totalWeeks++;
      });
    });

    const averageProgress = totalWeeks > 0 ? Math.round(totalProgress / totalWeeks) : 0;

    return {
      completedGoals,
      totalGoals: goals.length,
      streakDays: 0, // This would need to be calculated from backend data
      averageProgress,
    };
  };

  const monthlyStats = calculateMonthlyStats();
  const completionRate = goals.length > 0 ? Math.round((monthlyStats.completedGoals / monthlyStats.totalGoals) * 100) : 0;

  const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-subheaders tracking-wide">Monthly Progress</h2>
          <p className="text-muted-foreground">
            Your performance overview for {currentMonth}
          </p>
        </div>
        <Badge variant="outline" className="px-3 py-1">
          <Calendar className="h-3 w-3 mr-1" />
          {currentMonth}
        </Badge>
      </div>

      {goals.length === 0 ? (
        <Card className="card-gradient-empty">
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 flex items-center justify-center">
                <BarChart3 className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-subheaders mb-2">No Progress Data Yet</h3>
              <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                Create some goals and start tracking your progress to see your monthly statistics and performance insights here.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="card-gradient">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completed Goals
            </CardTitle>
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <Target className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{monthlyStats.completedGoals}</div>
            <p className="text-xs text-muted-foreground">
              out of {monthlyStats.totalGoals} total goals
            </p>
          </CardContent>
        </Card>

        <Card className="card-gradient">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completion Rate
            </CardTitle>
            <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center">
              <BarChart3 className="h-4 w-4 text-secondary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionRate}%</div>
            <p className="text-xs text-muted-foreground">
              of goals completed
            </p>
          </CardContent>
        </Card>

        <Card className="card-gradient">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Current Streak
            </CardTitle>
            <div className="w-8 h-8 rounded-full bg-yellow-200/50 flex items-center justify-center">
              <Award className="h-4 w-4 text-yellow-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{monthlyStats.streakDays}</div>
            <p className="text-xs text-muted-foreground">
              days in a row
            </p>
          </CardContent>
        </Card>

        <Card className="card-gradient">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Progress
            </CardTitle>
            <div className="w-8 h-8 rounded-full bg-purple-200/50 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{monthlyStats.averageProgress}%</div>
            <p className="text-xs text-muted-foreground">
              across all goals
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Breakdown - Only show if there are goals with week data */}
      {goals.length > 0 && goals.some((goal: TGoal) => goal.goalWeeks.length > 0) && (
        <Card className="card-gradient-empty">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-primary" />
              </div>
              Weekly Overview
            </CardTitle>
            <CardDescription>
              Current week progress across all goals
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {goals.filter((goal: TGoal) => goal.goalWeeks.length > 0).map((goal: TGoal) => {
              // Get the most recent week or current week for this goal
              const currentWeek = goal.goalWeeks[goal.goalWeeks.length - 1];
              const progress = Math.min((currentWeek.completedAmount / currentWeek.targetAmount) * 100, 100);
              
              return (
                <div key={goal.id} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium truncate flex-1 mr-2">{goal.title}</span>
                    <span className="text-muted-foreground whitespace-nowrap">
                      {Math.round(progress)}% completed
                    </span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Goal Performance */}
      {goals.length > 0 && (
        <Card className="card-gradient-empty">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-secondary/20 to-primary/20 flex items-center justify-center">
                <Target className="h-5 w-5 text-secondary" />
              </div>
              Goal Performance
            </CardTitle>
            <CardDescription>
              Individual goal progress this month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {goals.slice(0, 5).map((goal: TGoal) => {
                // Calculate overall progress for this goal across all weeks
                let totalProgress = 0;
                let weekCount = 0;
                
                goal.goalWeeks.forEach(week => {
                  totalProgress += Math.min((week.completedAmount / week.targetAmount) * 100, 100);
                  weekCount++;
                });
                
                const averageProgress = weekCount > 0 ? Math.round(totalProgress / weekCount) : 0;
                
                return (
                  <div key={goal.id} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium truncate flex-1 mr-2">
                        {goal.title}
                      </span>
                      <span className="text-muted-foreground whitespace-nowrap">
                        {averageProgress}%
                      </span>
                    </div>
                    <Progress value={averageProgress} className="h-2" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
        </>
      )}
    </div>
  );
}