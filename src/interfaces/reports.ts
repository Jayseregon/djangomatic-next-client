import {
  TowerReport,
  TowerReportImage,
  TOCSections,
  AntennaTransmissionLine,
} from "@/types/reports";

export interface TowerReportFormProps {
  report?: Partial<TowerReport> | null;
  onSave: (report: Partial<TowerReport>) => void;
  onLocalSave: (report: Partial<TowerReport>) => Promise<{
    success: boolean;
    isNewReport: boolean;
    response: { message: string; id: string; updatedAt: Date };
  }>;
  onCancel: (newlyUploadedImages: TowerReportImage[], subdir: string) => void;
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

export interface LabelInputProps {
  value: string | undefined;
  name: string;
  placeholder: string;
  options: string[];
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface AntennaTransmissionInputsProps {
  antennaInventory: AntennaTransmissionLine[];
  onAntennaChange: (
    index: number,
    field: string,
    value: string | number,
  ) => void;
  onAddAntenna: () => void;
  onRemoveAntenna: (index: number) => void;
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
