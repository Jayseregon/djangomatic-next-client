export interface fetchDbSchemasProps {
  target_db: string;
  backendUser: string;
}

export interface fetchSchemaTablesProps {
  target_db: string;
  schema_choice: string;
  user_pattern: string;
  endpoint?: string;
  backendUser: string;
}

export interface startTaskProps {
  db_choice: string;
  schema_choice: string;
  table_choice?: string;
  dbClass: string;
  endpoint: string;
  file?: File;
  backendUser?: string;
  operationChoice?: string;
  uuidPole?: string;
  tdsUsername?: string;
  tdsPassword?: string;
  arcgisErase?: boolean;
  arcgisSnapshot?: boolean;
  is_override?: boolean;
}

export interface checkTaskStatusProps {
  task_id: string;
  waitTime: number;
  setTaskData: React.Dispatch<React.SetStateAction<TaskDataProps>>;
  taskOptions?: startTaskProps;
  accessDownload?: boolean;
  backendUser?: string;
}

export interface InputDataProps {
  dbChoice: string | null;
  schemaChoice: string | null;
  tableChoice: string | null;
  dbClass: string;
  appType?: string;
  clientName?: string;
  taskEndpoint: string;
  asDownloadable?: boolean;
  willOverride?: boolean;
  operationChoice?: string;
  uuidPole?: string;
  file?: File;
  fileName?: string | null;
  tdsUsername?: string | null;
  tdsPassword?: string | null;
  arcgisErase?: boolean;
  arcgisSnapshot?: boolean;
}

export interface TaskDataProps {
  taskId: string | null;
  taskStatus: string | null;
  taskResult: any;
  downloadUrl: string | null;
  isLoading: boolean;
}

export interface DatabaseDropdownProps {
  appType?: string;
  dbClass: string;
  setInputData: React.Dispatch<React.SetStateAction<InputDataProps>>;
}

export interface SchemasDropdownProps {
  inputData: InputDataProps;
  setInputData: React.Dispatch<React.SetStateAction<InputDataProps>>;
}

export interface SchemaDropdownData {
  value: string;
  label: string;
}

export interface TablesDropdownProps {
  inputData: InputDataProps;
  setInputData: React.Dispatch<React.SetStateAction<InputDataProps>>;
  pattern: string;
  endpoint?: string;
}

export interface TableDropdownData {
  value: string;
  label: string;
}

export interface DisplayFieldChoiceProps {
  fieldChoice: string | null;
  nonce?: string;
}

export interface DisplayFieldGuidelineProps {
  guideline: string;
}

export interface DownloadButtonProps {
  downloadUrl: string | null;
  nonce?: string;
}

export interface DropDownSelectorProps {
  items: SchemaDropdownData[] | TableDropdownData[];
  selectedKey: string;
  setSelectedKey: React.Dispatch<React.SetStateAction<string>>;
  selectedLabel: string;
  handleSelect: (key: string) => void;
}

export interface DefaultButtonSelectorProps {
  label: string;
  isDisabled?: boolean;
  type?: "default" | "danger";
}
