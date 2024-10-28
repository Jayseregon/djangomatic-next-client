import { title } from "@/components/primitives";
import { siteConfig } from "@/src/config/site";

export default function AppName() {
  const appEnv = process.env.NEXT_PUBLIC_APP_ENV;
  const appExtension =
    appEnv === "production"
      ? "[beta]"
      : appEnv === "staging"
        ? "[staging]"
        : "[local]";

  return (
    <h1
      className={title({
        color: "violet",
        size: "lg",
        className: "flex flex-col items-center",
      })}
    >
      <span>{siteConfig.name}</span>
      <span>{appExtension}</span>
    </h1>
  );
}
