export interface UserSchema {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  lastLogin: Date;
  isAdmin: boolean;
  isRnDTeam: boolean;
  canAccessAppsTdsHLD: boolean;
  canAccessAppsTdsLLD: boolean;
  canAccessAppsTdsArcGIS: boolean;
  canAccessAppsTdsOverride: boolean;
  canAccessAppsTdsAdmin: boolean;
  canAccessAppsTdsSuper: boolean;
  canAccessAppsCogecoHLD: boolean;
  canAccessAppsVistabeamHLD: boolean;
  canAccessAppsVistabeamOverride: boolean;
  canAccessAppsVistabeamSuper: boolean;
  canAccessAppsXploreAdmin: boolean;
  canAccessAppsTelusAdmin: boolean;
  canAccessBugReportBoard: boolean;
  canAccessRoadmapBoard: boolean;
  canAccessReports: boolean;
  canAccessRnd: boolean;
  canAccessDocsTDS: boolean;
  canAccessDocsCogeco: boolean;
  canAccessDocsVistabeam: boolean;
  canAccessDocsXplore: boolean;
  canAccessVideoAdmin: boolean;
  canAccessVideoGIS: boolean;
  canAccessVideoCAD: boolean;
  canAccessVideoLiDAR: boolean;
  canAccessVideoEng: boolean;
  canAccessVideoSttar: boolean;
  rndTasks: RnDTeamTask[];
}

export interface RnDTeamTask {
  id: string;
  createdAt: Date;
  owner: UserSchema;
  task: string;
  priority: number;
  impactedPeople: string;
  comment?: string;
  status: Status;
  dueDate?: Date | null;
  startedAt?: Date | null;
  completedAt?: Date | null;
}

export enum Status {
  CREATED = "CREATED",
  NEXT_UP = "NEXT_UP",
  IN_PROGRESS = "IN_PROGRESS",
  PENDING = "PENDING",
  BLOCKED = "BLOCKED",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

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
  project_id?: string;
  project_num?: string;
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
  projectId?: string;
  projectNum?: string;
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
