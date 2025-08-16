import { useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  Plus,
  Crown,
  Calendar,
  User,
  UserPlus,
  Eye,
} from "lucide-react";

import { groupQueryOptions } from "../api/groups/groupQueries";
import { useAuth } from "../providers/auth.provider";
import { TGroup } from "../types";
import { useState } from "react";
import { Modal } from "./component-parts/modal";
import { AddMemberModal } from "./AddMemberModal";
import { addMemberToGroup } from "../api/groups/groups";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";

interface GroupsProps {
  onCreateGroup?: () => void;
}

export function Groups({ onCreateGroup }: GroupsProps = {}) {
  const { user, handleAuthError } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { data: groups = [] } = useSuspenseQuery(
    groupQueryOptions(user!.token!)
  );

  const [selectedGroup, setSelectedGroup] = useState<TGroup | null>(null);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);

  const adminUser = (group: TGroup) =>
    group.users.find(
      (groupUser: { role: string }) => groupUser.role === "ADMIN"
    )!.user;

  const ownedGroups = groups.filter(
    (group: TGroup) => adminUser(group).username === user?.userInfo!.username
  );

  const memberGroups = groups.filter(
    (group: TGroup) => adminUser(group).username !== user?.userInfo!.username
  );

  const handleManageGroup = (group: TGroup) => {
    setSelectedGroup(group);
    setIsAddMemberModalOpen(true);
  };

  const handleAddMember = async (identifier: string, role: string) => {
    if (!selectedGroup) return;

    try {
      await addMemberToGroup(user!.token!, selectedGroup.id, identifier, role);
      toast.success(`Member added successfully!`);
      // Refresh the groups data
      queryClient.invalidateQueries({ queryKey: ["groups", user!.token!] });
    } catch (error) {
      console.error("Failed to add member:", error);
      handleAuthError(error);
      toast.error(
        "Failed to add member. Please check the email/username and try again."
      );
      throw error; // Re-throw so the modal can handle it
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-subheaders tracking-wide">My Groups</h2>
          <p className="text-muted-foreground">
            Collaborate and share goals with your groups
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => navigate({ to: "/dashboard/groups" })}
          >
            <Eye className="h-4 w-4 mr-2" />
            Groups Overview
          </Button>
          <Button
            onClick={onCreateGroup}
            className="bg-gradient-to-r from-secondary to-secondary/90 hover:from-secondary/90 hover:to-secondary shadow-lg hover:shadow-secondary/25"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Group
          </Button>
        </div>
      </div>

      {groups.length === 0 ? (
        <Card className="card-gradient-empty">
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-secondary/20 to-primary/20 flex items-center justify-center">
                <Users className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-lg font-subheaders mb-2">No groups yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first group to start collaborating with others
              </p>
              <Button
                onClick={onCreateGroup}
                className="bg-gradient-to-r from-secondary to-primary hover:from-secondary/90 hover:to-primary/90 shadow-lg hover:shadow-secondary/25"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Group
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Owned Groups */}
          {ownedGroups.length > 0 && (
            <div>
              <h3 className="text-lg font-subheaders mb-4 flex items-center gap-2">
                <Crown className="h-5 w-5 text-primary" />
                Groups You Own ({ownedGroups.length})
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                {ownedGroups.map((group: TGroup) => (
                  <Card
                    key={group.id}
                    className="card-gradient hover:border-primary/20"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-lg leading-tight">
                            {group.name}
                          </CardTitle>
                          <CardDescription className="line-clamp-2">
                            {group.description}
                          </CardDescription>
                        </div>
                        <Badge className="bg-primary text-primary-foreground">
                          <Crown className="h-3 w-3 mr-1" />
                          Owner
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <span>
                            {group.users.length} member
                            {group.users.length !== 1 ? "s" : ""}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {group.sharedGoals.length} shared goal
                            {group.sharedGoals.length !== 1 ? "s" : ""}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            navigate({
                              to: "/dashboard/groups/$groupId",
                              params: { groupId: group.id },
                            })
                          }
                          className="flex-1 border-primary/30 hover:border-primary hover:bg-primary/10 transition-all duration-300"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleManageGroup(group)}
                          className="border-primary/30 hover:border-primary hover:bg-primary/10 transition-all duration-300"
                        >
                          <UserPlus className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Member Groups */}
          {memberGroups.length > 0 && (
            <div>
              <h3 className="text-lg font-subheaders mb-4 flex items-center gap-2">
                <User className="h-5 w-5 text-secondary" />
                Groups You're In ({memberGroups.length})
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                {memberGroups.map((group: TGroup) => (
                  <Card
                    key={group.id}
                    className="card-gradient hover:border-secondary/20"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-lg leading-tight">
                            {group.name}
                          </CardTitle>
                          <CardDescription className="line-clamp-2">
                            {group.description}
                          </CardDescription>
                        </div>
                        <Badge variant="secondary">
                          <User className="h-3 w-3 mr-1" />
                          Member
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <span>
                            {group.users.length} member
                            {group.users.length !== 1 ? "s" : ""}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {group.sharedGoals.length} shared goal
                            {group.sharedGoals.length !== 1 ? "s" : ""}
                          </span>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Owned by {adminUser(group).username}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          navigate({
                            to: "/dashboard/groups/$groupId",
                            params: { groupId: group.id },
                          })
                        }
                        className="w-full border-secondary/30 hover:border-secondary hover:bg-secondary/10 transition-all duration-300"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Group
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add Member Modal */}
      <Modal
        isOpen={isAddMemberModalOpen}
        onClose={() => {
          setIsAddMemberModalOpen(false);
          setSelectedGroup(null);
        }}
        title=""
        size="lg"
      >
        {selectedGroup && (
          <AddMemberModal
            group={selectedGroup}
            onClose={() => {
              setIsAddMemberModalOpen(false);
              setSelectedGroup(null);
            }}
            onAddMember={handleAddMember}
          />
        )}
      </Modal>
    </div>
  );
}
