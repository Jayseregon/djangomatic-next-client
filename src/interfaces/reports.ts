export interface TowerReportFormProps {
  report?: Partial<TowerReport> | null;
  onSave: (report: Partial<TowerReport>) => void;
  onLocalSave: (report: Partial<TowerReport>) => Promise<{
    success: boolean;
    isNewReport: boolean;
    response: { message: string; id: string; updatedAt: Date };
  }>;
  onCancel: (newlyUploadedImages: TowerReportImage[], subdir: string) => void;
  isNew?: boolean;
}

export interface QuickbaseInputsProps {
  formData: Partial<TowerReport>;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface ImageUploadProps {
  images: TowerReportImage[];
  onImagesChange: (images: TowerReportImage[]) => void;
  subdir: string;
  onNewImageUpload: (image: TowerReportImage) => void;
  newImageButtonName: string;
  labelPlaceholder: string;
  labelOptions?: string[];
  maxImages?: number;
  isFrontcover?: boolean;
  isDeficiency?: boolean;
}

export interface TOCSectionProps {
  id: string;
  style: object;
  children: React.ReactNode;
  tocSections: TOCSections[];
  willCaptureToc: boolean;
  redlinePages?: number;
  jumpRedlines?: boolean;
}

export interface DropAreaProps {
  onFilesAdded: (files: FileList) => void;
  isDisabled: boolean;
  index: number;
}

export interface FormInputProps {
  value: string | number | undefined;
  name: string;
  label?: string;
  placeholder?: string;
  type?: string;
  isRounded?: boolean;
  withTooltip?: boolean;
  className?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface NoteInputProps {
  id: string;
  value: string | number | undefined;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface AntennaFormInputProps {
  value: string | undefined;
  name: string;
  width?: string;
  placeholder?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface LabelInputProps {
  value: string | undefined;
  name: string;
  placeholder: string;
  options: string[];
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface AntennaTransmissionInputsProps {
  antennaInventory: AntennaTransmissionLine[];
  onAntennaChange: (index: number, field: string, value: string) => void;
  onAddAntenna: () => void;
  onRemoveAntenna: (index: number) => void;
  onDuplicateAntenna: (index: number) => void;
}

export interface LocalImages {
  file: File | null;
  label: string;
  url?: string;
  imgIndex: number;
  deficiency_check_procedure: string;
  deficiency_recommendation: string;
}

export interface FormInputRowProps {
  image: LocalImages;
  isDeficiency: boolean;
  isFrontcover?: boolean;
  labelOptions?: string[];
  labelPlaceholder: string;
  handleImageChange: (index: number, files: FileList) => void;
  handleLabelChange: (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => void;
  handleDeficiencyCheckProcedureChange: (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => void;
  handleDeficiencyRecommendationChange: (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => void;
  removeImageField: (index: number) => void;
}

export interface ImageRowProps {
  image: LocalImages;
  isDeficiency: boolean;
  isFrontcover?: boolean;
  removeImageField: (index: number) => void;
}

export interface JsonListForm {
  code: string;
  item: string;
}

export interface NotesInputsProps {
  notes: Note[];
  onAddNote: () => void;
  onNoteChange: (index: number, field: string, value: any) => void;
  onRemoveNote: (index: number) => void;
}

export interface ImageRotateModalProps {
  isOpen: boolean;
  file: File;
  onClose: () => void;
  onConfirm: (rotatedFile: File) => void;
}

export interface RecordData {
  [key: string]: string | number;
}

export interface ListItem {
  code: string;
  item: string;
}

export interface DynamicFormProps {
  setChecklistForm: (
    form: ChecklistRow[] | ((prev: ChecklistRow[]) => ChecklistRow[]),
  ) => void;
  checkListForm: ChecklistRow[];
  list: ListItem[];
  onFormChange: (
    setChecklistForm: (
      form: ChecklistRow[] | ((prev: ChecklistRow[]) => ChecklistRow[]),
    ) => void,
    index: number,
    field: string,
    value: string | boolean | undefined,
  ) => void;
}

export interface TowerReport {
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
  assigned_peng: string;
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
  notes_antenna: Note[];
  notes_deficiency: Note[];
}

export interface ChecklistRow {
  id: string;
  code: string;
  isChecked?: boolean;
  comments: string;
}

export interface TowerReportImage {
  id: string;
  url: string;
  label: string;
  deficiency_check_procedure: string;
  deficiency_recommendation: string;
  imgIndex: number;
  azureId: string;
}

export interface TOCSections {
  title: string;
  pageNumber: number;
}

export interface AntennaTransmissionLine {
  id: string;
  elevation: string;
  quantity: string;
  equipment: string;
  azimuth: string;
  tx_line: string;
  odu: string;
  carrier: string;
}

export interface Note {
  id: string;
  indexNumber: number;
  comment: string;
}
