import { Outlet, Navigate } from "react-router";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { useMeQuery } from "./store/api/userSlice";
import { setTheme } from "./store/userPreferenceSlice";

const AppShellShimmer = () => {
  return (
    <main className="min-h-screen bg-base-200 p-3 md:p-6">
      <div className="mx-auto flex w-full max-w-7xl gap-4">
        <aside className="hidden w-64 shrink-0 rounded-2xl border border-base-300 bg-base-100 p-4 md:block">
          <div className="skeleton h-10 w-40 rounded-xl" />
          <div className="mt-6 space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={`nav-item-${index}`} className="skeleton h-10 w-full rounded-xl" />
            ))}
          </div>
        </aside>

        <section className="w-full rounded-2xl border border-base-300 bg-base-100 p-4 md:p-6">
          <div className="skeleton h-9 w-52 rounded-xl" />
          <div className="mt-2 skeleton h-4 w-72 rounded-lg" />

          <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={`stat-card-${index}`}
                className="rounded-2xl border border-base-300 p-3"
              >
                <div className="skeleton h-3 w-16 rounded" />
                <div className="mt-2 skeleton h-7 w-24 rounded" />
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-base-300 p-4">
            <div className="skeleton h-8 w-36 rounded-lg" />
            <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={`row-${index}`} className="skeleton h-14 rounded-xl" />
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

const RouteProtector = () => {
  const dispatch = useDispatch();
  const {
    data: user,
    isLoading,
    isError,
  } = useMeQuery(undefined, {
    refetchOnFocus: false,
    refetchOnReconnect: false,
    refetchOnMountOrArgChange: false,
  });

  useEffect(() => {
    const userTheme = user?.user?.theme;
    if (userTheme === "light" || userTheme === "dark") {
      dispatch(setTheme(userTheme));
    }
  }, [dispatch, user?.user?.theme]);

  if (isLoading) {
    return <AppShellShimmer />;
  }

  if (isError || !user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default RouteProtector;
