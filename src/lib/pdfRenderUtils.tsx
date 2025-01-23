import { Text } from "@react-pdf/renderer";

import { StylesPDF } from "@/styles/stylesPDF";
import { TowerReportImage } from "@/src/interfaces/reports";

export const parseTextBold = (text: string) => {
  const parts = text.split(/(\*\*[^\*]+\*\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <Text key={index} style={StylesPDF.boldText}>
          {part.slice(2, -2)}
        </Text>
      );
    } else {
      return <Text key={index}>{part}</Text>;
    }
  });
};

export async function fetchImageBatch(
  images: TowerReportImage[],
): Promise<{ [key: string]: string }> {
  const urls = images.map((img) => img.url);
  const encodedUrls = encodeURIComponent(JSON.stringify(urls));

  try {
    const response = await fetch(`/api/proxy-image?urls=${encodedUrls}`);
    const imagesData = await response.json();

    return imagesData.reduce((acc: { [key: string]: string }, img: any) => {
      if (img) {
        const bytes = new Uint8Array(img.data);
        const base64 = btoa(
          bytes.reduce((data, byte) => data + String.fromCharCode(byte), ""),
        );

        acc[img.url] = `data:${img.contentType};base64,${base64}`;
      }

      return acc;
    }, {});
  } catch (error) {
    console.error("Error loading images:", error);

    return {};
  }
}
