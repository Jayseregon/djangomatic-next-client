"use client";

import { Card, CardHeader, CardBody } from "@heroui/react";

import { UploadCardProps } from "@/interfaces/chatbot";

export const UploadCard = ({
  title,
  description,
  children,
}: UploadCardProps) => (
  <Card className="bg-background border border-foreground w-full">
    <CardHeader className="flex flex-col gap-2">
      <h4 className="text-lg font-bold text-foreground text-left w-full">
        {title}
      </h4>
      <p className="text-sm text-foreground/70 text-left w-full">
        {description}
      </p>
    </CardHeader>
    <CardBody>
      <div className="space-y-4">{children}</div>
    </CardBody>
  </Card>
);
