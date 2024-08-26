import { Box } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { useTheme } from "@mui/material/styles";
import UpdateCourseFormModal from "../utils/updateCourseFormModal";

export default function updateCourse({courseData}) {
   const theme = useTheme();
   return(
    <Grid
    container
    spacing={1}
    sx={{ width: "auto", border: "2px solid black", borderRadius: "18px", padding: 2}}
  >
    <Grid xs={12} md={12}>
      <Box 
      sx={{ m: 2 }}
      >
         <UpdateCourseFormModal courseData={courseData} /> 
      </Box>
    </Grid>
  </Grid>
   )
} 