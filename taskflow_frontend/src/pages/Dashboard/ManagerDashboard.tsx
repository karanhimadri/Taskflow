import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import CreateProjectModal from "../../components/CreateProjectModal";
import CreateTaskModal from "../../components/CreateTaskModal";
import { UserService, ManagerService } from "../../services";
import { type taskStats, type ProjectResponse } from "../../types/api.types";

const ManagerDashboard = () => {
  const { user, isAuthenticated, setUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [projects, setProjects] = useState<ProjectResponse[]>([]);
  const [taskStats, setTaskStats] = useState<taskStats>();
  const [totalMembers, setTotalMembers] = useState<number>(0);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    // Check if user is MANAGER
    if (user?.role !== "MANAGER") {
      navigate("/dashboard");
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
    if (user?.role === "MANAGER") {
      fetchProjects();
      fetchTaskStats();
      fetchMembers();
    }
  }, [user]);

  const fetchProjects = async () => {
    try {
      const response = await ManagerService.getProjects();
      if (response.statusCode === 200) {
        setProjects(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    }
  };

  const fetchTaskStats = async () => {
    try {
      const response = await ManagerService.taskStatsByManagerId();
      if (response.statusCode === 200) {
        setTaskStats(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch TaskStats:", error);
    }
  }

  const fetchMembers = async () => {
    const response = await ManagerService.totalMembersInAllProjects();
    try {
      if (response.statusCode === 200) {
        setTotalMembers(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch total members:", error);
    }
  }

  const handleProjectSuccess = () => {
    fetchProjects();
  };

  const handleTaskSuccess = () => {
    // Optionally refresh task data
  };

  const handleAddMemberForEachProject = (projectId: number) => {
    navigate(`/${projectId}/add-member`)
  }

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
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg shadow-md p-6 mb-6 text-white">
            <h1 className="text-3xl font-bold mb-2">Manager Dashboard</h1>
            <p className="text-purple-100">
              Welcome back, <span className="font-medium">{user?.name || "Manager"}</span>
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">My Projects</p>
                  <p className="text-3xl font-bold text-blue-600">{projects.length}</p>
                </div>
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Total Tasks</p>
                  <p className="text-3xl font-bold text-green-600">{taskStats?.totalTasks}</p>
                </div>
                <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Team Members</p>
                  <p className="text-3xl font-bold text-purple-600">{totalMembers}</p>
                </div>
                <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <p className="text-gray-600 text-sm mb-1">In Progress</p>
                  <div className="flex items-baseline space-x-2">
                    <p className="text-3xl font-bold text-orange-600">
                      {taskStats?.tasksInProgress}
                    </p>
                    <p className="text-sm text-gray-500">
                      ({(taskStats?.inProgressPercentage ?? 0).toFixed(0)}%)
                    </p>
                  </div>
                </div>
                <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-orange-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Manager Quick Actions */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => setShowProjectModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-4 px-6 rounded-md transition flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Project
              </button>

              <button
                onClick={() => setShowTaskModal(true)}
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-4 px-6 rounded-md transition flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                Create Task
              </button>

              <button
                onClick={() => navigate("/projects")}
                className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-4 px-6 rounded-md transition flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                View All Projects
              </button>
            </div>
          </div>

          {/* Projects List */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">My Projects</h2>
            {projects.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p>No projects yet. Create your first project!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.map((project) => (
                  <div key={project.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                    <h3 className="font-semibold text-gray-900 mb-2">{project.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{project.description}</p>
                    <div className="flex gap-2">
                      <button className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded hover:bg-blue-100 transition">
                        View Details
                      </button>
                      <button className="text-xs bg-green-50 text-green-600 px-3 py-1 rounded hover:bg-green-100 transition"
                        onClick={() => handleAddMemberForEachProject(project.id)}
                      >
                        Add Members
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Manager Profile */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Manager Profile</h2>
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
                <span className="inline-block bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                  Manager
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={showProjectModal}
        onClose={() => setShowProjectModal(false)}
        onSuccess={handleProjectSuccess}
      />

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        onSuccess={handleTaskSuccess}
      />
    </div>
  );
};

export default ManagerDashboard;