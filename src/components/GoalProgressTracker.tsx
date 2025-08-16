import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  Target, 
  Calendar,
  CheckCircle2,
  Circle,
  Trophy,
  MessageSquare,
  Save,
  X,
  Clock
} from "lucide-react";
import { TGoal } from "../types";
import { toast } from "sonner";
import { getCurrentGoalWeek, getWeekDateRange } from "../utils/goalWeekCalculator";

interface GoalProgressTrackerProps {
  goal: TGoal;
  onClose: () => void;
  onSave: (progressData: any) => void;
}

export function GoalProgressTracker({ goal, onClose, onSave }: GoalProgressTrackerProps) {
  // Use goal cycle week instead of calendar week
  // TODO: Remove hardcoded values when backend supports startDate/cycleDuration
  const currentWeek = goal.startDate ? getCurrentGoalWeek(goal.startDate, goal.cycleDuration || 12) : 1;
  const cycleDuration = goal.cycleDuration || 12;
  
  const [weekProgress, setWeekProgress] = useState<Record<number, {
    achieved: boolean;
    notes: string;
    completedAmount?: number;
  }>>({});

  // SMART sections with color coding
  const smartSections = [
    {
      key: "S",
      label: "Specific",
      color: "bg-blue-500",
      lightColor: "bg-blue-100 text-blue-800 border-blue-200",
      description: goal.specific || goal.description
    },
    {
      key: "M", 
      label: "Measurable",
      color: "bg-green-500",
      lightColor: "bg-green-100 text-green-800 border-green-200",
      description: goal.measurable || "Track your progress each week"
    },
    {
      key: "A",
      label: "Attainable", 
      color: "bg-red-500",
      lightColor: "bg-red-100 text-red-800 border-red-200",
      description: goal.attainable || "Break down into achievable steps"
    },
    {
      key: "R",
      label: "Relevant",
      color: "bg-purple-500", 
      lightColor: "bg-purple-100 text-purple-800 border-purple-200",
      description: goal.relevant || "Aligned with your values"
    }
  ];

  const getWeekStatus = (weekNumber: number) => {
    const weekData = goal.goalWeeks?.find(w => w.weekNumber === weekNumber);
    const progress = weekProgress[weekNumber];
    
    if (progress?.achieved || weekData?.achieved) {
      return { icon: CheckCircle2, color: "text-green-600", label: "Achieved" };
    }
    if (weekNumber < currentWeek) {
      return { icon: X, color: "text-red-600", label: "Missed" };
    }
    if (weekNumber === currentWeek) {
      return { icon: Circle, color: "text-primary", label: "Current" };
    }
    return { icon: Circle, color: "text-muted-foreground", label: "Upcoming" };
  };

  const handleSave = () => {
    const progressData = {
      goalId: goal.id,
      weekProgress: weekProgress
    };
    
    onSave(progressData);
    toast.success("Progress saved successfully!");
    onClose();
  };

  const handleWeekToggle = (weekNumber: number) => {
    const weekData = goal.goalWeeks?.find(w => w.weekNumber === weekNumber);
    const isCurrentlyAchieved = weekProgress[weekNumber]?.achieved ?? weekData?.achieved ?? false;
    const newAchieved = !isCurrentlyAchieved;
    
    // For simple goals (targetAmount = 1), completedAmount follows achieved status
    // For complex goals (targetAmount > 1), use existing completedAmount or default to 0
    let newCompletedAmount: number;
    if (weekData?.targetAmount === 1) {
      newCompletedAmount = newAchieved ? 1 : 0;
    } else {
      newCompletedAmount = weekProgress[weekNumber]?.completedAmount ?? weekData?.completedAmount ?? 0;
    }
    
    setWeekProgress(prev => ({
      ...prev,
      [weekNumber]: {
        ...prev[weekNumber],
        achieved: newAchieved,
        notes: prev[weekNumber]?.notes || weekData?.notes || '',
        completedAmount: newCompletedAmount
      }
    }));
  };

  const handleNotesChange = (weekNumber: number, notes: string) => {
    setWeekProgress(prev => ({
      ...prev,
      [weekNumber]: {
        ...prev[weekNumber],
        notes
      }
    }));
  };

  const handleCompletedAmountChange = (weekNumber: number, completedAmount: number) => {
    const weekData = goal.goalWeeks?.find(w => w.weekNumber === weekNumber);
    const targetAmount = weekData?.targetAmount ?? 1;
    
    setWeekProgress(prev => ({
      ...prev,
      [weekNumber]: {
        ...prev[weekNumber],
        completedAmount,
        // For complex goals, achieved is based on whether completed >= target
        achieved: weekData?.targetAmount === 1 ? 
          (prev[weekNumber]?.achieved ?? false) : 
          completedAmount >= targetAmount,
        notes: prev[weekNumber]?.notes || weekData?.notes || ''
      }
    }));
  };

  // Generate weeks for the goal cycle (show all weeks 1 through cycleDuration)
  const weeks = Array.from({ length: cycleDuration }, (_, i) => i + 1);

  return (
    <div className="max-h-[80vh] overflow-y-auto space-y-6">
      {/* Goal Header */}
      <div className="sticky top-0 bg-background z-10 pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-2xl font-bold">{goal.title}</h2>
            <p className="text-muted-foreground mt-1">{goal.description}</p>
            <div className="flex items-center gap-4 mt-2 text-sm">
              <Badge variant="outline" className="gap-1">
                <Clock className="h-3 w-3" />
                Week {currentWeek} of {cycleDuration}
              </Badge>
              {goal.startDate && goal.endDate && (
                <span className="text-muted-foreground">
                  {new Date(goal.startDate).toLocaleDateString()} - {new Date(goal.endDate).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* SMART Goals Display - Column Layout */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Target className="h-5 w-5" />
          SMART Goal Breakdown
        </h3>
        <div className="grid gap-3">
          {smartSections.map((section) => (
            <Card key={section.key} className="card-gradient">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-full ${section.color} flex items-center justify-center text-white font-bold text-lg`}>
                    {section.key}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className={section.lightColor}>
                        {section.label}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {section.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Weekly Progress Tracking */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Weekly Progress
        </h3>
        <div className="space-y-3">
          {weeks.map((weekNumber) => {
            const status = getWeekStatus(weekNumber);
            const weekData = goal.goalWeeks?.find(w => w.weekNumber === weekNumber);
            const progress = weekProgress[weekNumber];
            const StatusIcon = status.icon;
            
            return (
              <Card 
                key={weekNumber} 
                className={`card-gradient ${weekNumber === currentWeek ? 'ring-2 ring-primary' : ''}`}
              >
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <StatusIcon className={`h-5 w-5 ${status.color}`} />
                        <div>
                          <h4 className="font-semibold">
                            Week {weekNumber}
                            {weekNumber === currentWeek && (
                              <Badge className="ml-2 bg-primary">Current</Badge>
                            )}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {weekData ? `${progress?.completedAmount ?? weekData.completedAmount} / ${weekData.targetAmount}` : 'No target set'}
                            {goal.startDate && (
                              <span className="ml-2 text-xs">
                                ({getWeekDateRange(goal.startDate, weekNumber).weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })})
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                      
                      {weekNumber <= currentWeek && (
                        <div className="space-y-3">
                          {/* Progress Amount Input for targetAmount > 1 */}
                          {weekData && weekData.targetAmount > 1 && (
                            <div className="space-y-2">
                              <Label htmlFor={`progress-${weekNumber}`} className="text-sm font-medium">
                                Progress This Week
                              </Label>
                              <div className="flex items-center gap-2">
                                <Input
                                  id={`progress-${weekNumber}`}
                                  type="number"
                                  min="0"
                                  max={weekData.targetAmount}
                                  value={progress?.completedAmount ?? weekData?.completedAmount ?? 0}
                                  onChange={(e) => handleCompletedAmountChange(weekNumber, parseInt(e.target.value) || 0)}
                                  className="w-20"
                                />
                                <span className="text-sm text-muted-foreground">
                                  / {weekData.targetAmount}
                                </span>
                              </div>
                            </div>
                          )}
                          
                          {/* Achievement Checkbox */}
                          <div className="flex items-center gap-2">
                            <Checkbox
                              id={`week-${weekNumber}`}
                              checked={progress?.achieved ?? weekData?.achieved ?? false}
                              onCheckedChange={() => handleWeekToggle(weekNumber)}
                            />
                            <Label 
                              htmlFor={`week-${weekNumber}`}
                              className="text-sm font-medium cursor-pointer"
                            >
                              {weekData?.targetAmount === 1 ? 'Goal Achieved' : 'Week Complete'}
                            </Label>
                          </div>
                        </div>
                      )}
                    </div>

                    {weekNumber <= currentWeek && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MessageSquare className="h-4 w-4" />
                          <span>Weekly Notes</span>
                        </div>
                        <Textarea
                          placeholder="Add notes about your progress this week..."
                          value={progress?.notes || weekData?.feedback || ''}
                          onChange={(e) => handleNotesChange(weekNumber, e.target.value)}
                          className="min-h-[80px] resize-none"
                        />
                      </div>
                    )}

                    {weekData && weekData.targetAmount > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">
                            {Math.round(((progress?.completedAmount ?? weekData.completedAmount) / weekData.targetAmount) * 100)}%
                          </span>
                        </div>
                        <Progress 
                          value={((progress?.completedAmount ?? weekData.completedAmount) / weekData.targetAmount) * 100} 
                          className="h-2"
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Overall Progress Summary */}
      <Card className="card-gradient-empty">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            Overall Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="space-y-1">
                <p className="text-2xl font-bold text-primary">
                  {Object.values(weekProgress).filter(w => w.achieved).length}
                </p>
                <p className="text-sm text-muted-foreground">Weeks Achieved</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-secondary">
                  {Math.round(
                    (Object.values(weekProgress).filter(w => w.achieved).length / 
                    weeks.filter(w => w <= currentWeek).length) * 100
                  ) || 0}%
                </p>
                <p className="text-sm text-muted-foreground">Success Rate</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSave} className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90">
          <Save className="h-4 w-4 mr-2" />
          Save Progress
        </Button>
      </div>
    </div>
  );
}

