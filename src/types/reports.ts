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
  redline_pages: number;
  antenna_inventory: AntennaTransmissionLine[];
  checklistForm4: ChecklistRow[];
  checklistForm5: ChecklistRow[];
  checklistForm6: ChecklistRow[];
  checklistForm7: ChecklistRow[];
  checklistForm8: ChecklistRow[];
  checklistForm9: ChecklistRow[];
  checklistForm10: ChecklistRow[];
  checklistForm11: ChecklistRow[];
};

export type ChecklistRow = {
  id: string;
  code: string;
  isChecked?: boolean;
  comments: string;
};

export type TowerReportImage = {
  id: string;
  url: string;
  label: string;
  deficiency_check_procedure: string;
  deficiency_recommendation: string;
  imgIndex: number;
  azureId: string;
};

export type TOCSections = {
  title: string;
  pageNumber: number;
};

export type AntennaTransmissionLine = {
  id: string;
  elevation: number;
  quantity: number;
  equipment: string;
  azimuth: number;
  tx_line: string;
  odu: string;
  carrier: string;
};
