import { Outlet, Navigate } from "react-router";

import { useMeQuery } from "./store/api/userSlice";

const RouteProtector = () => {
  const {
    data: user,
    isLoading,
    isError,
  } = useMeQuery(undefined, {
    refetchOnFocus: false,
    refetchOnReconnect: false,
    refetchOnMountOrArgChange: false,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default RouteProtector;
