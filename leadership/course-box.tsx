import globalStyles from "@global-css"
import { Box, styled } from "@mui/material"

const CourseBox = styled(Box)(() => ({
    display: "flex",
    flexFlow: "row wrap",
    gap: "16px",
    "& > :not(style)": {
        padding: "16px",
        width: "144px",
        height: "144px",
        "&:hover": {
            backgroundColor: globalStyles["primaryColor"],
            color: "white"
        }
    },
}))

export default CourseBox
