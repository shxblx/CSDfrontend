import agentRoutes from "../endpoints/agentEndPoints";
import Api from "./axiosConfig";

export const agentLogin = async (data) => {
  try {
    const response = await Api.post(agentRoutes.agentLogin, data);
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
export const agentLogout = async (data) => {
  try {
    const response = await Api.post(agentRoutes.login, data);
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

export const getData = async () => {
  try {
    const response = await Api.get(agentRoutes.getTasks);
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
