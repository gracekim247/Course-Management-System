import NavCrumbsLink from "@components/common/nav-crumbs/nav-crumbs-link";
import PageHeader from "@components/common/page-header";
import FormButton from "@components/custom-mui/form-button";
import { Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CourseBox from "../course-box";

const COURSES_LIST = [
  { name: "Discovering leadership", to: "Discoveringleadership" },
  { name: "empowering leadership", to: "empoweringleadership" },
  { name: "inspiring leadership", to: "inspiringleadership" },
];

export default function Page() {
  const navigate = useNavigate();

  return (
    <Stack spacing={2} sx={{ p: 4 }}>
      <PageHeader title="Leadership Programs">
        <NavCrumbsLink to={-2}>Home</NavCrumbsLink>
        <NavCrumbsLink to={-1}>SPEAKHIRE Programs</NavCrumbsLink>
        <NavCrumbsLink main>Leadership Programs</NavCrumbsLink>
      </PageHeader>
      <CourseBox>
        {COURSES_LIST.map(({ name, to }, i) => (
          <FormButton key={i} onClick={() => navigate(to)}>
            {name}
          </FormButton>
        ))}
      </CourseBox>
    </Stack>
  );
}
