import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LogOut, Menu, X, Loader2, Eye, Search, ChevronLeft, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import { getData, agentLogout } from "../../api/agent";
import { removeAgentInfo } from "../../redux/slices/agentSlice";

const AgentDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedNote, setSelectedNote] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [tasksPerPage] = useState(10);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { agentInfo } = useSelector((state) => state.agent);

  const loadTasks = async () => {
    try {
      setIsLoading(true);
      const response = await getData();
      if (response?.status === 200 && response?.data?.tasks) {
        setTasks(response.data.tasks);
      } else {
        setTasks([]);
        toast.error("No tasks data available");
      }
    } catch (err) {
      setTasks([]);
      toast.error(err?.message || "Error loading tasks");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (agentInfo?.user) {
      loadTasks();
    }
  }, [agentInfo]);

  const handleLogout = async () => {
    try {
      const response = await agentLogout();
      if (response?.status === 200) {
        dispatch(removeAgentInfo());
        navigate("/agent/login");
        toast.success("Logged out successfully");
      }
    } catch (error) {
      toast.error(error?.message || "Error during logout");
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const searchTerm = searchQuery.toLowerCase();
    const firstName = String(task.firstName || "").toLowerCase();
    const phone = String(task.phone || "").toLowerCase();
    
    return firstName.includes(searchTerm) || phone.includes(searchTerm);
  });

  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);
  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };

  const PaginationControls = () => {
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    const pageNumbers = [];
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex justify-center items-center space-x-2 mt-6">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {startPage > 1 && (
          <>
            <button
              onClick={() => paginate(1)}
              className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
            >
              1
            </button>
            {startPage > 2 && <span className="px-2">...</span>}
          </>
        )}

        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => paginate(number)}
            className={`px-4 py-2 rounded-lg border ${
              currentPage === number
                ? "bg-[#4CAF50] text-white border-[#4CAF50]"
                : "border-gray-300 hover:bg-gray-50"
            }`}
          >
            {number}
          </button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="px-2">...</span>}
            <button
              onClick={() => paginate(totalPages)}
              className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    );
  };

  const NotesModal = ({ note, onClose }) => {
    const handleOutsideClick = (e) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    };

    return (
      <div
        className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center p-4 z-50"
        onClick={handleOutsideClick}
      >
        <div
          className="bg-white rounded-xl max-w-md w-full p-6 border border-[#4CAF50] shadow-lg"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-[#4CAF50]">
              Customer Notes
            </h3>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <div className="max-h-[60vh] overflow-y-auto">
            <p className="text-gray-600 whitespace-pre-wrap">{note}</p>
          </div>
        </div>
      </div>
    );
  };

  const MobileMenu = () => (
    <div className="md:hidden bg-white border-t">
      <div className="px-2 pt-2 pb-3 space-y-1">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  const tableHeaders = [
    { id: "number", label: "#" },
    { id: "firstName", label: "First Name" },
    { id: "phone", label: "Phone" },
    { id: "notes", label: "Notes" },
  ];

  if (!agentInfo?.user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Please log in to view your dashboard.</p>
          <button
            onClick={() => navigate("/agent/login")}
            className="mt-4 px-4 py-2 bg-[#4CAF50] text-white rounded-lg hover:bg-[#4CAF50]/90 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {selectedNote && (
        <NotesModal note={selectedNote} onClose={() => setSelectedNote(null)} />
      )}

      <nav className="bg-white shadow-md fixed w-full z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold text-[#4CAF50]">
                {agentInfo.user}
              </span>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="p-2 rounded-md text-gray-600 hover:bg-gray-100 transition-colors"
              >
                {showMobileMenu ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
        {showMobileMenu && <MobileMenu />}
      </nav>

      <div className="pt-20 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mt-20">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
              <h1 className="text-2xl font-bold text-[#4CAF50]">My Tasks</h1>
              <div className="relative w-full md:w-96">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search by name or phone..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-[#4CAF50] focus:border-[#4CAF50] text-sm"
                />
              </div>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-[#4CAF50]" />
              </div>
            ) : Array.isArray(tasks) && tasks.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No tasks assigned yet.</p>
              </div>
            ) : filteredTasks.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No tasks found matching your search.</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {tableHeaders.map((header) => (
                          <th
                            key={header.id}
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            {header.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentTasks.map((task, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                            {(currentPage - 1) * tasksPerPage + index + 1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {task.firstName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {task.phone}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => setSelectedNote(task.notes)}
                              className="flex items-center gap-2 text-[#4CAF50] hover:text-[#4CAF50]/80 transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                              View Notes
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <PaginationControls />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentDashboard;