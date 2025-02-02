import React, { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Copy,
  Upload,
  UserPlus,
  Trash2,
  Menu,
  X,
  LogOut,
  Loader2,
} from "lucide-react";
import swal from "sweetalert";
import toast from "react-hot-toast";
import AddAgentModal from "./AddAgentModal";
import {
  fetchAgents,
  uploadCsv,
  deleteAgent,
  adminLogout,
} from "../../api/admin";
import { removeAdminInfo } from "../../redux/slices/adminSlice";

const AdminDashboard = () => {
  const [agents, setAgents] = useState([]);
  const [visiblePasswords, setVisiblePasswords] = useState(new Set());
  const [showAddModal, setShowAddModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    loadAgents();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".password-controls")) {
        setVisiblePasswords(new Set());
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      const willLogout = await swal({
        title: "Are you sure you want to log out??",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      });

      if (willLogout) {
        const response = await adminLogout();
        if (response.status === 200) {
          dispatch(removeAdminInfo());
          navigate("/admin/login");
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

  const loadAgents = async () => {
    try {
      setIsLoading(true);
      const response = await fetchAgents();
      if (response.status === 200) {
        setAgents(response.data.agents);
      } else {
        toast.error(response.data.message || "Failed to load agents");
      }
    } catch (err) {
      toast.error("Error loading agents");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAgentAdded = (newAgent) => {
    setAgents((prev) => [...prev, newAgent]);
    setShowAddModal(false);
  };

  const handleDeleteAgent = async (agentId) => {
    try {
      const willDelete = await swal({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      });

      if (willDelete) {
        const response = await deleteAgent(agentId);

        if (response.status === 200) {
          setAgents((prev) => prev.filter((agent) => agent._id !== agentId));
          swal("Deleted!", "Agent has been deleted successfully.", "success");
          toast.success("Agent deleted successfully");
        } else {
          throw new Error(response.data?.message || "Failed to delete agent");
        }
      }
    } catch (error) {
      console.error("Delete agent error:", error);
      swal("Error!", "Failed to delete agent.", "error");
      toast.error(error.message || "Error deleting agent");
    }
  };

  const togglePasswordVisibility = (e, agentId) => {
    e.stopPropagation();
    setVisiblePasswords((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(agentId)) {
        newSet.delete(agentId);
      } else {
        newSet.add(agentId);
      }
      return newSet;
    });
  };

  const copyPassword = (e, password) => {
    e.stopPropagation();
    navigator.clipboard.writeText(password);
    toast.success("Password copied to clipboard");
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileExt = file.name.split(".").pop().toLowerCase();
    const validExtensions = ["csv", "xlsx", "xls"];

    if (!validExtensions.includes(fileExt)) {
      toast.error("Please upload a valid CSV, XLSX, or XLS file");
      return;
    }

    try {
      const response = await uploadCsv(file);
      if (response.status === 200) {
        toast.success("File uploaded successfully");
        await loadAgents();
      } else {
        toast.error(response.data?.message || "File upload failed");
      }
    } catch (error) {
      toast.error("Error uploading file");
    }
  };

  const tableHeaders = [
    { id: "name", label: "Name" },
    { id: "email", label: "Email" },
    { id: "mobile", label: "Mobile", className: "hidden md:table-cell" },
    { id: "password", label: "Password" },
    { id: "actions", label: "Actions" },
  ];

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

  const PasswordCell = ({ agent }) => {
    const isVisible = visiblePasswords.has(agent._id);

    return (
      <div className="flex items-center gap-2 password-controls">
        <span className="font-mono">
          {isVisible ? agent.password : "••••••••"}
        </span>
        <button
          onClick={(e) => togglePasswordVisibility(e, agent._id)}
          className="p-1 hover:bg-gray-100 rounded"
          title={isVisible ? "Hide Password" : "Show Password"}
        >
          {isVisible ? (
            <EyeOff className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
        </button>
        <button
          onClick={(e) => copyPassword(e, agent.password)}
          className="p-1 hover:bg-gray-100 rounded"
          title="Copy Password"
        >
          <Copy className="w-4 h-4" />
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md fixed w-full z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold text-[#EE4C7C]">
                AdminPanel
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
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mt-20">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
              <h1 className="text-2xl font-bold text-[#EE4C7C]">
                Agent Management
              </h1>
              <div className="flex gap-4 w-full md:w-auto">
                <button
                  disabled={agents.length === 0}
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 md:flex-none px-4 py-2 border border-gray-300 rounded-lg flex items-center justify-center gap-2 hover:bg-[#EE4C7C] hover:text-white transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  Upload CSV
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileUpload}
                />
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex-1 md:flex-none px-4 py-2 bg-[#EE4C7C] text-white rounded-lg flex items-center justify-center gap-2 hover:bg-[#EE4C7C]/90 transition-colors"
                >
                  <UserPlus className="w-4 h-4" />
                  Add Agent
                </button>
              </div>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-[#EE4C7C]" />
              </div>
            ) : agents.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">No agents found.</p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-4 py-2 bg-[#EE4C7C] text-white rounded-lg hover:bg-[#EE4C7C]/90"
                >
                  Start Adding Agents
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto mt-10">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {tableHeaders.map((header) => (
                        <th
                          key={header.id}
                          className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                            header.className || ""
                          }`}
                        >
                          {header.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {agents.map((agent) => (
                      <tr
                        key={`agent-${agent._id}`}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          {agent.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {agent.email}
                        </td>
                        <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap">
                          {agent.mobile}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <PasswordCell agent={agent} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleDeleteAgent(agent._id)}
                            className="p-1 hover:bg-red-100 rounded text-red-600"
                            title="Delete Agent"
                          >
                            <Trash2 className="w-4 h-4" />
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

      <AddAgentModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAgentAdded={handleAgentAdded}
      />
    </div>
  );
};

export default AdminDashboard;
