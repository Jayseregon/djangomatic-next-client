"use client";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/router";

import { PDFFileIcon } from "../icons";

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
      onClick={handleRedirect}
    >
      <PDFFileIcon />
    </Button>
  );
}
