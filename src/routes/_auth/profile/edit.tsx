import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { TextInput } from "../../../components/component-parts/TextInput";
import { useState } from "react";
import {
  useUpdateUserInfoMutation,
  userInfoQueryOptions,
} from "../../../api/users/userQueryOptions";
import moment from "moment-timezone";
import Select from "react-tailwindcss-select";
import { useSuspenseQuery } from "@tanstack/react-query";
import { TUpdateUserInfo } from "../../../api/users/userInfo";

export const Route = createFileRoute("/_auth/profile/edit")({
  loader: ({ context: { auth, queryClient } }) => {
    queryClient.ensureQueryData(userInfoQueryOptions(auth.user!.token));
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
  const { data: profile } = useSuspenseQuery(
    userInfoQueryOptions(auth.user!.token)
  );
  type ThemeOption = { label: string; value: string };
  type TimezoneOption = { label: string; value: string };
  const themeOptions: ThemeOption[] = [
    { label: "Reframe Dark", value: "reframeDark" },
    { label: "Coffee", value: "coffee" },
    { label: "Sunset", value: "sunset" },
    { label: "Emerald", value: "Emerald" },
    { label: "Reframe Light", value: "reframeLight" },
  ];
  const navigate = useNavigate();
  const [firstNameInput, setFirstNameInput] = useState(profile.firstName || "");
  const [lastNameInput, setLastNameInput] = useState(profile.lastName || "");
  const [timezoneInput, setTimezoneInput] = useState<null | TimezoneOption>(
    null
  );
  const [countryInput, setCountryInput] = useState(profile.country || "");
  const [themeInput, setThemeInput] = useState<null | ThemeOption>(null);

  // const [searchInput, setSearchInput] = useState("");
  const mutation = useUpdateUserInfoMutation(
    auth.user!.token,
    () => {
      alert("Profile updated successfully");
      navigate({ to: "/profile" });
    },
    (e) => console.error("Mutation error:", e.message)
  );
  // const filteredTimezones = timezones.filter((timezone) =>
  //   timezone.toLowerCase().includes(searchInput.toLowerCase())
  // );
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

      queryClient.invalidateQueries(userInfoQueryOptions(auth.user!.token));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-2xl my-4  ">Edit Profile</h1>
      <form
        className=" flex-col flex gap-4 bg-primary rounded-lg items-center p-10 "
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

        <label className="form-control w-full max-w-xs">
          <span className="label text-lg text-primary-content">Timezone</span>
          <Select
            primaryColor="indigo"
            options={mappedTimezones}
            value={timezoneInput}
            isSearchable={true}
            onChange={(value) => setTimezoneInput(value)}
            classNames={{
              list: "w-full bg-base-200 placeholder-secondary-content text-secondary-content",
              searchBox: "w-full bg-base-200 text-primary",
              menu: "w-full bg-base-200 placeholder-secondary-content text-secondary-content",
            }}
          />
        </label>
        <label className="form-control w-full max-w-xs">
          <span className="label text-lg text-primary-content ">Theme</span>
          <Select
            value={themeInput}
            options={themeOptions}
            onChange={(value) => setThemeInput(value)}
            primaryColor="indigo"
            classNames={{
              searchContainer:
                "w-full bg-base-200 placeholder-secondary-content",

              menu: "w-full bg-base-200  text-primary",
            }}
          />
        </label>

        <button className="btn btn-primary mt-4 w-full max-w-xs" type="submit">
          Save
        </button>
      </form>
    </div>
  );
}
