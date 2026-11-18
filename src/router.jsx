import { createBrowserRouter, Navigate } from "react-router";
import AppLayout from "./components/AppLayout";
import Split from "./pages/Split";
import Log from "./pages/Log";
import Progress from "./pages/Progress";
import Subscription from "./pages/Subscription";
import NotFound from "./pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: AppLayout,
    children: [
      { index: true, element: <Navigate to="/split" replace /> },
      { path: "split", Component: Split },
      { path: "log", Component: Log },
      { path: "progress", Component: Progress },
      { path: "subscription", Component: Subscription },
      { path: "*", Component: NotFound },
    ],
  },
]);
