import { Route, Routes } from "react-router-dom";
import UserRouter from "./UserRouter.jsx";

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/*" element={<UserRouter />} />
    </Routes>
  );
};
