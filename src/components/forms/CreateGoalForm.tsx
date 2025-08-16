import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Globe, Lock, Target, CheckCircle, Users, Calendar, Clock } from "lucide-react";
import { GoalCreateBody } from "../../api/goals/goals";
import { useAuth } from "../../providers/auth.provider";
import { useCreateGoalMutation } from "../../api/goals/goalQueries";
import { useSuspenseQuery } from "@tanstack/react-query";
import { groupQueryOptions } from "../../api/groups/groupQueries";
import { TGroup } from "../../types";

interface CreateGoalFormProps {
  onSuccess?: () => void;
}

interface SMARTGoalData {
  title: string;
  specific: string;
  measurable: string;
  attainable: string;
  relevant: string;
  timeBound: string;
  isPublic: boolean;
  weeklyTargetAmount: number;
  cycleDuration: number;
  startDate: string;
  endDate: string;
}

export const CreateGoalForm = ({ onSuccess }: CreateGoalFormProps) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [sharedToGroup, setSharedToGroup] = useState<TGroup[]>([]);
  
  // Calculate default dates
  const getDefaultDates = () => {
    const today = new Date();
    const startDate = today.toISOString().split('T')[0];
    const endDate = new Date(today.getTime() + (12 * 7 * 24 * 60 * 60 * 1000)); // 12 weeks later
    return { startDate, endDate: endDate.toISOString().split('T')[0] };
  };

  const { startDate: defaultStartDate, endDate: defaultEndDate } = getDefaultDates();

  const [goalData, setGoalData] = useState<SMARTGoalData>({
    title: "",
    specific: "",
    measurable: "",
    attainable: "",
    relevant: "",
    timeBound: "",
    isPublic: true,
    weeklyTargetAmount: 1,
    cycleDuration: 12,
    startDate: defaultStartDate,
    endDate: defaultEndDate,
  });

  const { data: groups = [] } = useSuspenseQuery(
    groupQueryOptions(user!.token!)
  );

  const smartSections = [
    {
      key: "specific" as keyof SMARTGoalData,
      label: "Specific",
      color: "bg-blue-100 border-blue-200 text-blue-800",
      placeholder: "What exactly do you want to accomplish?",
      description: "Be clear and specific about what you want to achieve."
    },
    {
      key: "measurable" as keyof SMARTGoalData,
      label: "Measurable",
      color: "bg-green-100 border-green-200 text-green-800",
      placeholder: "How will you measure progress?",
      description: "Define metrics to track your progress."
    },
    {
      key: "attainable" as keyof SMARTGoalData,
      label: "Attainable",
      color: "bg-yellow-100 border-yellow-200 text-yellow-800",
      placeholder: "How will you achieve this goal?",
      description: "Outline your action plan."
    },
    {
      key: "relevant" as keyof SMARTGoalData,
      label: "Relevant",
      color: "bg-purple-100 border-purple-200 text-purple-800",
      placeholder: "Why is this goal important to you?",
      description: "Connect this goal to your larger objectives."
    },
    {
      key: "timeBound" as keyof SMARTGoalData,
      label: "Time-bound",
      color: "bg-red-100 border-red-200 text-red-800",
      placeholder: "When will you complete this goal?",
      description: "Set a realistic deadline."
    }
  ];

  const handleChange = (field: keyof SMARTGoalData, value: string | boolean | number) => {
    setGoalData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Update end date when cycle duration or start date changes
      if (field === 'cycleDuration' || field === 'startDate') {
        const start = new Date(field === 'startDate' ? value as string : updated.startDate);
        const duration = field === 'cycleDuration' ? value as number : updated.cycleDuration;
        const end = new Date(start.getTime() + (duration * 7 * 24 * 60 * 60 * 1000));
        updated.endDate = end.toISOString().split('T')[0];
      }
      
      return updated;
    });
  };

  const resetFormInputs = () => {
    const { startDate, endDate } = getDefaultDates();
    setGoalData({
      title: "",
      specific: "",
      measurable: "",
      attainable: "",
      relevant: "",
      timeBound: "",
      isPublic: true,
      weeklyTargetAmount: 1,
      cycleDuration: 12,
      startDate,
      endDate,
    });
    setSharedToGroup([]);
    setIsLoading(false);
    setServerError("");
  };

  const handleSuccess = () => {
    resetFormInputs();
    onSuccess?.();
  };

  const handleError = (e: Error) => {
    setServerError(e.message);
    setIsLoading(false);
  };

  const mutation = useCreateGoalMutation(user!.token!, handleSuccess, handleError);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setServerError("");

    // Create a summary description from SMART fields
    const description = `Goal: ${goalData.title}\n\nThis is a SMART goal with structured objectives for tracking and achievement.`;

    const requestBody: GoalCreateBody = {
      title: goalData.title,
      description,
      isPrivate: !goalData.isPublic,
      weeklyTrackingTotal: goalData.weeklyTargetAmount,
      sharedToGroup: sharedToGroup.map((g) => g.id),
      // Send SMART fields as separate properties
      specific: goalData.specific,
      measurable: goalData.measurable,
      attainable: goalData.attainable,
      relevant: goalData.relevant,
      timeBound: goalData.timeBound,
      // Add goal cycle fields (these will need backend support)
      cycleDuration: goalData.cycleDuration,
      startDate: goalData.startDate,
      endDate: goalData.endDate,
    } as any; // TODO: Update GoalCreateBody type when backend is updated

    mutation.mutate(requestBody);
  };

  const handleGroupChange = (group: TGroup, checked: boolean) => {
    if (checked) {
      setSharedToGroup([...sharedToGroup, group]);
    } else {
      setSharedToGroup(sharedToGroup.filter((g) => g.id !== group.id));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {serverError && (
        <div className="bg-destructive/15 border border-destructive/20 text-destructive px-4 py-3 rounded-md">
          {serverError}
        </div>
      )}

      {/* Goal Title */}
      <div className="space-y-2">
        <Label htmlFor="title" className="text-base font-semibold">Goal Title</Label>
        <Input
          id="title"
          placeholder="Enter your goal title"
          value={goalData.title}
          onChange={(e) => handleChange("title", e.target.value)}
          required
        />
      </div>

      {/* Goal Duration and Dates */}
      <Card className="border-l-4 border-l-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Badge variant="secondary" className="bg-orange-100 border-orange-200 text-orange-800">
              <Clock className="h-3 w-3 mr-1" />
              Goal Cycle
            </Badge>
            <span className="text-sm text-muted-foreground">
              Set your goal duration and timeline
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cycleDuration" className="text-sm font-medium">
                Cycle Duration (weeks)
              </Label>
              <Input
                id="cycleDuration"
                type="number"
                min="1"
                max="52"
                value={goalData.cycleDuration}
                onChange={(e) => handleChange("cycleDuration", parseInt(e.target.value) || 1)}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Typically 12 weeks
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="startDate" className="text-sm font-medium">
                <Calendar className="h-3 w-3 inline mr-1" />
                Start Date
              </Label>
              <Input
                id="startDate"
                type="date"
                value={goalData.startDate}
                onChange={(e) => handleChange("startDate", e.target.value)}
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="endDate" className="text-sm font-medium">
                <Calendar className="h-3 w-3 inline mr-1" />
                End Date
              </Label>
              <Input
                id="endDate"
                type="date"
                value={goalData.endDate}
                disabled
                className="w-full bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                Auto-calculated
              </p>
            </div>
          </div>
          
          <div className="bg-muted/50 rounded-lg p-3 text-sm">
            <p className="text-muted-foreground">
              Your goal will run for <span className="font-semibold text-foreground">{goalData.cycleDuration} weeks</span>, 
              from {new Date(goalData.startDate).toLocaleDateString()} to {new Date(goalData.endDate).toLocaleDateString()}.
              Progress will be tracked weekly from Week 1 to Week {goalData.cycleDuration}.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* SMART Goal Sections */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">SMART Goal Framework</h3>
        </div>
        
        {smartSections.map((section) => (
          <Card key={section.key} className="border-l-4 border-l-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Badge variant="secondary" className={section.color}>
                  {section.label}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {section.description}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Textarea
                  placeholder={section.placeholder}
                  value={goalData[section.key] as string}
                  onChange={(e) => handleChange(section.key, e.target.value)}
                  className="min-h-[80px] resize-none"
                  required
                />
                
                {/* Add target amount input for measurable section */}
                {section.key === "measurable" && (
                  <div className="space-y-2">
                    <Label htmlFor="weeklyTargetAmount" className="text-sm font-medium">
                      Weekly Target Amount
                    </Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="weeklyTargetAmount"
                        type="number"
                        min="1"
                        step="1"
                        value={goalData.weeklyTargetAmount}
                        onChange={(e) => handleChange("weeklyTargetAmount", parseInt(e.target.value) || 1)}
                        className="w-24"
                        required
                      />
                      <span className="text-sm text-muted-foreground">
                        {goalData.weeklyTargetAmount === 1 ? "goal completion per week" : "units per week"}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Set to 1 for simple yes/no goals, or higher numbers for measurable progress (e.g., 5 workouts, 10 pages read)
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Visibility Toggle */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {goalData.isPublic ? (
                <Globe className="h-5 w-5 text-primary" />
              ) : (
                <Lock className="h-5 w-5 text-muted-foreground" />
              )}
              <div>
                <Label className="text-base font-medium">
                  {goalData.isPublic ? "Public Goal" : "Private Goal"}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {goalData.isPublic 
                    ? "Others can see and support this goal" 
                    : "Only you can see this goal"
                  }
                </p>
              </div>
            </div>
            <Switch
              checked={goalData.isPublic}
              onCheckedChange={(checked) => handleChange("isPublic", checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Group Sharing */}
      {groups.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Share with Groups
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {groups.map((group: TGroup) => (
              <div key={group.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`group-${group.id}`}
                  checked={sharedToGroup.some((g) => g.id === group.id)}
                  onCheckedChange={(checked) => handleGroupChange(group, !!checked)}
                />
                <Label
                  htmlFor={`group-${group.id}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {group.name}
                </Label>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Submit Buttons */}
      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="outline" 
          onClick={() => {
            resetFormInputs();
            onSuccess?.();
          }}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="min-w-[120px]"
        >
          {isLoading ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
              Creating...
            </>
          ) : (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Create Goal
            </>
          )}
        </Button>
      </div>
    </form>
  );
};