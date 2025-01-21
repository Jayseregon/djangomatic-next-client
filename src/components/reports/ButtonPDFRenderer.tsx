"use client";
import { Button } from "@heroui/react";
import { useRouter } from "next/router";

import { PDFFileIcon } from "@/components/icons";

export default function ButtonPDFRenderer() {
  const router = useRouter();

  const handleRedirect = () => {
    router.push(`${router.asPath}/pdf`);
  };

  return (
    <Button
      isIconOnly
      className="mt-4"
      color="primary"
      type="button"
      onPress={handleRedirect}
    >
      <PDFFileIcon />
    </Button>
  );
}
