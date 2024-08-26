import { lazy } from "react";
import { Navigate, Route } from "react-router-dom";
import specificCourseRoute from "./[id]";

const Discoveringleadership = lazy(() => import("./discoverled"));
const Empoweringleadership = lazy(() => import("./empowerled"));
const Inspiringleadership = lazy(() => import("./inspireled"));

const CoursesRoutes = (
  <Route path="">
    <Route path="Discoveringleadership">
      <Route index element={<Discoveringleadership />} />
      {specificCourseRoute}
    </Route>
    <Route path="empoweringleadership">
      <Route index element={<Empoweringleadership />} />
      {specificCourseRoute}
    </Route>
    <Route path="inspiringleadership">
      <Route index element={<Inspiringleadership />} />
      {specificCourseRoute}
    </Route>
  </Route>
);

export default CoursesRoutes;
