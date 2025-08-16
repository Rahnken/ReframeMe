import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  useUpdateUserInfoMutation,
  useUpdateEmailMutation,
  useUpdateUsernameMutation,
  useUpdatePasswordMutation,
  userInfoQueryOptions,
} from "../../../api/users/userQueryOptions";
import moment from "moment-timezone";
import Select from "react-tailwindcss-select";
import { TUpdateUserInfo } from "../../../api/users/userInfo";
import { TUserInfo } from "../../../types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Lock, Shield, ChevronLeft } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";

export const Route = createFileRoute("/_auth/profile/edit")({
  loader: ({ context: { auth, queryClient } }) => {
    queryClient.ensureQueryData(userInfoQueryOptions(auth.user!.token!));
  },

  component: EditProfile,
});

function EditProfile() {
  const timezones = moment.tz.names();
  const mappedTimezones = timezones.map((timezone) => ({
    value: timezone,
    label: timezone,
  }));

  const { auth, queryClient } = Route.useRouteContext();
  const profile: TUserInfo = queryClient.getQueryData([
    "userInfo",
    auth.user!.token,
  ])!;

  type ThemeOption = { label: string; value: string };
  type TimezoneOption = { label: string; value: string };
  const themeOptions: ThemeOption[] = [
    { label: "Modern Dark", value: "modernDark" },
    { label: "Modern Light", value: "modernLight" },
    { label: "Glass Light", value: "glassLight" },
    { label: "Sunset", value: "sunset" },
  ];
  const navigate = useNavigate();

  const getTimezoneFromProfile = (profile: TUserInfo) => {
    const timezone = mappedTimezones.find(
      (tz) => tz.value === profile.timezone
    );
    return timezone || null;
  };
  const [firstNameInput, setFirstNameInput] = useState(profile.firstName || "");
  const [lastNameInput, setLastNameInput] = useState(profile.lastName || "");
  const [timezoneInput, setTimezoneInput] = useState<null | TimezoneOption>(
    getTimezoneFromProfile(profile)
  );
  const [countryInput, setCountryInput] = useState(profile.country || "");
  const [themeInput, setThemeInput] = useState<null | ThemeOption>(
    themeOptions.find(
      (option) => option.value === profile.userSettings.theme
    ) || null
  );

  // Account settings
  const [emailInput, setEmailInput] = useState(
    auth.user?.userInfo?.email || ""
  );
  const [usernameInput, setUsernameInput] = useState(
    auth.user?.userInfo?.username || ""
  );
  const [emailPassword, setEmailPassword] = useState("");
  const [usernamePassword, setUsernamePassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const profileMutation = useUpdateUserInfoMutation(
    auth.user!.token!,
    () => {
      toast.success("Profile updated successfully!");
      navigate({ to: "/profile" });
    },
    (e) => {
      console.error("Mutation error:", e.message);
      toast.error("Failed to update profile. Please try again.");
    }
  );

  const emailMutation = useUpdateEmailMutation(
    auth.user!.token!,
    () => {
      toast.success(
        "Email updated successfully! Please log in again with your new email."
      );
      setEmailPassword("");
      // Force re-login since the auth token contains old email
      setTimeout(() => {
        auth.logout();
      }, 2000);
    },
    (e) => {
      console.error("Email update error:", e.message);
      toast.error(`Failed to update email: ${e.message}`);
    }
  );

  const usernameMutation = useUpdateUsernameMutation(
    auth.user!.token!,
    () => {
      toast.success(
        "Username updated successfully! Please log in again with your new username."
      );
      setUsernamePassword("");
      // Force re-login since the auth token contains old username
      setTimeout(() => {
        auth.logout();
      }, 2000);
    },
    (e) => {
      console.error("Username update error:", e.message);
      toast.error(`Failed to update username: ${e.message}`);
    }
  );

  const passwordMutation = useUpdatePasswordMutation(
    auth.user!.token!,
    () => {
      toast.success("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    },
    (e) => {
      console.error("Password update error:", e.message);
      toast.error(`Failed to update password: ${e.message}`);
    }
  );

  const handleProfileSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!timezoneInput || !themeInput) {
      toast.error("Please fill out all required fields");
      return;
    }

    const updatedProfile: TUpdateUserInfo = {
      firstName: firstNameInput,
      lastName: lastNameInput,
      timezone: timezoneInput.value,
      country: countryInput,
      userSettings: {
        userSetting_id: profile.userSettings.userSetting_id,
        theme: themeInput.value,
        profileComplete: true,
      },
    };
    profileMutation.mutate(updatedProfile);
    queryClient.invalidateQueries(userInfoQueryOptions(auth.user!.token!));
  };

  const handleEmailSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!emailInput || !emailPassword) {
      toast.error("Please fill out all fields");
      return;
    }
    if (emailInput === auth.user?.userInfo?.email) {
      toast.error("New email must be different from current email");
      return;
    }

    emailMutation.mutate({
      newEmail: emailInput,
      currentPassword: emailPassword,
    });
  };

  const handleUsernameSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!usernameInput || !usernamePassword) {
      toast.error("Please fill out all fields");
      return;
    }
    if (usernameInput === auth.user?.userInfo?.username) {
      toast.error("New username must be different from current username");
      return;
    }

    usernameMutation.mutate({
      newUsername: usernameInput,
      currentPassword: usernamePassword,
    });
  };

  const handlePasswordSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill out all fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }
    if (currentPassword === newPassword) {
      toast.error("New password must be different from current password");
      return;
    }

    passwordMutation.mutate({
      currentPassword,
      newPassword,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-background to-green-50">
      <div className="container mx-auto p-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/profile" className="hover:text-primary">
            <ChevronLeft className="h-6 w-6" />
          </Link>
          <div>
            <h1 className="text-3xl font-headers tracking-wide">
              Edit Profile
            </h1>
            <p className="text-muted-foreground mt-1">
              Update your personal information and account settings
            </p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Personal Information */}
          <Card className="card-gradient">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="h-4 w-4 text-primary" />
                </div>
                Personal Information
              </CardTitle>
              <CardDescription>
                Update your personal details and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={firstNameInput}
                      onChange={(e) => setFirstNameInput(e.target.value)}
                      placeholder="First Name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={lastNameInput}
                      onChange={(e) => setLastNameInput(e.target.value)}
                      placeholder="Last Name"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={countryInput}
                    onChange={(e) => setCountryInput(e.target.value)}
                    placeholder="Country"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Timezone</Label>
                  <Select
                    primaryColor="orange"
                    options={mappedTimezones}
                    value={timezoneInput}
                    isSearchable={true}
                    onChange={(v) =>
                      setTimezoneInput(v ? (v as TimezoneOption) : null)
                    }
                    classNames={{
                      menuButton: () =>
                        "flex text-sm border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md",
                      menu: "absolute z-10 w-full bg-popover border border-border shadow-lg rounded-md py-1 mt-1",
                      listItem: (props) =>
                        `block px-3 py-2 cursor-pointer text-sm ${props?.isSelected ? "bg-accent text-accent-foreground" : "hover:bg-accent/50"}`,
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Theme</Label>
                  <Select
                    value={themeInput}
                    options={themeOptions}
                    onChange={(value) =>
                      setThemeInput(value ? (value as ThemeOption) : null)
                    }
                    primaryColor="orange"
                    classNames={{
                      menuButton: () =>
                        "flex text-sm border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md",
                      menu: "absolute z-10 w-full bg-popover border border-border shadow-lg rounded-md py-1 mt-1",
                      listItem: (props) =>
                        `block px-3 py-2 cursor-pointer text-sm ${props?.isSelected ? "bg-accent text-accent-foreground" : "hover:bg-accent/50"}`,
                    }}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={profileMutation.isPending}
                >
                  {profileMutation.isPending ? "Saving..." : "Save Profile"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-8">
            {/* Email Settings */}
            <Card className="card-gradient">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <Mail className="h-4 w-4 text-blue-600" />
                  </div>
                  Email Address
                </CardTitle>
                <CardDescription>Update your email address</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">New Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="your@email.com"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emailPassword">Current Password</Label>
                    <Input
                      id="emailPassword"
                      type="password"
                      value={emailPassword}
                      onChange={(e) => setEmailPassword(e.target.value)}
                      placeholder="Enter your current password"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={emailMutation.isPending}
                  >
                    {emailMutation.isPending ? "Updating..." : "Update Email"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Username Settings */}
            <Card className="card-gradient">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                    <User className="h-4 w-4 text-green-600" />
                  </div>
                  Username
                </CardTitle>
                <CardDescription>Update your username</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUsernameSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">New Username</Label>
                    <Input
                      id="username"
                      value={usernameInput}
                      onChange={(e) => setUsernameInput(e.target.value)}
                      placeholder="username"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="usernamePassword">Current Password</Label>
                    <Input
                      id="usernamePassword"
                      type="password"
                      value={usernamePassword}
                      onChange={(e) => setUsernamePassword(e.target.value)}
                      placeholder="Enter your current password"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={usernameMutation.isPending}
                  >
                    {usernameMutation.isPending
                      ? "Updating..."
                      : "Update Username"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Password Settings */}
            <Card className="card-gradient">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                    <Lock className="h-4 w-4 text-red-600" />
                  </div>
                  Password & Security
                </CardTitle>
                <CardDescription>
                  Change your password and security settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password (min 8 characters)"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">
                      Confirm New Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={passwordMutation.isPending}
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    {passwordMutation.isPending
                      ? "Updating..."
                      : "Update Password"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
