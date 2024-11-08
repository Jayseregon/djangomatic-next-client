import { title } from "@/components/primitives";
import { siteConfig } from "@/src/config/site";

const appEnv = process.env.NEXT_PUBLIC_APP_ENV;
const appExtension = appEnv === "production" ? "" : `[${appEnv}]`;

const className = title({
  color: "violet",
  size: "lg",
  className: "flex flex-col items-center",
});

export default function AppName() {
  return (
    <h1 className={className}>
      <span>{siteConfig.name}</span>
      <span>{appExtension}</span>
    </h1>
  );
}
