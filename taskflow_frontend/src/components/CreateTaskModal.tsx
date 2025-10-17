import { useState, useEffect } from "react";
import { ManagerService, UserService } from "../services";
import { TaskStatus, PriorityType } from "../types/api.types";
import toast from "react-hot-toast";
import { FiX } from "react-icons/fi";

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateTaskModal = ({ isOpen, onClose, onSuccess }: CreateTaskModalProps) => {
  const [projects, setProjects] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    taskTitle: "",
    description: "",
    status: TaskStatus.TODO,
    priority: PriorityType.MEDIUM,
    dueDate: "",
    memberId: "",
  });

  // Fetch projects when modal opens
  useEffect(() => {
    if (isOpen) fetchProjects();
  }, [isOpen]);

  // Fetch members when project changes
  useEffect(() => {
    if (selectedProjectId) {
      fetchMembers(Number(selectedProjectId));
    } else {
      setMembers([]);
      setFormData((prev) => ({ ...prev, memberId: "" }));
    }
  }, [selectedProjectId]);

  const fetchProjects = async () => {
    setLoadingProjects(true);
    try {
      const response = await ManagerService.getProjects();
      if (response.statusCode === 200) setProjects(response.data);
    } catch (err) {
      console.error("Failed to fetch projects:", err);
    } finally {
      setLoadingProjects(false);
    }
  };

  const fetchMembers = async (projectId: number) => {
    setLoadingMembers(true);
    try {
      const response = await UserService.findAvailableMembersForTaskByProjectId(projectId);
      if (response.statusCode === 200) setMembers(response.data);
    } catch (err) {
      console.error("Failed to fetch members:", err);
      setMembers([]);
    } finally {
      setLoadingMembers(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId) return setError("Please select a project");
    if (!formData.memberId) return setError("Please assign a member to this task");

    setError("");
    setLoading(true);

    const promise = ManagerService.createTask(Number(selectedProjectId), {
      ...formData,
      memberId: Number(formData.memberId),
    });

    toast.promise(promise, {
      loading: "Creating task...",
      success: "Task created successfully!",
      error: "Failed to create task.",
    }, {
      style: {
        fontSize: '16px',
        padding: '16px 24px',
        minWidth: '300px',
        borderRadius: '10px',
        background: '#ffffff',
        color: '#1e3a8a',
        fontWeight: '500',
        boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
      }
    });

    try {
      onClose();
      const response = await promise;
      if (response.statusCode === 201) {
        setFormData({
          taskTitle: "",
          description: "",
          status: TaskStatus.TODO,
          priority: PriorityType.MEDIUM,
          dueDate: "",
          memberId: "",
        });
        setSelectedProjectId("");
        onSuccess();
        onClose();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
          <h2 className="text-2xl font-bold text-gray-900">Create New Task</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          {/* Project Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Project *</label>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              required
              disabled={loadingProjects}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">
                {loadingProjects ? "Loading projects..." : "Choose a project"}
              </option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          {/* Task Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Task Title *</label>
            <input
              type="text"
              name="taskTitle"
              value={formData.taskTitle}
              onChange={handleChange}
              required
              placeholder="Enter task title"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              required
              placeholder="Describe the task"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Status & Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status *</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={TaskStatus.TODO}>To Do</option>
                <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
                <option value={TaskStatus.DONE}>Done</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority *</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={PriorityType.LOW}>Low</option>
                <option value={PriorityType.MEDIUM}>Medium</option>
                <option value={PriorityType.HIGH}>High</option>
              </select>
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Due Date *</label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Member Assignment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Assign To *</label>
            <select
              name="memberId"
              value={formData.memberId}
              onChange={handleChange}
              required
              disabled={!selectedProjectId || loadingMembers}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">
                {!selectedProjectId
                  ? "Select a project first"
                  : loadingMembers
                    ? "Loading members..."
                    : members.length === 0
                      ? "No members in this project"
                      : "Choose a member"}
              </option>
              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name} ({member.email})
                </option>
              ))}
            </select>
            {selectedProjectId && members.length === 0 && !loadingMembers && (
              <p className="text-xs text-orange-600 mt-1">
                No members found. Please add members to this project first.
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !selectedProjectId || members.length === 0}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? "Creating..." : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskModal;
