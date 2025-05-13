export type User = {
  id: string;
  email: string;
  name: string;
  avatar?: string;
};

export type TaskStatus = "todo" | "doing" | "done";

export type Task = {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  assignedTo?: string;
  tags?: string[];
  dueDate?: string;
  priority: "low" | "medium" | "high";
  timeSpent?: number; // in seconds
  comments?: Comment[];
  attachments?: Attachment[];
  hasNotifications?: boolean;
  labels?: string[];
  notificationCount?: number;
};

export type Comment = {
  id: string;
  text: string;
  createdAt: string;
  createdBy: string;
};

export type Attachment = {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: string;
  uploadedBy: string;
};

export type Project = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  createdBy: string;
  members: string[];
  tasks: Task[];
};

export type ActivityLog = {
  id: string;
  userId: string;
  action: string;
  entityType: "task" | "project" | "comment";
  entityId: string;
  timestamp: string;
  details?: any;
};
