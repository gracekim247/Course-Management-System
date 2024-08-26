import { Box, Card, Button } from "@mui/material";
import UpdateCourse from "./component/updateCourse";
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

export default function Content({ facilitatordata }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1); 
  };

  const buttonStyle = {
    width : "15%",
    m: 0,
    mb: -5,
    justifyContent: "left",
    '&:hover':  {
      background: "none",
      fontWeight: "bold",
      '& .MuiSvgIcon-root': { 
        fontWeight: "bold"
      }
    }
  };

  const mobileButtonStyle = {
    width : "auto",
    m: 0,
    mb: -5,
    justifyContent: "left"
  };

  return (
    <Box
      sx={{
        display: "flex",
        gap: 8,
        flexDirection: "column",
      }}
    >
      <Button 
      variant="text" 
      onClick={handleBackClick}
      sx={isMobile ? mobileButtonStyle : buttonStyle}
      size="medium"
      startIcon={ <ArrowBackIcon /> }
      >
        Back
      </Button>
      <UpdateCourse courseData={facilitatordata} />
    </Box>
  );
}