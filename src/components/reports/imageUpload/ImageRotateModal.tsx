import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import { ImageOff, RotateCcw, RotateCw, Save } from "lucide-react";

import { ImageRotateModalProps } from "@/interfaces/reports";

export const ImageRotateModal = ({
  isOpen,
  file,
  onClose,
  onConfirm,
}: ImageRotateModalProps) => {
  const [rotation, setRotation] = useState<number>(0);
  const [previewURL, setPreviewURL] = useState<string | null>(null); // Initialize to null

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);

      setPreviewURL(url);

      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setPreviewURL(null); // Ensure previewURL is null when no file
    }
  }, [file]);

  const rotateLeft = () => {
    setRotation((prevRotation) => prevRotation - 90);
  };

  const rotateRight = () => {
    setRotation((prevRotation) => prevRotation + 90);
  };

  const handleConfirm = async () => {
    const rotatedFile = await getRotatedImageFile(file, rotation);

    onConfirm(rotatedFile);
  };

  const getRotatedImageFile = (file: File, rotation: number): Promise<File> => {
    return new Promise((resolve, reject) => {
      const img = new Image();

      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          reject("Could not get canvas context");

          return;
        }
        // Calculate the new canvas size
        const angle = ((rotation % 360) + 360) % 360;
        const radians = (angle * Math.PI) / 180;
        const sin = Math.abs(Math.sin(radians));
        const cos = Math.abs(Math.cos(radians));

        canvas.width = img.width * cos + img.height * sin;
        canvas.height = img.width * sin + img.height * cos;
        // Rotate and draw the image
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(radians);
        ctx.drawImage(img, -img.width / 2, -img.height / 2);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const rotatedFile = new File([blob], file.name, {
                type: file.type,
              });

              resolve(rotatedFile);
            } else {
              reject("Canvas is empty");
            }
          },
          file.type,
          1,
        );
        // Clean up
        URL.revokeObjectURL(img.src);
      };
      img.onerror = () => {
        reject("Could not load image");
      };
    });
  };

  return (
    <Modal
      closeButton
      aria-labelledby="rotate-image-modal"
      backdrop="blur"
      classNames={{
        base: "bg-background border border-foreground",
      }}
      isOpen={isOpen}
      size="2xl"
      onClose={onClose}
    >
      <ModalContent>
        <ModalHeader
          className="flex flex-row justify-between items-center w-full"
          id="rotate-image-modal"
        >
          Image Rotation
        </ModalHeader>
        <ModalBody>
          <div className="flex justify-center p-5">
            {previewURL && (
              <img
                alt="Preview"
                className="max-w-full max-h-80"
                src={previewURL}
                style={{ transform: `rotate(${rotation}deg)` }}
              />
            )}
          </div>
        </ModalBody>
        <ModalFooter className="flex items-center justify-between">
          <Button
            isIconOnly
            aria-label="cancel"
            color="danger"
            variant="light"
            onPress={onClose}
          >
            <ImageOff />
          </Button>
          <div>
            <Button
              isIconOnly
              aria-label="rotate Left"
              variant="light"
              onPress={rotateLeft}
            >
              <RotateCcw />
            </Button>
            <Button
              isIconOnly
              aria-label="rotate right"
              variant="light"
              onPress={rotateRight}
            >
              <RotateCw />
            </Button>
          </div>
          <Button
            isIconOnly
            aria-label="confirm"
            color="success"
            variant="solid"
            onPress={handleConfirm}
          >
            <Save />
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
