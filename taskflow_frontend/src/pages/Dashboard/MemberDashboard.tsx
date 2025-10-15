import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { UserService, MemberService } from "../../services";
import type { TaskResponse } from "../../types/api.types";
import { TaskStatus, PriorityType } from "../../types/api.types";

const MemberDashboard = () => {
  const { user, isAuthenticated, setUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<TaskResponse[]>([]);
  const [updating, setUpdating] = useState<number | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    // Fetch complete user details if needed
    const fetchUserDetails = async () => {
      try {
        const response = await UserService.getUserDetails();
        if (response.statusCode === 200) {
          setUser(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch user details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!user?.name || !user?.email) {
      fetchUserDetails();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, navigate, user, setUser]);

  useEffect(() => {
    if (user?.role === "MEMBER") {
      fetchMyTasks();
    }
  }, [user]);

  const fetchMyTasks = async () => {
    try {
      const response = await MemberService.getMyTasks();
      if (response.statusCode === 200) {
        setTasks(response.data || []); // Gracefully handle empty array
      }
    } catch (error: any) {
      console.error("Failed to fetch tasks:", error);
      // Only show alert for actual errors (not 404/empty data)
      if (error.response?.status !== 404) {
        // Don't show alert, just log the error silently
        console.warn("Could not load tasks. Please try again later.");
      }
      // Set empty array so UI shows "no tasks" message instead of error
      setTasks([]);
    }
  };

  const handleStatusChange = async (taskId: number, newStatus: string) => {
    setUpdating(taskId);
    try {
      const response = await MemberService.updateTaskStatus(taskId, newStatus);
      if (response.statusCode === 200) {
        // Update task in local state
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === taskId ? { ...task, status: newStatus } : task
          )
        );
      }
    } catch (error) {
      console.error("Failed to update task status:", error);
      alert("Failed to update task status");
    } finally {
      setUpdating(null);
    }
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg shadow-md p-6 mb-6 text-white">
            <h1 className="text-3xl font-bold mb-2">Member Dashboard</h1>
            <p className="text-green-100">
              Welcome back, <span className="font-medium">{user?.name || "Member"}</span>
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Total Tasks</p>
                  <p className="text-3xl font-bold text-purple-600">{tasks.length}</p>
                </div>
                <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">To Do</p>
                  <p className="text-3xl font-bold text-gray-600">{tasks.filter((task) => task.status === TaskStatus.TODO).length}</p>
                </div>
                <div className="bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">In Progress</p>
                  <p className="text-3xl font-bold text-blue-600">{tasks.filter((task) => task.status === TaskStatus.IN_PROGRESS).length}</p>
                </div>
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Completed</p>
                  <p className="text-3xl font-bold text-green-600">{tasks.filter((task) => task.status === TaskStatus.DONE).length}</p>
                </div>
                <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex gap-4 flex-wrap">
              <button
                onClick={() => navigate("/tasks")}
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-md transition flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                View All Tasks
              </button>
              <button
                className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-md transition flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
                View Projects
              </button>
            </div>
          </div>

          {/* Tasks List */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">My Tasks</h2>

            {tasks.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  You don't have any tasks assigned yet.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {tasks.map((task) => (
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

          {/* User Info */}
          <div className="bg-white rounded-lg shadow-md p-6 mt-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Account Information</h2>
            <div className="space-y-3">
              <div className="flex items-center">
                <span className="text-gray-600 w-32">Name:</span>
                <span className="font-medium text-gray-900">{user?.name || "N/A"}</span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-600 w-32">Email:</span>
                <span className="font-medium text-gray-900">{user?.email || "N/A"}</span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-600 w-32">Role:</span>
                <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  {user?.role}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MemberDashboard;