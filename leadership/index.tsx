import { lazy } from "react";
import { Route } from "react-router-dom";
import CoursesRoutes from "./courses";

const Dashboard = lazy(() => import("./page"));

const LeaderRoutes = (
  <Route path="leadershipcourses">
    <Route path="" element={<Dashboard />} />
    {CoursesRoutes}
  </Route>
);

export default LeaderRoutes;
