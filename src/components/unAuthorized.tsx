import { useTranslations } from "next-intl";

import { StopSignIcon } from "./icons";

export const UnAuthorized = () => {
  const t = useTranslations();

  return (
    <div className="flex flex-col items-center gap-5 mt-10">
      <div className="text-danger">
        <StopSignIcon size={100} />
      </div>

      <div className="text-2xl p-2 bg-danger/50 text-danger-700 rounded-xl">
        {t("UnAuthorized.access")}
      </div>
    </div>
  );
};
