import { UserSchema } from "@/interfaces/lib";

export interface MdPageContentProps {
  params: {
    slug: string;
  };
  session?: any;
}

export interface DynamicDocTemplateProps {
  params: { slug: string };
  docType: string;
  permission: keyof UserSchema;
  session: any;
}

export interface MetadataTemplateProps {
  params: { slug: string };
  docType: string;
}

export interface MdxRendererProps {
  source: string;
}
