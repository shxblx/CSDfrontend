import adminRoutes from "../endpoints/adminEndPoints";
import Api from "./axiosConfig";

export const adminLogin = async (data) => {
  try {
    const response = await Api.post(adminRoutes.adminLogin, data);
    return response;
  } catch (error) {
    if (error.response) {
      console.log(error.response);
      return error.response;
    } else {
      console.error("Error", error.message);
    }
    throw error;
  }
};
export const adminLogout = async () => {
  try {
    const response = await Api.post(adminRoutes.adminLogout);
    return response;
  } catch (error) {
    if (error.response) {
      console.log(error.response);
      return error.response;
    } else {
      console.error("Error", error.message);
    }
    throw error;
  }
};

export const addAgent = async (data) => {
  try {
    const response = await Api.post(adminRoutes.addAgent, data);
    return response;
  } catch (error) {
    if (error.response) {
      console.log(error.response);
      return error.response;
    } else {
      console.error("Error", error.message);
    }
    throw error;
  }
};

export const deleteAgent = async (agentId) => {
  try {
    const response = await Api.delete(adminRoutes.deleteAgent, {
      data: { agentId },
    });
    return response;
  } catch (error) {
    if (error.response) {
      console.error("Delete Agent Error:", error.response.data);
      return error.response;
    } else {
      console.error("Error:", error.message);
    }
    throw error;
  }
};

export const fetchAgents = async (data) => {
  try {
    const response = await Api.get(adminRoutes.fetchAgents);
    return response;
  } catch (error) {
    if (error.response) {
      console.log(error.response);
      return error.response;
    } else {
      console.error("Error", error.message);
    }
    throw error;
  }
};

export const uploadCsv = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    console.log(formData);
    const response = await Api.post(adminRoutes.uploadCsv, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (error) {
    if (error.response) {
      console.log(error.response);
      return error.response;
    } else {
      console.error("Error", error.message);
    }
    throw error;
  }
};
