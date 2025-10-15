// API Response Types
export interface ApiResponse<T> {
  message: string;
  data: T;
  statusCode: number;
}

// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface AuthResponse {
  id: number;
  name?: string;
  email?: string;
  token?: string;
  role: string;
}

// Legacy support - keeping userId for backward compatibility
export interface AuthResponseLegacy {
  userId: number;
  role: string;
}

// Project Types
export interface ProjectRequest {
  name: string;
  description: string;
}

export interface ProjectResponse {
  id: number;
  name: string;
  description: string;
  managerName?: string;
}

// Member Types
export interface AddMembersRequest {
  memberIds: number[];
}

export interface MemberInfo {
  id: number;
  name: string;
  email: string;
}

export interface MembersResponse {
  members: MemberInfo[];
}

// Task Types
export interface TaskRequest {
  taskTitle: string;
  description: string;
  status: string;
  priority: string;
  dueDate: string;
  memberId: number;
}

export interface TaskResponse {
  id: number;
  taskTitle: string;
  description: string;
  dueDate: string;
  status: string;
  priority: string;
  projectName?: string;
  memberName?: string;
}

export interface taskStats {
  totalTasks: number,
  tasksInProgress: number,
  inProgressPercentage: number
}

// Enums (as const objects for better TypeScript support)
export const RoleType = {
  ADMIN: "ADMIN",
  MANAGER: "MANAGER",
  MEMBER: "MEMBER",
} as const;

export type RoleType = (typeof RoleType)[keyof typeof RoleType];

export const TaskStatus = {
  TODO: "TODO",
  IN_PROGRESS: "IN_PROGRESS",
  DONE: "DONE",
} as const;

export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus];

export const PriorityType = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
} as const;

export type PriorityType = (typeof PriorityType)[keyof typeof PriorityType];
