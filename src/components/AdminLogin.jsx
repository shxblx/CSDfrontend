import React, { useState } from "react";
import { adminLogin } from "../api/user";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserInfo } from "../redux/slices/userSlice";
import toast from "react-hot-toast";

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "email":
        if (!validateEmail(value)) {
          error = "Please enter a valid email address";
        }
        break;
      case "password":
        if (value.length < 8) {
          error = "Password must be at least 8 characters long";
        }
        break;
      default:
        break;
    }

    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));

    return error === "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    const isEmailValid = validateField("email", formData.email);
    const isPasswordValid = validateField("password", formData.password);

    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    setLoading(true);
    try {
      const response = await adminLogin(formData);
      if (response.status === 200) {
        dispatch(
          setUserInfo({
            user: response.data.name,
            userId: response.data.userId,
          })
        );
        navigate("/dashboard");
        toast.success("Login successful!");
      } else {
        toast.error(response.data.message || "Login failed");
      }
    } catch (error) {
      setSubmitError(error.message || "An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    validateField(name, value);
  };

  return (
    <div className="min-h-screen flex bg-[#E3E2DF]">
      <div className="hidden lg:flex w-1/2 items-center justify-center p-12 bg-[#EE4C7C]">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold text-white mb-6">
            Agent Management Portal
          </h1>
          <p className="text-xl text-white/90">
            Streamline your agent operations with our powerful management
            system. Upload CSV lists, distribute tasks efficiently, and manage
            your team all in one place.
          </p>
          <div className="mt-8 space-y-4 text-white/80">
            <p className="flex items-center">
              ✓ Easy agent onboarding and management
            </p>
            <p className="flex items-center">
              ✓ Automated task distribution system
            </p>
            <p className="flex items-center">
              ✓ CSV upload and validation features
            </p>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-white rounded-xl p-8 shadow-lg">
          <h2 className="text-3xl font-bold text-[#EE4C7C] mb-8 text-center">
            Welcome Back Admin
          </h2>

          {submitError && (
            <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-md text-sm">
              {submitError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg bg-gray-50 border ${
                  errors.email
                    ? "border-red-500"
                    : "border-gray-200 focus:border-[#EE4C7C]"
                } text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#EE4C7C]/30`}
                placeholder="Enter your email"
                required
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-2">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg bg-gray-50 border ${
                  errors.password
                    ? "border-red-500"
                    : "border-gray-200 focus:border-[#EE4C7C]"
                } text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#EE4C7C]/30`}
                placeholder="Enter your password"
                required
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-2">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#EE4C7C] text-white py-3 px-6 rounded-lg font-medium hover:bg-[#EE4C7C]/90 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#EE4C7C] focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
