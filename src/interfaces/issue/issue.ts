interface IssueProcess {
  processId: number;
  processName: string;
  issueTypeId: number;
  isActive: boolean;
  sequenceId: number;
}

interface IssueType {
  value: number;
  label: string;
  issueTypeId: number;
  issueTypeName: string;
  departmentId: number;
  departmentName: string;
  activities: string;
  whoCanAvail: string;
  isActive: boolean;
  processes: IssueProcess[];
}

export interface IssuePayloadTS {
  date: string; // ISO string, e.g., "2025-05-28T00:00:00.000Z"
  issueType: IssueType;
  contact: string;
  details: string;
  remarks: string;
}

export interface TicketDetails {
  ticketId: number;
  issueTypeId: number;
  issueTypeName: string;
  businessUnitId: number;
  businessUnitName: string;
  contactNo: string;
  issueDetails: string;
  remarks: string | null;
  investigationPersonId: number | null;
  investigationPersonName: string | null;
  ticketRequestFor: number;
  ticketRequestForName: string;
  ticketCreateBy: number;
  ticketCreateByName: string;
  createDate: string | null; // ISO 8601 format
  attachmentId: number | null;
  rating: number | null;
  isTicketClosed: boolean;
  currentRowId: number;
  processHistory: ProcessHistory[];
  attachments: Attachment[]; // Currently empty, can be defined later if needed
}

export interface ProcessHistory {
  rowId: number;
  processId: number;
  processName: string;
  responsiblePersonId: number;
  responsiblePersonName: string | null;
  delegateDate: string; // ISO 8601 format
  isComplete: boolean;
  status: string;
  isActive: boolean;
  actionButton: string | null;
  sequenceId: number;
}

export interface Attachment {
  // Define based on actual structure when available
  // Example placeholder:
  id?: number;
  fileName?: string;
  fileUrl?: string;
}
