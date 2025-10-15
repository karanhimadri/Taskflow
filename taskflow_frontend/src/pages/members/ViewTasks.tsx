import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TaskStatus, PriorityType } from "../../types/api.types";

// Task type for sample data
interface Task {
  id: number;
  taskTitle: string;
  description: string;
  dueDate: string;
  status: string;
  priority: string;
  projectName: string;
}

// Sample task data
const sampleTasks: Task[] = [
  {
    id: 1,
    taskTitle: "Design Database Schema",
    description: "Create comprehensive database schema for the new feature with proper relationships and constraints.",
    dueDate: "2025-10-20",
    status: TaskStatus.TODO,
    priority: PriorityType.HIGH,
    projectName: "E-Commerce Platform"
  },
  {
    id: 2,
    taskTitle: "Implement User Authentication",
    description: "Build secure user authentication system with JWT tokens and refresh token mechanism.",
    dueDate: "2025-10-18",
    status: TaskStatus.IN_PROGRESS,
    priority: PriorityType.HIGH,
    projectName: "CRM System"
  },
  {
    id: 3,
    taskTitle: "Write API Documentation",
    description: "Document all REST API endpoints with request/response examples and error codes.",
    dueDate: "2025-10-25",
    status: TaskStatus.TODO,
    priority: PriorityType.MEDIUM,
    projectName: "TaskFlow Backend"
  },
  {
    id: 4,
    taskTitle: "Fix Payment Gateway Bug",
    description: "Resolve the issue with payment confirmation not triggering email notifications.",
    dueDate: "2025-10-15",
    status: TaskStatus.DONE,
    priority: PriorityType.HIGH,
    projectName: "E-Commerce Platform"
  },
  {
    id: 5,
    taskTitle: "Update UI Components Library",
    description: "Upgrade React component library to latest version and fix breaking changes.",
    dueDate: "2025-10-30",
    status: TaskStatus.TODO,
    priority: PriorityType.LOW,
    projectName: "Design System"
  }
];

const ViewTasks = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>(sampleTasks);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>(sampleTasks);
  const [updating, setUpdating] = useState<number | null>(null);
  
  // Filter states
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [filterPriority, setFilterPriority] = useState<string>("ALL");
  const [filterDate, setFilterDate] = useState<string>("");

  const handleStatusChange = (taskId: number, newStatus: string) => {
    setUpdating(taskId);
    // Simulate API call delay
    setTimeout(() => {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      );
      setUpdating(null);
      // Re-apply filters after status change
      applyFilters();
    }, 500);
  };

  const applyFilters = () => {
    let filtered = [...tasks];

    // Filter by status
    if (filterStatus !== "ALL") {
      filtered = filtered.filter((task) => task.status === filterStatus);
    }

    // Filter by priority
    if (filterPriority !== "ALL") {
      filtered = filtered.filter((task) => task.priority === filterPriority);
    }

    // Filter by date
    if (filterDate) {
      filtered = filtered.filter((task) => task.dueDate === filterDate);
    }

    setFilteredTasks(filtered);
  };

  const handleFilterClick = () => {
    applyFilters();
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case TaskStatus.TODO:
        return "bg-gray-100 text-gray-800";
      case TaskStatus.IN_PROGRESS:
        return "bg-blue-100 text-blue-800";
      case TaskStatus.DONE:
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case PriorityType.LOW:
        return "bg-green-100 text-green-800";
      case PriorityType.MEDIUM:
        return "bg-yellow-100 text-yellow-800";
      case PriorityType.HIGH:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back to Dashboard Button - Top Left */}
          <div className="mb-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="text-gray-600 hover:text-gray-900 font-medium flex items-center gap-2 transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Dashboard
            </button>
          </div>

          {/* Header Section */}
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg shadow-md p-6 mb-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">All Tasks</h1>
                <p className="text-purple-100">
                  View and manage all your assigned tasks
                </p>
              </div>
              <button
                onClick={() => {
                  setFilteredTasks([...sampleTasks]);
                  setTasks([...sampleTasks]);
                  setFilterStatus("ALL");
                  setFilterPriority("ALL");
                  setFilterDate("");
                }}
                className="bg-white text-purple-600 hover:bg-purple-50 font-medium py-2 px-4 rounded-md transition flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>
          </div>

          {/* Filter Controls */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Filter Tasks</h2>
            <div className="flex flex-wrap gap-4 items-end">
              {/* Status Filter */}
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="ALL">All Status</option>
                  <option value={TaskStatus.TODO}>To Do</option>
                  <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
                  <option value={TaskStatus.DONE}>Done</option>
                </select>
              </div>

              {/* Priority Filter */}
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="ALL">All Priorities</option>
                  <option value={PriorityType.LOW}>Low</option>
                  <option value={PriorityType.MEDIUM}>Medium</option>
                  <option value={PriorityType.HIGH}>High</option>
                </select>
              </div>

              {/* Date Filter */}
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date
                </label>
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Filter Button */}
              <div>
                <button
                  onClick={handleFilterClick}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-6 rounded-md transition flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  Filter
                </button>
              </div>
            </div>
          </div>

          {/* Tasks List */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Tasks List</h2>

            {filteredTasks.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  No tasks match your current filters. Try adjusting your filter criteria.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTasks.map((task) => (
                  <div
                    key={task.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                  >
                    {/* Responsive Flex Wrapper */}
                    <div className="flex flex-col md:flex-row justify-between gap-4 mb-3">

                      {/* LEFT SIDE: Title, Due Date, Description */}
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{task.taskTitle}</h3>
                          <div className="flex items-center gap-3 mt-1 sm:mt-0">
                            <div className="flex items-center text-sm text-gray-500 gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span>Due: {formatDate(task.dueDate)}</span>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityBadgeColor(task.priority)}`}>
                              {task.priority}
                            </span>
                          </div>
                        </div>

                        <p className="text-gray-600 text-sm mb-2">{task.description}</p>

                        {task.projectName && (
                          <p className="text-sm text-gray-500">
                            <span className="font-medium">Project:</span> {task.projectName}
                          </p>
                        )}
                      </div>

                      {/* RIGHT SIDE: Status Dropdown */}
                      <div className="flex flex-col sm:flex-row items-stretch gap-3 sm:items-end sm:justify-end sm:min-w-[200px]">
                        <div className="flex-1">
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Update Status
                          </label>
                          <select
                            value={task.status}
                            onChange={(e) => handleStatusChange(task.id, e.target.value)}
                            disabled={updating === task.id}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                          >
                            <option value={TaskStatus.TODO}>To Do</option>
                            <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
                            <option value={TaskStatus.DONE}>Done</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="flex gap-2 mt-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(task.status)}`}>
                        {task.status.replace("_", " ")}
                      </span>
                    </div>

                    {updating === task.id && (
                      <div className="mt-2 text-sm text-blue-600 flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Updating...
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ViewTasks;
