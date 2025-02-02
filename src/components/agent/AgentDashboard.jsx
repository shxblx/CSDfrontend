import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LogOut, Menu, X, Loader2, Eye } from "lucide-react";
import swal from "sweetalert";
import toast from "react-hot-toast";
import { getData, agentLogout } from "../../api/agent";
import { removeAgentInfo } from "../../redux/slices/agentSlice";

const AgentDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedNote, setSelectedNote] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { agentInfo } = useSelector((state) => state.agent);

  useEffect(() => {
    loadTasks();
  }, []);

  const handleLogout = async () => {
    try {
      const willLogout = await swal({
        title: "Are you sure you want to log out?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      });

      if (willLogout) {
        const response = await agentLogout();
        if (response.status === 200) {
          dispatch(removeAgentInfo());
          navigate("/agentlogin");
          toast.success("Logged out successfully");
        } else {
          throw new Error(response.data?.message || "Logout failed");
        }
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error(error.message || "Error during logout");
    }
  };

  const loadTasks = async () => {
    try {
      setIsLoading(true);
      const response = await getData(agentInfo.userId);
      if (response.status === 200) {
        setTasks(response.data.tasks);
      } else {
        toast.error(response.data.message || "Failed to load tasks");
      }
    } catch (err) {
      toast.error("Error loading tasks");
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewNotes = (notes) => {
    setSelectedNote(notes);
    swal({
      title: "Notes",
      text: notes,
      button: "Close",
    });
  };

  const MobileMenu = () => (
    <div className="md:hidden bg-white border-t">
      <div className="px-2 pt-2 pb-3 space-y-1">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  const tableHeaders = [
    { id: "firstName", label: "First Name" },
    { id: "phone", label: "Phone" },
    { id: "notes", label: "Notes" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md fixed w-full z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold text-[#EE4C7C]">
                AgentPanel
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
                className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
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
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-[#EE4C7C]">My Tasks</h1>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-[#EE4C7C]" />
              </div>
            ) : tasks.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No tasks assigned yet.</p>
              </div>
            ) : (
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
                    {tasks.map((task, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          {task.firstName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {task.phone}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleViewNotes(task.notes)}
                            className="flex items-center gap-2 text-[#EE4C7C] hover:text-[#EE4C7C]/80"
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentDashboard;
