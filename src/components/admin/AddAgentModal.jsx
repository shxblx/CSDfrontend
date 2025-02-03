import React, { useState } from "react";
import { X, Loader2 } from "lucide-react";
import swal from "sweetalert";
import toast from "react-hot-toast";
import { addAgent } from "../../api/admin";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const AddAgentModal = ({ isOpen, onClose, onAgentAdded }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [newAgent, setNewAgent] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
  });

  const generatePassword = () => {
    const length = 12;
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setNewAgent((prev) => ({ ...prev, password }));
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleAddAgent = async (e) => {
    e.preventDefault();

    if (!validateEmail(newAgent.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (!newAgent.mobile) {
      toast.error("Please enter a valid phone number");
      return;
    }

    setIsLoading(true);
    try {
      const response = await addAgent(newAgent);
      if (response.status === 201) {
        onAgentAdded(response.data.agent);
        toast.success(response.data.message);
        setNewAgent({
          name: "",
          email: "",
          mobile: "",
          password: "",
        });
        onClose();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      swal("Error!", "Failed to add agent", "error");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const handleOutsideClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handlePhoneChange = (value) => {
    setNewAgent((prev) => ({
      ...prev,
      mobile: "+" + value,
    }));
  };

  return (
    <div
      className="fixed inset-0 backdrop-blur-xs flex items-center justify-center p-4 z-50"
      onClick={handleOutsideClick}
    >
      <div className="bg-white rounded-xl max-w-md w-full p-6 border border-[#EE4C7C]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add New Agent</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleAddAgent} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              value={newAgent.name}
              onChange={(e) =>
                setNewAgent((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EE4C7C]"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={newAgent.email}
              onChange={(e) =>
                setNewAgent((prev) => ({ ...prev, email: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EE4C7C]"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mobile Number
            </label>
            <PhoneInput
              country={"in"}
              value={newAgent.mobile.replace("+", "")} // Remove plus sign for the input
              onChange={handlePhoneChange}
              containerClass="w-full"
              inputClass="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EE4C7C]"
              buttonClass="border border-gray-300 rounded-lg"
              enableSearch={true}
              searchClass="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EE4C7C]"
              searchPlaceholder="Search country..."
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newAgent.password}
                onChange={(e) =>
                  setNewAgent((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EE4C7C]"
                required
              />
              <button
                type="button"
                onClick={generatePassword}
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Generate
              </button>
            </div>
          </div>
          <div className="flex gap-2 justify-end mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#EE4C7C] text-white rounded-lg hover:bg-[#EE4C7C]/90 flex items-center gap-2"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              Add Agent
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAgentModal;
