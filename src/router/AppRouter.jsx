import { Route, Routes } from "react-router-dom";
import AdminRouter from "./AdminRouter";
import AgentRouter from "./AgentRouter";
import LandingPage from "../components/LandingPage";

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/admin/*" element={<AdminRouter />} />
      <Route path="/agent/*" element={<AgentRouter />} />
      <Route path="/" element={<LandingPage />} />
    </Routes>
  );
};

export default AppRouter;
