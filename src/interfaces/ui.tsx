export interface SidebarProps {
  nonce?: string;
}

export interface AppItem {
  label: string;
  href: string;
  type?: string;
  desc?: string;
  endpoint?: string;
  version?: string;
  date_upd?: string;
  doc_href?: string;
  dbClass?: string;
  asDownloadable?: boolean;
  willOverride?: boolean;
  is_active?: string;
}

export interface AppCategory {
  title: string;
  data: AppItem[];
}

export interface SidebarSectionProps {
  categories: AppCategory[];
  nonce?: string;
}
