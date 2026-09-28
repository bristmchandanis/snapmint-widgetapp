// routes/index.jsx - Instant render
import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { appRoutesURL } from "./appRoutesURL";
import { baseUrl } from "../../utils/Constent";
import routes from "./routes";

const AppRoutes = () => {
  return (
    <Routes>
      {(routes || []).map((route, index) => (
        <Route
          key={`${route.path}-${index}`}
          path={route.path}
          element={route.element}
        />
      ))}
      <Route
        path={`${baseUrl}`}
        element={<Navigate to={`${appRoutesURL?.dashboard}`} replace />}
      />
    </Routes>
  );
};

export default AppRoutes;
