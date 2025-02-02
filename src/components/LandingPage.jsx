import React from "react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#E3E2DF]">
      {/* Agent Section - Green */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#4CAF50] min-h-[50vh] lg:min-h-screen transition-all duration-300 hover:bg-[#4CAF50]/90">
        <Link to="/agent/login" className="w-full max-w-md text-center">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-white">I'm an Agent</h2>
            <p className="text-xl text-white/90">
              Access your tasks, manage assignments, and track your progress
            </p>
            <div className="mt-8">
              <button className="px-8 py-3 bg-white text-[#4CAF50] rounded-lg font-medium hover:bg-white/90 transition-colors duration-200">
                Go to Agent Portal
              </button>
            </div>
            <div className="mt-4 space-y-3 text-white/80">
              <p className="flex items-center justify-center">
                ✓ View assigned tasks
              </p>
              <p className="flex items-center justify-center">
                ✓ Track progress
              </p>
              <p className="flex items-center justify-center">
                ✓ Manage contacts
              </p>
            </div>
          </div>
        </Link>
      </div>

      {/* Admin Section - Pink */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white min-h-[50vh] lg:min-h-screen transition-all duration-300 hover:bg-gray-100">
        <Link to="/admin/login" className="w-full max-w-md text-center">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-[#EE4C7C]">I'm an Admin</h2>
            <p className="text-xl text-gray-600">
              Manage agents, distribute tasks, and oversee operations
            </p>
            <div className="mt-8">
              <button className="px-8 py-3 bg-[#EE4C7C] text-white rounded-lg font-medium hover:bg-[#EE4C7C]/90 transition-colors duration-200">
                Go to Admin Portal
              </button>
            </div>
            <div className="mt-4 space-y-3 text-gray-600">
              <p className="flex items-center justify-center">
                ✓ Agent management
              </p>
              <p className="flex items-center justify-center">
                ✓ Task distribution
              </p>
              <p className="flex items-center justify-center">
                ✓ CSV handling
              </p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;