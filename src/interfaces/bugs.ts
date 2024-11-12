export interface BugReport {
  id: string;
  title: string;
  description: string;
  createdDate: Date;
  createdBy: string;
  assignedTo?: string;
  priority: BugPriority;
  status: BugStatus;
  assignedDate?: Date | null;
  completedDate?: Date | null;
  comments?: string;
}

export enum BugStatus {
  OPEN = "OPEN",
  IN_PROGRESS = "IN_PROGRESS",
  RESOLVED = "RESOLVED",
  CLOSED = "CLOSED",
}

export enum BugPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL",
}
