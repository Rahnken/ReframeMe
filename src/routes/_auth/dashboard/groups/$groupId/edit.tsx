import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useAuth } from "../../../../../providers/auth.provider";
import { goalQueryIdOptions } from "../../../../../api/goals/goalQueries";
import {
  groupQueryIdOptions,
  useDeleteGroupMemberMutation,
  useDeleteGroupMutation,
  useUpdateGroupMutation,
} from "../../../../../api/groups/groupQueries";
import { TGroup, TGroupUser } from "../../../../../types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  ChevronLeft,
  Trash2,
  UserMinus,
  Crown,
  User,
  Settings,
} from "lucide-react";
import { getAvatarProps } from "../../../../../utils/avatarUtils";
import { toast } from "sonner";

export const Route = createFileRoute("/_auth/dashboard/groups/$groupId/edit")({
  loader: ({ context: { auth, queryClient }, params: { groupId } }) => {
    queryClient.ensureQueryData(
      groupQueryIdOptions(auth.user!.token!, groupId)
    );
    queryClient.ensureQueryData(goalQueryIdOptions(auth.user!.token!, groupId));
  },
  component: EditGroup,
});

function EditGroup() {
  const { user } = useAuth();
  const { groupId } = Route.useParams();
  const group: TGroup = useSuspenseQuery(
    groupQueryIdOptions(user!.token!, groupId)
  ).data;

  const [serverError, setServerError] = useState("");
  const [groupNameInput, setGroupNameInput] = useState(group.name);
  const [groupDescriptionInput, setGroupDescriptionInput] = useState(
    group.description
  );

  const resetFormInputs = () => {};
  const onDeleteSuccess = () => {
    resetFormInputs();
    toast.success("Group deleted successfully");
    navigate({ to: "/dashboard/groups" });
  };

  const onUpdateSuccess = () => {
    toast.success("Group updated successfully");
  };

  const onMemberSuccess = () => {
    toast.success("Member updated successfully");
  };

  const onError = (e: Error) => {
    setServerError(e.message);
    toast.error(`Error: ${e.message}`);
  };
  const navigate = useNavigate({ from: Route.fullPath });
  const deleteMutation = useDeleteGroupMutation(
    user!.token!,
    groupId,
    onDeleteSuccess,
    onError
  );
  const memberMutation = useUpdateGroupMutation(
    user!.token!,
    groupId,
    onMemberSuccess,
    onError
  );
  const removeMemberMutation = useDeleteGroupMemberMutation(
    user!.token!,
    groupId,
    onMemberSuccess,
    onError
  );
  const updateGroupMutation = useUpdateGroupMutation(
    user!.token!,
    groupId,
    onUpdateSuccess,
    onError
  );

  const handleDeleteGroup = () => {
    deleteMutation.mutate();
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateGroupMutation.mutate({
      name: groupNameInput,
      description: groupDescriptionInput,
    });
  };

  const updateMemberRole = (userId: string, role: "ADMIN" | "MEMBER") => {
    memberMutation.mutate({ user_id: userId, role });
  };
  const removeMemberFromGroup = (userId: string) => {
    removeMemberMutation.mutate(userId);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/dashboard/groups/$groupId"
            params={{ groupId }}
            className="hover:text-primary"
          >
            <ChevronLeft className="h-6 w-6" />
          </Link>
          <div>
            <h1 className="text-3xl font-headers tracking-wide">Edit Group</h1>
            <p className="text-muted-foreground mt-1">
              Manage group settings and members
            </p>
          </div>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Group
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Group</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                group and remove all shared goals and member associations.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteGroup}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete Group
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {serverError && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">{serverError}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Group Settings */}
        <Card className="card-gradient">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Group Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="groupName">Group Name</Label>
                <Input
                  id="groupName"
                  name="groupNameInput"
                  placeholder="Enter group name"
                  value={groupNameInput}
                  onChange={(e) => setGroupNameInput(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="groupDescription">Group Description</Label>
                <Textarea
                  id="groupDescription"
                  placeholder="Enter group description"
                  value={groupDescriptionInput}
                  onChange={(e) => setGroupDescriptionInput(e.target.value)}
                  required
                  rows={4}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={updateGroupMutation.isPending}
              >
                {updateGroupMutation.isPending ? "Updating..." : "Update Group"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Group Members */}
        <Card className="card-gradient">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Group Members ({group.users.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {group.users.map((member: TGroupUser) => {
              const avatarProps = getAvatarProps(
                undefined,
                undefined,
                member.user.username,
                "md"
              );

              return (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-3 border border-border/20 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className={avatarProps.className}>
                      <AvatarFallback className={avatarProps.fallbackClassName}>
                        {avatarProps.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-subheaders">
                        {member.user.username}
                      </h4>
                      <Badge
                        variant={
                          member.role === "ADMIN" ? "default" : "secondary"
                        }
                        className="text-xs"
                      >
                        {member.role === "ADMIN" && (
                          <Crown className="h-3 w-3 mr-1" />
                        )}
                        {member.role}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          {member.role === "MEMBER"
                            ? "Make Admin"
                            : "Make Member"}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Change Member Role
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to change{" "}
                            {member.user.username}'s role to{" "}
                            {member.role === "MEMBER" ? "ADMIN" : "MEMBER"}?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() =>
                              updateMemberRole(
                                member.id,
                                member.role === "MEMBER" ? "ADMIN" : "MEMBER"
                              )
                            }
                          >
                            Change Role
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          <UserMinus className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remove Member</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to remove{" "}
                            {member.user.username} from this group? This will
                            also remove their shared goals from the group.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => removeMemberFromGroup(member.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Remove Member
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
