import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import CreateProjectModal from "../../components/CreateProjectModal";
import CreateTaskModal from "../../components/CreateTaskModal";
import { UserService, ManagerService } from "../../services";
import { type taskStats, type ProjectResponse } from "../../types/api.types";

import {
  FiUsers,
  FiFolder,
  FiList,
  FiClock,
  FiPlus,
  FiFileText,
  FiEye,
  FiUserPlus,
  FiInbox,
  // FiActivity, // This icon is imported but not used, kept for completeness
} from "react-icons/fi";

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

    if (user?.role !== "MANAGER") {
      navigate("/dashboard");
      return;
    }

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
  };

  const fetchMembers = async () => {
    try {
      const response = await ManagerService.totalMembersInAllProjects();
      if (response.statusCode === 200) {
        setTotalMembers(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch total members:", error);
    }
  };

  const handleProjectSuccess = () => fetchProjects();
  const handleTaskSuccess = () => { };

  const handleAddMemberForEachProject = (projectId: number) => {
    navigate(`/${projectId}/add-member`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-lg text-blue-600 font-medium animate-pulse">
          Loading your workspace...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 rounded-lg shadow-md p-8 text-white">
            <h1 className="text-3xl font-bold mb-1 tracking-tight">Manager Dashboard</h1>
            <p className="text-blue-100 text-lg">
              Welcome back, <span className="font-semibold">{user?.name || "Manager"}</span>
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatsCard
              label="My Projects"
              value={projects.length}
              color="blue"
              Icon={<FiFolder className="w-6 h-6" />}
            />
            <StatsCard
              label="Total Tasks"
              value={taskStats?.totalTasks ?? 0}
              color="sky"
              Icon={<FiList className="w-6 h-6" />}
            />
            <StatsCard
              label="Team Members"
              value={totalMembers}
              color="indigo"
              Icon={<FiUsers className="w-6 h-6" />}
            />
            <StatsCard
              label="In Progress"
              value={taskStats?.tasksInProgress ?? 0}
              color="emerald"
              sub={`(${(taskStats?.inProgressPercentage ?? 0).toFixed(0)}%)`}
              Icon={<FiClock className="w-6 h-6" />}
            />
          </div>

          {/* Manager Quick Actions */}
          <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ActionButton
                color="blue"
                label="Create Project"
                Icon={<FiPlus className="w-5 h-5" />}
                onClick={() => setShowProjectModal(true)}
              />
              <ActionButton
                color="sky"
                label="Create Task"
                Icon={<FiFileText className="w-5 h-5" />}
                onClick={() => setShowTaskModal(true)}
              />
              <ActionButton
                color="indigo"
                label="View All Projects"
                Icon={<FiEye className="w-5 h-5" />}
                onClick={() => navigate("/projects")}
              />
            </div>
          </div>

          {/* Projects List */}
          <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">My Projects</h2>
            {projects.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                <FiInbox className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p>No projects yet. Create your first project!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow duration-200"
                  >
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {project.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                      {project.description}
                    </p>
                    <div className="flex gap-2">
                      {/* Assuming this view details button navigates to the project page */}
                      <button
                        onClick={() => navigate(`/projects/${project.id}`)}
                        className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded hover:bg-blue-100 transition flex items-center gap-2">
                        <FiEye className="w-4 h-4" />
                        View Details
                      </button>
                      <button
                        onClick={() =>
                          handleAddMemberForEachProject(project.id)
                        }
                        className="text-xs bg-indigo-50 text-indigo-600 px-3 py-1 rounded hover:bg-indigo-100 transition flex items-center gap-2"
                      >
                        <FiUserPlus className="w-4 h-4" />
                        Add Members
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Manager Profile */}
          <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Manager Profile</h2>
            <div className="space-y-3">
              <ProfileItem label="Name" value={user?.name || "N/A"} />
              <ProfileItem label="Email" value={user?.email || "N/A"} />
              <div className="flex items-center">
                <span className="text-gray-600 w-32">Role:</span>
                <span className="inline-block bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                  Manager
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      <CreateProjectModal
        isOpen={showProjectModal}
        onClose={() => setShowProjectModal(false)}
        onSuccess={handleProjectSuccess}
      />
      <CreateTaskModal
        isOpen={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        onSuccess={handleTaskSuccess}
      />
    </div>
  );
};

/* ---------- Small Styled Subcomponents ---------- */

const StatsCard = ({ label, value, color, sub, Icon }: any) => (
  <div className="bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-600 text-sm font-medium mb-1">{label}</p>
        <div className="flex items-baseline space-x-2">
          <p className={`text-3xl font-bold ${colorClass(color)}`}>{value}</p>
          {sub && <p className="text-sm text-gray-500">{sub}</p>}
        </div>
      </div>
      <div className={`${bgColorClass(color)} w-12 h-12 rounded-full flex items-center justify-center`}>
        {/* Using colorClass for the icon color */}
        <div className={`${colorClass(color)}`}>{Icon}</div>
      </div>
    </div>
  </div>
);

const ActionButton = ({ color, label, Icon, onClick }: any) => (
  <button
    onClick={onClick}
    // Updated to use buttonBgColorClass
    className={`${buttonBgColorClass(color)} hover:${bgColorClassHover(color)} text-white font-medium py-3 px-6 rounded-md transition flex items-center justify-center gap-2 shadow-sm hover:shadow-md`}
  >
    {Icon}
    {label}
  </button>
);

const ProfileItem = ({ label, value }: any) => (
  <div className="flex items-center">
    <span className="text-gray-600 w-32">{label}:</span>
    <span className="font-medium text-gray-900">{value}</span>
  </div>
);

/* ---------- Utility functions for tailwind color classes (simple mapping) ---------- */

const colorClass = (color: string) => {
  switch (color) {
    case "blue":
      return "text-blue-600";
    case "indigo":
      return "text-indigo-600";
    case "sky":
      return "text-sky-600";
    case "emerald":
      return "text-emerald-600";
    default:
      return "text-gray-800";
  }
};

// Background color for StatsCard icons/circles
const bgColorClass = (color: string) => {
  switch (color) {
    case "blue":
      return "bg-blue-50";
    case "indigo":
      return "bg-indigo-50";
    case "sky":
      return "bg-sky-50";
    case "emerald":
      return "bg-emerald-50";
    default:
      return "bg-gray-100";
  }
};

// Background color for Action Buttons (renamed from the second bgColorClass)
const buttonBgColorClass = (color: string) => {
  switch (color) {
    case "blue":
      return "bg-blue-600";
    case "indigo":
      return "bg-indigo-600";
    case "sky":
      return "bg-sky-600";
    case "emerald":
      return "bg-emerald-600";
    default:
      return "bg-gray-600";
  }
};

const bgColorClassHover = (color: string) => {
  switch (color) {
    case "blue":
      return "bg-blue-700";
    case "indigo":
      return "bg-indigo-700";
    case "sky":
      return "bg-sky-700";
    case "emerald":
      return "bg-emerald-700";
    default:
      return "bg-gray-700";
  }
};

export default ManagerDashboard;