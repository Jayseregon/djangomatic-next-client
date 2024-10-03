import {
  TowerReport,
  TowerReportImage,
  TOCSections,
  AntennaTransmissionLine,
} from "@/types/reports";

export interface TowerReportFormProps {
  report?: Partial<TowerReport> | null;
  onSave: (report: Partial<TowerReport>) => void;
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
  labelOptions?: string[];
  maxImages?: number;
  isFrontcover?: boolean;
}

export interface TOCSectionProps {
  id: string;
  style: object;
  children: React.ReactNode;
  tocSections: TOCSections[];
  willCaptureToc: boolean;
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
    value: string | number
  ) => void;
  onAddAntenna: () => void;
  onRemoveAntenna: (index: number) => void;
}
