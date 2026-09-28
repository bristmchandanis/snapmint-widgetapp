import { lazy } from "react";
import { appRoutesURL } from "./appRoutesURL";

const Dashboard = lazy(() => import("../pages/Dashboard.jsx"));
const Installation = lazy(() => import("../pages/Installation.jsx"));
const Widget = lazy(() => import("../pages/Widget.jsx"));

const routes = [
  {
    path: appRoutesURL.dashboard,
    element: <Dashboard />,
  },
  {
    path: appRoutesURL.installation,
    element: <Installation />,
  },
  {
    path: `${appRoutesURL.widget}/*`,
    element: <Widget />,
  },
];

export default routes;
