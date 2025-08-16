import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserPlus, X, Mail, User, Trash2 } from "lucide-react";
import { TGroup } from "../types";

interface AddMemberModalProps {
  group: TGroup;
  onClose: () => void;
  onAddMember: (identifier: string, role: string) => Promise<void>;
}

export function AddMemberModal({
  group,
  onClose,
  onAddMember,
}: AddMemberModalProps) {
  const [identifier, setIdentifier] = useState("");
  const [role, setRole] = useState("MEMBER");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingMembers, setPendingMembers] = useState<
    Array<{ id: string; identifier: string; role: string }>
  >([]);

  const isEmail = (str: string) => {
    return str.includes("@") && str.includes(".");
  };

  const addToPending = () => {
    if (!identifier.trim()) return;

    const newMember = {
      id: Date.now().toString(),
      identifier: identifier.trim(),
      role,
    };

    setPendingMembers([...pendingMembers, newMember]);
    setIdentifier("");
  };

  const removePending = (id: string) => {
    setPendingMembers(pendingMembers.filter((member) => member.id !== id));
  };

  const handleSubmit = async () => {
    if (pendingMembers.length === 0) return;

    setIsSubmitting(true);
    try {
      // Add each pending member
      for (const member of pendingMembers) {
        await onAddMember(member.identifier, member.role);
        // Notifications are now handled by the backend when users are added
      }
      onClose();
    } catch (error) {
      console.error("Failed to add members:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center">
              <UserPlus className="h-4 w-4 text-secondary" />
            </div>
            Add Members to {group.name}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Current Members */}
        <div>
          <h4 className="text-sm font-subheaders mb-2">
            Current Members ({group.users.length})
          </h4>
          <div className="flex flex-wrap gap-2">
            {group.users.map((groupUser) => (
              <Badge
                key={groupUser.id}
                variant="outline"
                className="flex items-center gap-1"
              >
                <User className="h-3 w-3" />
                {groupUser.user.username}
                {groupUser.role === "ADMIN" && (
                  <span className="text-xs text-primary">(Owner)</span>
                )}
              </Badge>
            ))}
          </div>
        </div>

        {/* Add New Member Form */}
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <Label htmlFor="identifier">Email or Username</Label>
              <div className="relative">
                <Input
                  id="identifier"
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="user@example.com or username"
                  className="pl-8"
                  onKeyDown={(e) => e.key === "Enter" && addToPending()}
                />
                <div className="absolute left-2 top-1/2 -translate-y-1/2">
                  {isEmail(identifier) ? (
                    <Mail className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <User className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="role">Role</Label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full h-10 px-3 border border-input bg-background rounded-md text-sm"
              >
                <option value="MEMBER">Member</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
          </div>

          <Button
            onClick={addToPending}
            variant="outline"
            size="sm"
            disabled={!identifier.trim()}
            className="w-full"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add to List
          </Button>
        </div>

        {/* Pending Members */}
        {pendingMembers.length > 0 && (
          <div>
            <h4 className="text-sm font-subheaders mb-2">
              Members to Add ({pendingMembers.length})
            </h4>
            <div className="space-y-2">
              {pendingMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-3 border border-border rounded-lg bg-card"
                >
                  <div className="flex items-center gap-2">
                    {isEmail(member.identifier) ? (
                      <Mail className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <User className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="font-medium">{member.identifier}</span>
                    <Badge variant="secondary" className="text-xs">
                      {member.role}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removePending(member.id)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={pendingMembers.length === 0 || isSubmitting}
            className="flex-1 bg-secondary hover:bg-secondary/90"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
            ) : (
              <UserPlus className="h-4 w-4 mr-2" />
            )}
            Add {pendingMembers.length} Member
            {pendingMembers.length !== 1 ? "s" : ""}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
