import userRoutes from "../endpoints/userEndpoints";
import Api from "./axiosConfig";

export const adminLogin = async (data) => {
  try {
    console.log("data", data);
    const response = await Api.post(userRoutes.login, data);
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
