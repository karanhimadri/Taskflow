import { useEffect, useState, useMemo } from "react";
import debounce from "lodash.debounce";
import { UserService, ManagerService } from "../services";
import type { AuthResponse } from "../types/api.types";
import { useLocation, useParams } from "react-router-dom";

// Sample project data
type LocationState = {
  title: string,
  description: string
};

const AddMember = () => {

  const { id } = useParams<{ id: string }>();
  const projectId = Number(id);
  const location = useLocation();
  const state = location.state as LocationState | null;

  if (!state) {
    return <div>No data received.</div>;
  }

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
  const [selectedMemberDetails, setSelectedMemberDetails] = useState<AuthResponse[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<AuthResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);

  const fetchMembers = async (query: string) => {
    if (query.length < 2) {
      setFilteredMembers([]);
      return;
    }

    setLoading(true);
    try {
      const response = await UserService.searchAvailableMembers(projectId, query);
      if (response.statusCode === 200) {
        setFilteredMembers(response.data || []);
      }
    } catch (err) {
      console.error("Failed to search members:", err);
      setFilteredMembers([]);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchMembers = useMemo(() => debounce(fetchMembers, 500), []);

  useEffect(() => {
    if (searchQuery) {
      debouncedFetchMembers(searchQuery);
    } else {
      setFilteredMembers([]);
    }

    return () => {
      debouncedFetchMembers.cancel();
    };
  }, [searchQuery, debouncedFetchMembers]);

  const handleSelectMember = (memberId: number) => {
    if (selectedMembers.includes(memberId)) {
      // Deselect
      setSelectedMembers(selectedMembers.filter((id) => id !== memberId));
      setSelectedMemberDetails(selectedMemberDetails.filter((m) => m.id !== memberId));
    } else {
      // Select
      setSelectedMembers([...selectedMembers, memberId]);
      const memberDetail = filteredMembers.find((m) => m.id === memberId);
      if (memberDetail) {
        setSelectedMemberDetails([...selectedMemberDetails, memberDetail]);
      }
    }
  };

  const handleAddMembers = async () => {
    if (selectedMembers.length === 0) {
      alert("Please select at least one member to add.");
      return;
    }

    // Create member IDs array for API call
    const memberIds = selectedMembers;

    setAdding(true);
    try {
      const response = await ManagerService.addMembers(projectId, { memberIds });

      if (response.statusCode === 200 || response.statusCode === 201) {
        const selectedMemberNames = selectedMemberDetails
          .map((member) => member.name)
          .join(", ");

        alert(`✅ Success!\n\nAdded ${selectedMembers.length} member(s) to project:\n${selectedMemberNames}\n\nMessage: ${response.message || 'Members added successfully'}`);

        // Clear selections after successful add
        setSelectedMembers([]);
        setSelectedMemberDetails([]);
        setSearchQuery("");
        setFilteredMembers([]);
      } else {
        alert(`⚠️ Warning: ${response.message || 'Unexpected response from server'}`);
      }
    } catch (error: any) {
      console.error("Failed to add members:", error);

      // Handle different error types
      if (error.response) {
        // Server responded with error
        const errorMessage = error.response.data?.message || error.response.data?.error || 'Failed to add members';
        alert(`❌ Error: ${errorMessage}\n\nStatus: ${error.response.status}`);
      } else if (error.request) {
        // Request made but no response
        alert("❌ Network Error: Could not connect to server. Please check if the backend is running.");
      } else {
        // Other errors
        alert(`❌ Error: ${error.message || 'Failed to add members'}`);
      }
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Add Members to Project</h1>
          <p className="text-gray-600">Search and select members to add to your project</p>
        </div>

        {/* Project Info Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                {state.title}
              </h2>
              <p className="text-gray-600 text-sm">
                Project ID: <span className="font-medium">#{projectId}</span>
              </p>
              <p className="text-gray-500 text-sm mt-2">{state.description}</p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search Members by Name (min 2 characters)
          </label>
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Type member name to search..."
              className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <svg
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {loading && (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <svg className="animate-spin h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            )}
          </div>
          {searchQuery && searchQuery.length >= 2 && !loading && (
            <p className="mt-2 text-sm text-gray-500">
              Found {filteredMembers.length} member{filteredMembers.length !== 1 ? 's' : ''}
            </p>
          )}
          {searchQuery && searchQuery.length < 2 && (
            <p className="mt-2 text-sm text-yellow-600">
              Please enter at least 2 characters to search
            </p>
          )}
        </div>

        {/* Search Results */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">
              {searchQuery ? "Search Results" : "All Members"}
            </h3>
            {selectedMembers.length > 0 && (
              <button
                onClick={handleAddMembers}
                disabled={adding}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {adding ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add {selectedMembers.length} Member{selectedMembers.length !== 1 ? 's' : ''}
                  </>
                )}
              </button>
            )}
          </div>

          {filteredMembers.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No members found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchQuery
                  ? `No members match "${searchQuery}"`
                  : "No members available"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Select
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Member ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredMembers.map((member) => (
                    <tr
                      key={member.id}
                      className={`hover:bg-gray-50 transition ${selectedMembers.includes(member.id) ? "bg-blue-50" : ""
                        }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedMembers.includes(member.id)}
                          onChange={() => handleSelectMember(member.id)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">#{member.id}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-medium text-sm">
                              {member.name?.split(" ").map(n => n[0]).join("") || "?"}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{member.name || "Unknown"}</div>
                            <div className="text-xs text-gray-500">{member.role || "MEMBER"}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600">{member.email || "N/A"}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Selected Members Summary */}
        {selectedMembers.length > 0 && (
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-blue-900 mb-1">
                  {selectedMembers.length} Member{selectedMembers.length !== 1 ? 's' : ''} Selected
                </h4>
                <p className="text-sm text-blue-700">
                  {selectedMemberDetails
                    .map((member) => member.name)
                    .join(", ")}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddMember;