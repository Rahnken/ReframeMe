import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { TextInput } from "../../../components/component-parts/TextInput";
import { useState } from "react";
import {
  useUpdateUserInfoMutation,
  userInfoQueryOptions,
} from "../../../api/users/userQueryOptions";
import moment from "moment-timezone";
import Select from "react-tailwindcss-select";
import { TUpdateUserInfo } from "../../../api/users/userInfo";
import { TUserInfo } from "../../../types";

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

  const mutation = useUpdateUserInfoMutation(
    auth.user!.token!,
    () => {
      navigate({ to: "/profile" });
    },
    (e) => console.error("Mutation error:", e.message)
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!timezoneInput || !themeInput)
      return alert("Please fill out all fields");
    else {
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
      mutation.mutate(updatedProfile);

      queryClient.invalidateQueries(userInfoQueryOptions(auth.user!.token!));
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Edit Profile</h1>
          <p className="text-muted-foreground mt-2">
            Update your personal information and preferences
          </p>
        </div>

        <form
          className="bg-card border border-border rounded-2xl p-8 shadow-sm space-y-6"
          onSubmit={handleSubmit}
        >
          <TextInput
            labelText="First Name"
            inputAttr={{
              name: "firstName",
              type: "text",
              value: firstNameInput,
              onChange: (e) => setFirstNameInput(e.target.value),
              required: true,
              placeholder: "First Name",
            }}
          />
          <TextInput
            labelText="Last Name"
            inputAttr={{
              name: "lastName",
              type: "text",
              value: lastNameInput,
              onChange: (e) => setLastNameInput(e.target.value),
              required: true,
              placeholder: "Last Name",
            }}
          />
          <TextInput
            labelText="Country"
            inputAttr={{
              name: "country",
              type: "text",
              value: countryInput,
              onChange: (e) => setCountryInput(e.target.value),
              required: true,
              placeholder: "Country",
            }}
          />

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Timezone
            </label>
            <Select
              primaryColor="orange"
              options={mappedTimezones}
              value={timezoneInput}
              isSearchable={true}
              isDisabled={false}
              onChange={(v) =>
                setTimezoneInput(v ? (v as TimezoneOption) : null)
              }
              classNames={{
                searchBox:
                  "w-full p-3 bg-background border border-border text-foreground rounded-lg shadow-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
                searchIcon: "hidden",
                menuButton: (props) =>
                  `flex text-sm text-foreground rounded-lg border border-border shadow-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${
                    props && props.isDisabled
                      ? "bg-muted cursor-not-allowed"
                      : "bg-background hover:bg-muted/50"
                  }`,
                menu: "absolute z-10 w-full bg-card border border-border shadow-lg rounded-lg py-1 mt-1.5 text-sm text-card-foreground",
                listItem: (props) =>
                  `block transition duration-200 px-3 py-2 cursor-pointer select-none truncate rounded-md ${
                    props && props.isSelected
                      ? `bg-primary text-primary-foreground`
                      : `text-card-foreground hover:bg-muted`
                  }`,
              }}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Theme</label>
            <Select
              value={themeInput}
              options={themeOptions}
              onChange={(value) =>
                setThemeInput(value ? (value as ThemeOption) : null)
              }
              primaryColor="orange"
              classNames={{
                menuButton: (props) =>
                  `flex text-sm text-foreground rounded-lg border border-border shadow-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${
                    props && props.isDisabled
                      ? "bg-muted cursor-not-allowed"
                      : "bg-background hover:bg-muted/50"
                  }`,
                menu: "absolute z-10 w-full bg-card border border-border shadow-lg rounded-lg py-1 mt-1.5 text-sm text-card-foreground",
                listItem: (props) =>
                  `block transition duration-200 px-3 py-2 cursor-pointer select-none truncate rounded-md ${
                    props && props.isSelected
                      ? `bg-primary text-primary-foreground`
                      : `text-card-foreground hover:bg-muted`
                  }`,
              }}
            />
          </div>

          <button
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-3 px-4 rounded-lg font-medium transition-colors duration-200"
            type="submit"
          >
            Save Profile
          </button>
        </form>
      </div>
    </div>
  );
}
