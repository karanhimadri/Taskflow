import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { ProjectResponse, TaskResponse, AuthResponse } from "../types/api.types";

interface ResourceContextType {
  // Projects
  projects: ProjectResponse[];
  setProjects: (projects: ProjectResponse[]) => void;
  addProject: (project: ProjectResponse) => void;
  updateProject: (projectId: number, updatedProject: Partial<ProjectResponse>) => void;
  removeProject: (projectId: number) => void;
  clearProjects: () => void;

  // Tasks
  tasks: TaskResponse[];
  setTasks: (tasks: TaskResponse[]) => void;
  addTask: (task: TaskResponse) => void;
  updateTask: (taskId: number, updatedTask: Partial<TaskResponse>) => void;
  removeTask: (taskId: number) => void;
  clearTasks: () => void;

  // Members
  members: AuthResponse[];
  setMembers: (members: AuthResponse[]) => void;
  addMember: (member: AuthResponse) => void;
  removeMember: (memberId: number) => void;
  clearMembers: () => void;

  // Clear all resources
  clearAll: () => void;
}

const ResourceContext = createContext<ResourceContextType | undefined>(undefined);

export const ResourceContextProvider = ({ children }: { children: ReactNode }) => {
  const [projects, setProjects] = useState<ProjectResponse[]>([]);
  const [tasks, setTasks] = useState<TaskResponse[]>([]);
  const [members, setMembers] = useState<AuthResponse[]>([]);

  // Project operations
  const addProject = (project: ProjectResponse) => {
    setProjects((prev) => [...prev, project]);
  };

  const updateProject = (projectId: number, updatedProject: Partial<ProjectResponse>) => {
    setProjects((prev) =>
      prev.map((project) =>
        project.id === projectId ? { ...project, ...updatedProject } : project
      )
    );
  };

  const removeProject = (projectId: number) => {
    setProjects((prev) => prev.filter((project) => project.id !== projectId));
  };

  const clearProjects = () => {
    setProjects([]);
  };

  // Task operations
  const addTask = (task: TaskResponse) => {
    setTasks((prev) => [...prev, task]);
  };

  const updateTask = (taskId: number, updatedTask: Partial<TaskResponse>) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, ...updatedTask } : task
      )
    );
  };

  const removeTask = (taskId: number) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  };

  const clearTasks = () => {
    setTasks([]);
  };

  // Member operations
  const addMember = (member: AuthResponse) => {
    setMembers((prev) => [...prev, member]);
  };

  const removeMember = (memberId: number) => {
    setMembers((prev) => prev.filter((member) => member.id !== memberId));
  };

  const clearMembers = () => {
    setMembers([]);
  };

  // Clear all resources
  const clearAll = () => {
    clearProjects();
    clearTasks();
    clearMembers();
  };

  const value: ResourceContextType = {
    // Projects
    projects,
    setProjects,
    addProject,
    updateProject,
    removeProject,
    clearProjects,

    // Tasks
    tasks,
    setTasks,
    addTask,
    updateTask,
    removeTask,
    clearTasks,

    // Members
    members,
    setMembers,
    addMember,
    removeMember,
    clearMembers,

    // Clear all
    clearAll,
  };

  return <ResourceContext.Provider value={value}>{children}</ResourceContext.Provider>;
};

// Custom hook to use the ResourceContext
export const useResource = () => {
  const context = useContext(ResourceContext);
  if (context === undefined) {
    throw new Error("useResource must be used within a ResourceContextProvider");
  }
  return context;
};

export default ResourceContext;
