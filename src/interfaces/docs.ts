import { DocsData } from "@/src/config/docsData";

export interface VideosGridFilteredProps {
  selectedCategory: string;
}

export interface DocLinkButtonProps {
  projectType: keyof DocsData;
  slug: string;
}
