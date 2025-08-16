import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Target, Users, BarChart3, Plus } from "lucide-react";
import { useModal } from "../utils/useModal";
import { Modal } from "./component-parts/modal";
import { GoalForm } from "./forms/GoalForm";
import { CreateGroupForm } from "./forms/CreateGroupForm";
import { WeeklyGoals } from "./WeeklyGoals";
import { MonthlyProgress } from "./MonthlyProgress";
import { Groups } from "./Groups";

export function DashboardContent() {
  const [activeTab, setActiveTab] = useState("goals");
  const createGoalModal = useModal();
  const createGroupModal = useModal();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 max-w-6xl">
        <div className="space-y-6">
          {/* Header */}
          <div className="relative overflow-hidden rounded-2xl bg-card border border-border p-8 shadow-sm">
            <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
              <div>
                <h1 className="text-4xl font-bold tracking-wide text-primary font-headers ">
                  Dashboard
                </h1>
                <p className="text-muted-foreground mt-2">
                  Track your goals and monitor your progress with ReframeMe
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={createGroupModal.open}
                  variant="outline"
                  size="sm"
                  className="border-secondary/30 hover:border-secondary hover:bg-secondary/10 transition-all duration-300"
                >
                  <Users className="h-4 w-4 mr-2" />
                  New Group
                </Button>
                <Button
                  onClick={createGoalModal.open}
                  size="sm"
                  className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-primary/25 transition-all duration-300"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Goal
                </Button>
              </div>
            </div>
            {/* Subtle accent - pointer-events-none so it doesn't block buttons */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-2xl pointer-events-none"></div>
          </div>

          {/* Main Content */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsList className="grid w-full grid-cols-3 bg-muted p-1 h-12">
              <TabsTrigger
                value="goals"
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/90 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
              >
                <Target className="h-4 w-4" />
                Weekly Goals
              </TabsTrigger>
              <TabsTrigger
                value="progress"
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-secondary data-[state=active]:to-secondary/90 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
              >
                <BarChart3 className="h-4 w-4" />
                Progress
              </TabsTrigger>
              <TabsTrigger
                value="groups"
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
              >
                <Users className="h-4 w-4" />
                Groups
              </TabsTrigger>
            </TabsList>

            <TabsContent value="goals" className="space-y-6">
              <WeeklyGoals onCreateGoal={createGoalModal.open} />
            </TabsContent>

            <TabsContent value="progress" className="space-y-6">
              <MonthlyProgress />
            </TabsContent>

            <TabsContent value="groups" className="space-y-6">
              <Groups onCreateGroup={createGroupModal.open} />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Modals */}
      <Modal
        isOpen={createGoalModal.isOpen}
        onClose={createGoalModal.close}
        title="Create New SMART Goal"
        size="lg"
      >
        <GoalForm onSuccess={createGoalModal.close} />
      </Modal>

      <Modal
        isOpen={createGroupModal.isOpen}
        onClose={createGroupModal.close}
        title="Create New Group"
        size="md"
      >
        <CreateGroupForm onSuccess={createGroupModal.close} />
      </Modal>
    </div>
  );
}
