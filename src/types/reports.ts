export type TowerReport = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  front_image: TowerReportImage[];
  site_images: TowerReportImage[];
  deficiency_images: TowerReportImage[];
  jde_work_order: string;
  jde_job: string;
  site_name: string;
  site_code: string;
  site_region: string;
  tower_id: string;
  tower_name: string;
  tower_site_name: string;
  job_revision: string;
  job_description: string;
  design_standard: string;
  client_name: string;
  client_company: string;
};

export type TowerReportImage = {
  id: string;
  url: string;
  label: string;
  azureId: string;
};

export type TOCSections = {
  title: string;
  pageNumber: number;
};
