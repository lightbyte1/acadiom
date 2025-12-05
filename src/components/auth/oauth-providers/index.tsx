import { Fragment } from "react";
import GoogleOauthButton from "./GoogleOauthButton";
import AppleOauthButton from "./AppleOauthButton";
import PhoneOauthButton from "./PhoneOauthButton";
import FacebookOauthButton from "./FacebookOauthButton";

export default function OauthProviders() {
  const authProviders = [
    {
      name: "Google",
      component: <GoogleOauthButton />,
    },
    {
      name: "Apple",
      component: <AppleOauthButton />,
    },
    {
      name: "Facebook",
      component: <FacebookOauthButton />,
    },
    {
      name: "Phone",
      component: <PhoneOauthButton />,
    },
  ];

  return (
    <div className="flex w-full flex-col gap-2">
      {authProviders.map((provider) => (
        <Fragment key={provider.name}>{provider.component}</Fragment>
      ))}
    </div>
  );
}
