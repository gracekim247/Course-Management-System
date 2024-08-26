import NavCrumbsLink from "@components/common/nav-crumbs/nav-crumbs-link";
import PageHeader from "@components/common/page-header";
import { useNotifications } from "@contexts/notifications-provider";
import { Stack } from "@mui/material";
import { useGetOneCourseQuery } from "@redux/apis/programs/leadership/course-api";
import { Suspense, useEffect } from "react";
import { useParams } from "react-router-dom";
import Error from "../error";
import Loader from "../loader";
import Content from "../content";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

export default function coursePage() {
  const { course_id: id } = useParams();
  const { notify } = useNotifications();

  const { data, isFetching, isError, error } = useGetOneCourseQuery(id!, {
    skip: !id,
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  console.log(data?.facilitatorTunnels);
  useEffect(() => {
    if (isFetching || !isError) return;
    notify("An error occurred while fetching Courses.", "error");
  }, [isError, isFetching]);

  return (
    <Stack 
      spacing={2} 
      p={isMobile ? 2 : 4}
    > 
      <PageHeader title={`Course Code - ${data?.course_code}`}>
        <NavCrumbsLink to={-4}>Home</NavCrumbsLink>
        <NavCrumbsLink to={-3}>SPEAKHIRE Programs</NavCrumbsLink>
        <NavCrumbsLink to={-2}>Leadership Courses</NavCrumbsLink>
        <NavCrumbsLink
          to={-1}
        >{`${data?.leadershiptype} Courses`}</NavCrumbsLink>
        <NavCrumbsLink main>{`${data?.course_code}`}</NavCrumbsLink>
      </PageHeader>
      {isFetching ? (
        <Loader />
      ) : isError || !data ? (
        <Error />
      ) : (
        <Suspense fallback={<Loader />}>
          {<Content facilitatordata={data} />}
        </Suspense>
      )}
    </Stack>
  );
}
