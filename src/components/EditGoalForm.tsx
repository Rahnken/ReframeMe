import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Globe, Lock, Target, Save, X } from "lucide-react";
import { TGoal } from "../types";
import { toast } from "sonner";

interface EditGoalFormProps {
  goal: TGoal;
  onClose: () => void;
  onSave: (goalData: any) => void;
}

export function EditGoalForm({ goal, onClose, onSave }: EditGoalFormProps) {
  const [goalData, setGoalData] = useState({
    title: goal.title,
    description: goal.description,
    specific: goal.specific || "",
    measurable: goal.measurable || "",
    attainable: goal.attainable || "",
    relevant: goal.relevant || "",
    timeBound: goal.timeBound || "",
    isPrivate: goal.isPrivate,
    weeklyTargetAmount: goal.goalWeeks[0]?.targetAmount || 1,
  });

  const smartSections = [
    {
      key: "specific" as keyof typeof goalData,
      label: "Specific",
      color: "bg-blue-100 border-blue-200 text-blue-800",
      placeholder: "What exactly do you want to accomplish?",
      description: "Be clear and specific about what you want to achieve."
    },
    {
      key: "measurable" as keyof typeof goalData,
      label: "Measurable",
      color: "bg-green-100 border-green-200 text-green-800",
      placeholder: "How will you measure progress?",
      description: "Define metrics to track your progress."
    },
    {
      key: "attainable" as keyof typeof goalData,
      label: "Attainable",
      color: "bg-yellow-100 border-yellow-200 text-yellow-800",
      placeholder: "How will you achieve this goal?",
      description: "Outline your action plan."
    },
    {
      key: "relevant" as keyof typeof goalData,
      label: "Relevant",
      color: "bg-purple-100 border-purple-200 text-purple-800",
      placeholder: "Why is this goal important to you?",
      description: "Connect this goal to your larger objectives."
    },
    {
      key: "timeBound" as keyof typeof goalData,
      label: "Time-bound",
      color: "bg-red-100 border-red-200 text-red-800",
      placeholder: "When will you complete this goal?",
      description: "Set a realistic deadline."
    }
  ];

  const handleChange = (field: keyof typeof goalData, value: string | boolean | number) => {
    setGoalData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    const updateData = {
      id: goal.id,
      title: goalData.title,
      description: goalData.description,
      isPrivate: goalData.isPrivate,
      weeklyTrackingTotal: goalData.weeklyTargetAmount,
      specific: goalData.specific,
      measurable: goalData.measurable,
      attainable: goalData.attainable,
      relevant: goalData.relevant,
      timeBound: goalData.timeBound,
    };
    
    onSave(updateData);
    toast.success("Goal updated successfully!");
    onClose();
  };

  return (
    <div className="max-h-[80vh] overflow-y-auto space-y-6">
      {/* Goal Header */}
      <div className="sticky top-0 bg-background z-10 pb-4">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold">Edit Goal</h2>
            <p className="text-muted-foreground mt-1">Update your goal details and settings</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Basic Goal Info */}
      <div className="space-y-4">
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

        <div className="space-y-2">
          <Label htmlFor="description" className="text-base font-semibold">Description</Label>
          <Textarea
            id="description"
            placeholder="Brief description of your goal"
            value={goalData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            className="min-h-[80px] resize-none"
          />
        </div>
      </div>

      {/* SMART Goal Sections - Condensed */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Target className="h-5 w-5" />
          SMART Goal Framework
        </h3>
        <div className="space-y-3">
          {smartSections.map((section) => (
            <Card key={section.key} className="card-gradient">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={section.color}>
                      {section.label}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {section.description}
                    </span>
                  </div>
                  <Textarea
                    placeholder={section.placeholder}
                    value={goalData[section.key] as string}
                    onChange={(e) => handleChange(section.key, e.target.value)}
                    className="min-h-[60px] resize-none text-sm"
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
                          className="w-20 text-sm"
                          required
                        />
                        <span className="text-xs text-muted-foreground">
                          {goalData.weeklyTargetAmount === 1 ? "goal completion per week" : "units per week"}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Visibility Toggle */}
      <Card className="card-gradient-empty">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {!goalData.isPrivate ? (
                <Globe className="h-5 w-5 text-primary" />
              ) : (
                <Lock className="h-5 w-5 text-muted-foreground" />
              )}
              <div>
                <Label className="text-base font-medium">
                  {!goalData.isPrivate ? "Public Goal" : "Private Goal"}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {!goalData.isPrivate 
                    ? "Others can see and support this goal" 
                    : "Only you can see this goal"
                  }
                </p>
              </div>
            </div>
            <Switch
              checked={!goalData.isPrivate}
              onCheckedChange={(checked) => handleChange("isPrivate", !checked)}
            />
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
          Save Changes
        </Button>
      </div>
    </div>
  );
}