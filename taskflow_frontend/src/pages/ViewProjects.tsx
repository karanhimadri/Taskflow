import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/UserContext";
import { ManagerService } from "../services";
import type { ProjectResponse } from "../types/api.types";
import {
  FiArrowLeft,
  FiRefreshCw,
  FiUsers,
  FiEye,
  FiTrash2,
  FiFolder,
  FiClock,
} from "react-icons/fi";
import toast, { type Toast } from "react-hot-toast";


const ViewProjects = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<ProjectResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    fetchProjects();
  }, [isAuthenticated, navigate]);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await ManagerService.getProjects();
      if (response.statusCode === 200) {
        setProjects(response.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = (projectId: number, projectName: string) => {
    // First step: ask for confirmation
    toast((t: Toast) => (
      <div className="flex flex-col gap-2">
        <p>Are you sure you want to delete <strong>{projectName}</strong>?</p>
        <div className="flex gap-2 justify-end">
          <button
            className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
            onClick={() => toast.dismiss(t.id)}
          >
            Cancel
          </button>
          <button
            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
            onClick={async () => {
              toast.dismiss(t.id); // dismiss confirmation toast
              await confirmDelete(projectId, projectName);
            }}
          >
            Delete
          </button>
        </div>
      </div>
    ), {
      duration: Infinity, // keep until user clicks
    });
  };

  // Actual deletion logic
  const confirmDelete = async (projectId: number, projectName: string) => {
    try {
      const response = await ManagerService.deleteProject(projectId);
      if (response.statusCode === 200) {
        toast.success(`Project "${projectName}" deleted successfully!`);
        setProjects(prev => prev.filter(p => p.id !== projectId));
      }
    } catch (error: any) {
      console.error("Failed to delete project:", error);
      const errorMessage = error.response?.data?.message || "Failed to delete project";
      toast.error(`Error: ${errorMessage}`);
    }
  };

  const handleAddMembers = (project: ProjectResponse) => {
    navigate(`/${project.id}/add-member`, {
      state: {
        title: project.name,
        description: project.description,
      },
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        {/* Spinner */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-lg text-gray-600">Loading projects...</p>
        </div>
      </div>
    );
  };


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center text-gray-600 hover:text-gray-900 mb-2 transition"
            >
              <FiArrowLeft className="w-5 h-5 mr-1" />
              Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold text-gray-900">My Projects</h1>
            <p className="text-gray-600 mt-1">Manage and view all your projects</p>
          </div>
          <button
            onClick={fetchProjects}
            className="bg-gray-200 hover:bg-gray-300 text-black font-medium px-6 py-3 rounded-lg transition flex items-center gap-2"
          >
            <FiRefreshCw className="w-5 h-5" />
            Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-4">
            <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center">
              <FiFolder className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Projects</p>
              <p className="text-3xl font-bold text-gray-900">{projects.length}</p>
            </div>
          </div>
        </div>

        {/* Projects List */}
        {projects.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center space-y-4">
            <FiFolder className="mx-auto h-16 w-16 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900">No Projects Yet</h3>
            <p className="text-gray-500">Get started by creating your first project</p>
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition"
            >
              Create Project
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  {/* Project Info */}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{project.name}</h3>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                        ID: #{project.id}
                      </span>
                      <div className="flex items-center gap-1 text-sm text-gray-700">
                        <FiClock className="w-4 h-4 text-gray-400" />
                        Created:{" "}
                        <span className="font-medium ml-1">
                          {new Date().toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4">{project.description}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleAddMembers(project)}
                      className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition flex items-center gap-2"
                    >
                      <FiUsers className="w-4 h-4" />
                      Add Members
                    </button>

                    <button
                      onClick={() => alert(`View details for project: ${project.name}`)}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition flex items-center gap-2"
                    >
                      <FiEye className="w-4 h-4" />
                      View Details
                    </button>

                    <button
                      onClick={() => handleDeleteProject(project.id, project.name)}
                      className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition flex items-center gap-2"
                    >
                      <FiTrash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewProjects;
