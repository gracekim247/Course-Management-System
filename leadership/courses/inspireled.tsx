import { useGetCourseQuery } from "../../redux apis/course-api";
import LeaderShipDataGrid from "../leadershipDataGrid";
import { useEffect, useMemo } from "react";
import { useNotifications } from "@contexts/notifications-provider";
import { getFilteredCourses } from "@redux/selectors";
import { useSelector } from "react-redux";
import Course from "@server/enum/app/leadership/course";

export default function InspireLeadership() {
  const { notify } = useNotifications();
  const { isFetching, isError, error } = useGetCourseQuery(undefined);
  const data = useSelector(getFilteredCourses("IL"));
  const sorted = data.sort((a, b) => {
    const date1 = Date.parse(`${a.created_at}`)
    const date2 = Date.parse(`${b.created_at}`)
    return date2 - date1
  });

  const leadershiptype = Course.Inspiring_Leadership;


  useEffect(() => {
    if (isFetching || !isError) return;
    console.error(error);
    notify("An error occurred while fetching rounds.", "error");
  }, [isError, isFetching]);

  const breadcrumbLinks = [
    { to: -3, label: "Home" },
    { to: -2, label: "SPEAKHIRE programs" },
    { to: -1, label: "Leadership Courses" },
    { to: null, label: "IL courses", main: true },
  ];
  return (
    <LeaderShipDataGrid
      title="Interns Leadership Programs"
      breadcrumbLinks={breadcrumbLinks}
      data={sorted}
      isFetching={isFetching}
      leadershiptype={leadershiptype}
    />
  );
}
