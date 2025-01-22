import { ReactNode } from "react";

import { UserSchema } from "@/interfaces/lib";

export interface MdPageContentProps {
  slug: string;
  session?: any;
}

export interface DynamicDocTemplateProps {
  slug: string;
  docType: string;
  permission: keyof UserSchema;
  session: any;
}

export interface MetadataTemplateProps {
  slug: string;
  docType: string;
}

export interface MdxRendererProps {
  source: string;
}

export interface CalloutProps {
  children?: ReactNode;
  type?: "default" | "warning" | "danger";
}

export interface QuoteProps {
  children?: ReactNode;
}

export interface SnippetProps {
  children?: ReactNode;
}

export interface LoadImageProps {
  imageName: string;
  height?: number;
  width?: number;
}

export interface TOCItem {
  title: string;
  id: string;
}

export interface TableOfContentsMdxProps {
  items: TOCItem[];
  title: string;
}
