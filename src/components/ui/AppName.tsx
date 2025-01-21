import { title } from "@/components/primitives";
import { siteConfig } from "@/src/config/site";

const getEnvironmentExtension = () => {
  const appEnv = process.env.NEXT_PUBLIC_APP_ENV;

  if (!appEnv || appEnv === "production") return "";

  return `[${appEnv}]`;
};

const className = title({
  color: "violet",
  size: "lg",
  className: "flex flex-col items-center",
});

export default function AppName() {
  const appExtension = getEnvironmentExtension();

  return (
    <h1 className={className}>
      <span>{siteConfig.name}</span>
      {appExtension && <span>{appExtension}</span>}
    </h1>
  );
}
