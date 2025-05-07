import { ReactNode } from "react";

export interface MessageProps {
  message: {
    id: string;
    role: "data" | "user" | "system" | "assistant";
    content: string;
  };
}

export interface ChromaCollectionsInfoResponse {
  [collectionName: string]: number;
}

export interface ChromaHeartbeatResponse {
  status: string;
  message: string;
  heartbeat: number;
}

export interface DocumentObjectMetadata {
  id: string;
  relevance_score: number;
  description: string;
  title: string;
  document_type: string;
  source: string;
}

export interface RetrievedDocument {
  metadata: DocumentObjectMetadata;
  page_content: string;
}

export interface RetrieverResponse {
  documents: RetrievedDocument[];
}

export interface ChromaCollectionSourcesResponse {
  collections?: {
    [collectionName: string]: string[];
  };
}

export interface ChromaDeleteSourceResponse {
  status: string;
  message?: string;
  documents_deleted: number;
}

export interface SasTokenResponse {
  success: boolean;
  sasToken: string;
  containerName: string;
  blobName: string;
  accountName: string;
  errorMessage?: string;
}

export interface DocumentMetadata {
  id?: string;
  producer?: string;
  creator?: string;
  creationdate?: string;
  source?: string;
  url?: string;
  file_path?: string;
  total_pages?: number;
  format?: string;
  title?: string;
  author?: string;
  subject?: string;
  keywords?: string;
  moddate?: string;
  trapped?: string;
  modDate?: string;
  creationDate?: string;
  timestamp?: string;
  page?: number;
  document_type?: string;
  description?: string;
}

export interface StoreMetadata {
  nb_collections: number;
  details: Record<string, Record<string, number>>;
}

export interface AddDocumentsResponse {
  status: string;
  filename: string;
  store_metadata: StoreMetadata;
  added_count: number;
  skipped_count: number;
  skipped_sources: string[];
  doc_sample_meta?: DocumentMetadata;
}

export interface UpdateDocumentsResponse {
  status: string;
  filename: string;
  store_metadata: StoreMetadata;
  added_count: number;
  docs_replaced: number;
  sources_updated: number;
  doc_sample_meta?: DocumentMetadata;
}

// Types for our hooks and components
export type UploadOperation = "add" | "update";
export type SourceType = "pdf" | "setics" | "web";
export type UploadResult =
  | AddDocumentsResponse
  | UpdateDocumentsResponse
  | null;

export interface FileUploadHookResult {
  fileToUpload: File | null;
  uploading: boolean;
  uploadError: string | null;
  uploadOperation: UploadOperation;
  uploadProgress: number;
  uploadResult: UploadResult;
  inputRef: React.RefObject<HTMLInputElement | null>;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFileUpload: (operation: UploadOperation) => Promise<void>;
}

export interface WebUploadHookResult {
  urlToProcess: string;
  processing: boolean;
  error: string | null;
  operation: UploadOperation;
  withImages: boolean;
  uploadResult: UploadResult;
  setUrlToProcess: (url: string) => void;
  setWithImages: (value: boolean) => void;
  handleUrlSubmit: (operation: UploadOperation) => Promise<void>;
}

export interface UploadCardProps {
  title: string;
  description: string;
  children?: ReactNode;
}

export interface UploadResultDisplayProps {
  result: UploadResult;
  sourceLabel?: string;
}

export interface FileUploadInputProps {
  accept: string;
  icon: ReactNode;
  inputRef: React.Ref<HTMLInputElement>;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileToUpload: File | null;
  uploadProgress: number;
  uploading: boolean;
}

export interface UploadActionButtonsProps {
  uploading: boolean;
  disabled: boolean;
  currentOperation: UploadOperation;
  onUpload: (operation: UploadOperation) => void;
}
