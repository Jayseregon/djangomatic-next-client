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
