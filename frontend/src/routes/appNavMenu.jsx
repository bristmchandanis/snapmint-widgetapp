import React from "react";
import { NavMenu } from "@shopify/app-bridge-react";
import { Link as RouterLink } from "react-router-dom";
import { appRoutesURL } from "./appRoutesURL";
import { useSelector } from "react-redux";

export const AppNavMenu = () => {
  const { storeDetails } = useSelector((state) => state.shop);

  const navigationLinks = [
    {
      id: "dashboard",
      label: "Dashboard",
      destination: appRoutesURL?.dashboard,
      display: true,
    },
    {
      id: "installation",
      label: "Installation",
      destination: appRoutesURL?.installation,
      display: true,
    },
    {
      id: "widget",
      label: "Widget",
      destination: appRoutesURL?.widget,
      display:
        storeDetails?.allowCustomization === "1" ||
        storeDetails?.allowCustomization === 1,
    },
  ];

  return (
    <React.Fragment>
      <NavMenu>
        {navigationLinks.map((x, index) =>
          x.display ? (
            <RouterLink to={x.destination} key={`${x.id}-${index}`}>
              {x.label}
            </RouterLink>
          ) : (
            ""
          ),
        )}
      </NavMenu>
    </React.Fragment>
  );
};
