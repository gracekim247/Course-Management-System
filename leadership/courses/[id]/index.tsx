import { lazy } from "react";
import { Route } from "react-router-dom";
import specificSessionRoute from "./attendence/index";

const ViewCourse = lazy(() => import("./page"));

const specificCourseRoute = (
  <Route path="">
    <Route path=":course_id">
      <Route index element={<ViewCourse />} />
      {specificSessionRoute}
    </Route>
  </Route>
);

export default specificCourseRoute;
