import React, { createContext, useState, useEffect } from "react";

export const WorkshopContext = createContext();

export const WorkshopProvider = ({ children }) => {
  const storedLocation = localStorage.getItem("location");
  const initialLocation = storedLocation ? JSON.parse(storedLocation) : null;
  const [isLocationSet, setIsLocationSet] = useState(!!initialLocation);
  const [location, setLocation] = useState(initialLocation);

  useEffect(() => {
    if (location) {
      localStorage.setItem("location", JSON.stringify(location));
    }
  }, [location]);

  return (
    <WorkshopContext.Provider
      value={{ isLocationSet, location, setIsLocationSet, setLocation }}
    >
      {children}
    </WorkshopContext.Provider>
  );
};
