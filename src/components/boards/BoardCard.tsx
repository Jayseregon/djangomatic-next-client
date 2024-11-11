"use client";

import { Card, CardHeader, CardBody } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { SquareArrowOutUpRight } from "lucide-react";

import { title, subtitle } from "@/components/primitives";

type BoardCardProps = {
  href: string;
  target: string;
};

export function BoardCard({ href, target }: BoardCardProps) {
  const t = useTranslations(`Boards.${target}`);
  const router = useRouter();
  const handlePress = () => {
    router.push(href);
  };

  return (
    <Card
      isPressable
      className="w-full h-full cursor-pointer hover:scale-105 transition-transform bg-background border border-foreground"
      onPress={handlePress}
    >
      <CardHeader className="flex justify-between">
        <h3 className={title({ size: "sm", className: "text-foreground" })}>
          {t("title")}
        </h3>
        <SquareArrowOutUpRight />
      </CardHeader>
      <CardBody>
        <p className={subtitle({ className: "mt-2 text-foreground" })}>
          {t("subtitle")}
        </p>
      </CardBody>
    </Card>
  );
}
